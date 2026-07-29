import { NextResponse } from "next/server";

const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").replace(/\D/g, "");
    const email = String(form.get("email") || "").trim();
    const idea = String(form.get("idea") || "").trim();
    const file = form.get("file");

    if (!name || !email || !idea) {
      return NextResponse.json({ error: "Completa nombre, email y propuesta." }, { status: 400 });
    }

    if (phone.length !== 10) {
      return NextResponse.json({ error: "El teléfono debe tener 10 dígitos." }, { status: 400 });
    }

    if (file instanceof File) {
      if (!ALLOWED.includes(file.type)) {
        return NextResponse.json({ error: "Solo se permiten archivos PDF o Word." }, { status: 400 });
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "El archivo supera el máximo de 8MB." }, { status: 400 });
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Propuesta recibida correctamente.",
      data: {
        name,
        phone,
        email,
        hasFile: file instanceof File,
      },
    });
  } catch {
    return NextResponse.json({ error: "No se pudo procesar la propuesta." }, { status: 500 });
  }
}
