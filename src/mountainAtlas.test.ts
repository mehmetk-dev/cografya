import { describe, expect, it } from "vitest";
import {
  MOUNTAIN_ATLAS_ENTRIES,
  MOUNTAIN_ATLAS_LAYOUTS,
} from "./mountainAtlas";

describe("Türkiye dağları atlas verisi", () => {
  it("referanstaki 68 dağı oluşum türleriyle eksiksiz sunar", () => {
    expect(MOUNTAIN_ATLAS_ENTRIES).toHaveLength(68);
    expect(new Set(MOUNTAIN_ATLAS_ENTRIES.map((entry) => entry.id)).size).toBe(
      68,
    );

    const subtypeCounts = Object.fromEntries(
      [
        "mountain-fold",
        "mountain-fault-block",
        "mountain-volcanic",
      ].map((subtype) => [
        subtype,
        MOUNTAIN_ATLAS_ENTRIES.filter((entry) => entry.subtype === subtype)
          .length,
      ]),
    );

    expect(subtypeCounts).toEqual({
      "mountain-fold": 48,
      "mountain-fault-block": 8,
      "mountain-volcanic": 12,
    });
  });

  it("referanstaki ayırt edici dağ adlarını tam yazar", () => {
    const labels = new Set(
      MOUNTAIN_ATLAS_ENTRIES.map((entry) => entry.label),
    );

    [
      "Koru–Işık Dağları",
      "Bolu–Ilgaz Dağları",
      "Rize–Kaçkar Dağları",
      "Dedegöl–Geyik Dağları",
      "Munzur–Mercan Dağları",
      "Karasu–Aras Dağları",
      "Güneydoğu Toroslar",
      "Büyük Ağrı Dağı",
      "Küçük Ağrı Dağı",
      "İhtiyar Şahap Dağları",
      "Buzul Dağları",
    ].forEach((label) => expect(labels.has(label), label).toBe(true));

    expect(
      MOUNTAIN_ATLAS_ENTRIES.filter(
        (entry) => entry.label === "Karacadağ",
      ).map((entry) => entry.id),
    ).toEqual(["karacadag-ic-anadolu", "karacadag-guneydogu"]);
  });

  it("her dağı güvenli harita ve etiket koordinatlarıyla eşler", () => {
    expect(Object.keys(MOUNTAIN_ATLAS_LAYOUTS)).toHaveLength(68);

    MOUNTAIN_ATLAS_ENTRIES.forEach((entry) => {
      const layout = MOUNTAIN_ATLAS_LAYOUTS[entry.id];
      expect(layout, `${entry.label} için yerleşim bulunmalı`).toBeDefined();
      expect(layout.point.x, `${entry.label} x`).toBeGreaterThanOrEqual(45);
      expect(layout.point.x, `${entry.label} x`).toBeLessThanOrEqual(1015);
      expect(layout.point.y, `${entry.label} y`).toBeGreaterThanOrEqual(145);
      expect(layout.point.y, `${entry.label} y`).toBeLessThanOrEqual(590);
      expect(
        layout.point.x + layout.labelOffset.x,
        `${entry.label} etiket x`,
      ).toBeGreaterThanOrEqual(30);
      expect(
        layout.point.x + layout.labelOffset.x,
        `${entry.label} etiket x`,
      ).toBeLessThanOrEqual(1025);
      expect(
        layout.point.y + layout.labelOffset.y,
        `${entry.label} etiket y`,
      ).toBeGreaterThanOrEqual(130);
      expect(
        layout.point.y + layout.labelOffset.y,
        `${entry.label} etiket y`,
      ).toBeLessThanOrEqual(600);
    });
  });

  it("MEB kaynağını her kayıtta taşır", () => {
    expect(
      MOUNTAIN_ATLAS_ENTRIES.every(
        (entry) =>
          entry.sourceLabel.includes("MEB") &&
          entry.sourceUrl.includes("meb.gov.tr"),
      ),
    ).toBe(true);
  });
});
