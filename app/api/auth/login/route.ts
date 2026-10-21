export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      "https://belajar-express-production-7cfb.up.railway.app/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();

    console.log("Login backend status:", response.status);

    try {
      return Response.json(JSON.parse(text), {
        status: response.status,
      });
    } catch {
      console.error("Login backend returned non-JSON response");

      return Response.json(
        { pesan: "Respons backend tidak valid" },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error(
      "Login proxy error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return Response.json(
      { pesan: "Tidak dapat terhubung ke server" },
      { status: 500 }
    );
  }
}