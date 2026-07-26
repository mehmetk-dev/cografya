import { describe, expect, it } from "vitest";
import {
  applyProvinceFill,
  GEOGRAPHICAL_REGIONS,
  getRegionById,
} from "./regionPainting";

describe("coğrafi bölge boyama", () => {
  it("81 ilin her birini tam olarak bir hazır bölgeye yerleştirir", () => {
    const provinceCodes = GEOGRAPHICAL_REGIONS.flatMap(
      (region) => region.provinceCodes,
    );

    expect(provinceCodes).toHaveLength(81);
    expect(new Set(provinceCodes).size).toBe(81);
    expect([...provinceCodes].sort((left, right) => left - right)).toEqual(
      Array.from({ length: 81 }, (_, index) => index + 1),
    );
  });

  it("Karadeniz Bölgesi seçildiğinde 18 ili birlikte döndürür", () => {
    const blackSea = getRegionById("black-sea");

    expect(blackSea?.name).toBe("Karadeniz");
    expect(blackSea?.provinceCodes).toHaveLength(18);
    expect(blackSea?.provinceCodes).toEqual(
      expect.arrayContaining([5, 8, 14, 28, 52, 53, 55, 61, 74, 81]),
    );
  });

  it("seçilen illeri boyarken diğer bölge renklerini korur", () => {
    expect(
      applyProvinceFill(
        { "34": "#111111", "35": "#222222" },
        [53, 61, 55],
        "#2f80a8",
      ),
    ).toEqual({
      "34": "#111111",
      "35": "#222222",
      "53": "#2f80a8",
      "55": "#2f80a8",
      "61": "#2f80a8",
    });
  });

  it("silgi modunda yalnızca dokunulan illerin bölge rengini kaldırır", () => {
    expect(
      applyProvinceFill(
        {
          "34": "#111111",
          "53": "#2f80a8",
          "55": "#2f80a8",
          "61": "#2f80a8",
        },
        [53, 61],
        null,
      ),
    ).toEqual({
      "34": "#111111",
      "55": "#2f80a8",
    });
  });

  it("geçersiz ve yinelenen il kodlarını yok sayar", () => {
    expect(
      applyProvinceFill({}, [0, 34, 34, 82, Number.NaN], "#d05f64"),
    ).toEqual({ "34": "#d05f64" });
  });
});
