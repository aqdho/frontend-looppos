"use client";

import { useRouter } from "next/navigation";
import { Button } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        try {
            if (token) {
                const response = await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    alert("Logout gagal. Periksa koneksi server, lalu coba lagi.");
                    return;
                }
            }

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            router.replace("/login");
        } catch (error) {
            console.error("ERROR LOGOUT:", error);
            alert("Server tidak dapat dihubungi. Sesi belum dipastikan berakhir.");
        }
    };

    return (
        <Button
            fullWidth
            variant="light"
            color="red"
            leftSection={<IconLogout size={18} />}
            onClick={handleLogout}
        >
            Logout
        </Button>
    );
}
