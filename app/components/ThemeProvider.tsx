"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { MantineProvider } from "@mantine/core";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(
  theme: Theme,
  systemTheme: ResolvedTheme
): ResolvedTheme {
  return theme === "system" ? systemTheme : theme;
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lastThemeChangeAt = useRef(0);

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const saved = localStorage.getItem("theme");

    if (
      saved === "dark" ||
      saved === "light" ||
      saved === "system"
    ) {
      return saved;
    }

    return "light";
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(
    () => getSystemTheme()
  );

  const resolvedTheme = resolveTheme(theme, systemTheme);

  // Terapkan tema ke tampilan.
  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      resolvedTheme === "dark"
    );

    localStorage.setItem("theme", theme);
  }, [resolvedTheme, theme]);

  // Pantau perubahan tema sistem perangkat.
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Sinkronkan tema dengan server setiap 15 detik.
  useEffect(() => {
    let cancelled = false;

    const syncWithServer = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      // Beri waktu agar pilihan tema terbaru tersimpan.
      if (Date.now() - lastThemeChangeAt.current < 5000) {
        return;
      }

      try {
        const response = await fetch("/api/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const result = await response.json();
        const data = Array.isArray(result?.data)
          ? result.data[0]
          : result?.data;

        const serverTheme = data?.tema;

        if (
          cancelled ||
          (serverTheme !== "dark" &&
            serverTheme !== "light" &&
            serverTheme !== "system")
        ) {
          return;
        }

        if (serverTheme !== localStorage.getItem("theme")) {
          setTheme(serverTheme);
          localStorage.setItem("theme", serverTheme);
        }
      } catch (error) {
        console.warn(
          "Gagal menyinkronkan tema dari server.",
          error
        );
      }
    };

    void syncWithServer();

    const interval = window.setInterval(() => {
      void syncWithServer();
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  // Dengarkan perubahan tema dari halaman Pengaturan.
  useEffect(() => {
    const handleThemeEvent = (event: Event) => {
      const newTheme = (event as CustomEvent).detail;

      if (
        newTheme !== "dark" &&
        newTheme !== "light" &&
        newTheme !== "system"
      ) {
        return;
      }

      lastThemeChangeAt.current = Date.now();
      localStorage.setItem("theme", newTheme);
      setTheme(newTheme);
    };

    window.addEventListener(
      "kasirkilat-theme-change",
      handleThemeEvent
    );

    return () => {
      window.removeEventListener(
        "kasirkilat-theme-change",
        handleThemeEvent
      );
    };
  }, []);

  const toggleTheme = async () => {
    const newTheme: Theme =
      theme === "light" ? "dark" : "light";

    lastThemeChangeAt.current = Date.now();
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch("/api/settings/tema", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tema: newTheme }),
      });

      if (!response.ok) {
        console.warn("Tema gagal disimpan ke server.");
      }
    } catch (error) {
      console.warn("Gagal menyimpan tema ke server:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        toggleTheme,
      }}
    >
      <MantineProvider forceColorScheme={resolvedTheme}>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme harus digunakan di dalam ThemeProvider"
    );
  }

  return context;
}