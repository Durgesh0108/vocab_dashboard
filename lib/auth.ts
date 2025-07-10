import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function auth() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return user as { id: string; email: string };
  } catch (err) {
    console.log(err)
    return null;
  }
}
