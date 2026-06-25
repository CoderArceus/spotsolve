import { getAuth } from "firebase-admin/auth";

export async function GET() {
  return Response.json({ ok: !!getAuth });
}
