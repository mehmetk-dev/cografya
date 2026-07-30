import { describe, expect, it } from "vitest";
import { READY_STUDY_SETS, getReadySet } from "./readySets";

describe("KPSS odaklı hazır coğrafya setleri", () => {
  it("Türkiye dağlarını 68 kayıtlık özel atlas görünümüyle sunar", () => {
    const set = getReadySet("mountains");

    expect(set).toBeDefined();
    expect(set?.items).toHaveLength(68);
    expect(set?.presentation).toBe("mountain-atlas");
    expect(new Set(set?.items.map((entry) => entry.id)).size).toBe(68);
    expect(
      set?.items.every(
        (entry) =>
          entry.sourceLabel?.includes("MEB") &&
          entry.sourceUrl?.includes("meb.gov.tr"),
      ),
    ).toBe(true);
  });

  it("MEB haritasındaki 15 önemli platoyu kaynaklarıyla sunar", () => {
    const set = getReadySet("plateaus");

    expect(set).toBeDefined();
    expect(set?.items).toHaveLength(15);
    expect(new Set(set?.items.map((entry) => entry.id)).size).toBe(15);
    expect(
      set?.items.every(
        (entry) =>
          entry.provinceCode >= 1 &&
          entry.provinceCode <= 81 &&
          entry.sourceLabel?.includes("MEB") &&
          entry.sourceUrl?.includes("meb"),
      ),
    ).toBe(true);
    expect(set?.quizQuestions.length).toBeGreaterThanOrEqual(8);
  });

  it("güncel resmî listedeki 50 millî parkı eksiksiz sunar", () => {
    const set = getReadySet("national-parks");

    expect(set).toBeDefined();
    expect(set?.items).toHaveLength(50);
    expect(new Set(set?.items.map((entry) => entry.id)).size).toBe(50);
    expect(
      set?.items.every(
        (entry) =>
          entry.provinceCode >= 1 &&
          entry.provinceCode <= 81 &&
          entry.sourceLabel === "DKMP güncel liste" &&
          entry.sourceUrl?.includes("tarimorman.gov.tr/DKMP"),
      ),
    ).toBe(true);
    expect(set?.quizQuestions.length).toBeGreaterThanOrEqual(8);
  });

  it("hazır set kimliklerini benzersiz tutar", () => {
    const ids = READY_STUDY_SETS.map((set) => set.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
