// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  // Waktu app pertama kali dibuka ke path "/", langsung diarahkan ke /login
  return <Redirect href="/login" />;
}