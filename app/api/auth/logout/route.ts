import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const authorization = request.headers.get("authorization");

        const response = await fetch("https://belajar-express-production-7cfb.up.railway.app/auth/logout", {
            method: "POST",
            headers: {
                Authorization: authorization ?? "",
            },
            cache: "no-store",
        });

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error("ERROR LOGOUT API:", error);

        return NextResponse.json(
            { pesan: "Gagal menghubungi server logout" },
            { status: 502 }
        );
    }
}
