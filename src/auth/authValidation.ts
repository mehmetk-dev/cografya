import { z } from "zod";

const authCredentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Geçerli bir e-posta adresi gir.")
    .max(254, "E-posta adresi çok uzun."),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalı.")
    .max(128, "Şifre en fazla 128 karakter olabilir."),
});

export function validateAuthCredentials(input: {
  email: string;
  password: string;
}) {
  return authCredentialsSchema.safeParse(input);
}
