import { describe, expect, it } from "vitest";
import { validateAuthCredentials } from "./authValidation";

describe("validateAuthCredentials", () => {
  it("normalizes a valid email and accepts a strong-enough password", () => {
    expect(
      validateAuthCredentials({
        email: "  Ogrenci@Example.com ",
        password: "guclu-sifre",
      }),
    ).toEqual({
      success: true,
      data: {
        email: "ogrenci@example.com",
        password: "guclu-sifre",
      },
    });
  });

  it("rejects invalid email addresses", () => {
    const result = validateAuthCredentials({
      email: "gecersiz",
      password: "guclu-sifre",
    });

    expect(result.success).toBe(false);
  });

  it("rejects passwords shorter than eight characters", () => {
    const result = validateAuthCredentials({
      email: "ogrenci@example.com",
      password: "kisa",
    });

    expect(result.success).toBe(false);
  });
});
