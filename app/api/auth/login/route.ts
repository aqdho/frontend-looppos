export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      "https://belajar-express-production-52cf.up.railway.app/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Login API error:", error);

    return Response.json(
      { pesan: "Tidak dapat terhubung ke server" },
      { status: 500 }
    );
  }
}