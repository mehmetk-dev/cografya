export type GeographicalRegion = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  provinceCodes: number[];
};

export const GEOGRAPHICAL_REGIONS: GeographicalRegion[] = [
  {
    id: "marmara",
    name: "Marmara",
    shortName: "Marmara",
    color: "#5f7da8",
    provinceCodes: [10, 11, 16, 17, 22, 34, 39, 41, 54, 59, 77],
  },
  {
    id: "aegean",
    name: "Ege",
    shortName: "Ege",
    color: "#5e9e96",
    provinceCodes: [3, 9, 20, 35, 43, 45, 48, 64],
  },
  {
    id: "mediterranean",
    name: "Akdeniz",
    shortName: "Akdeniz",
    color: "#e28a4e",
    provinceCodes: [1, 7, 15, 31, 32, 33, 46, 80],
  },
  {
    id: "central-anatolia",
    name: "İç Anadolu",
    shortName: "İç Anadolu",
    color: "#d2a84b",
    provinceCodes: [6, 18, 26, 38, 40, 42, 50, 51, 58, 66, 68, 70, 71],
  },
  {
    id: "black-sea",
    name: "Karadeniz",
    shortName: "Karadeniz",
    color: "#2f80a8",
    provinceCodes: [5, 8, 14, 19, 28, 29, 37, 52, 53, 55, 57, 60, 61, 67, 69, 74, 78, 81],
  },
  {
    id: "eastern-anatolia",
    name: "Doğu Anadolu",
    shortName: "Doğu Anadolu",
    color: "#9b6f9e",
    provinceCodes: [4, 12, 13, 23, 24, 25, 30, 36, 44, 49, 62, 65, 75, 76],
  },
  {
    id: "southeastern-anatolia",
    name: "Güneydoğu Anadolu",
    shortName: "Güneydoğu",
    color: "#c96b53",
    provinceCodes: [2, 21, 27, 47, 56, 63, 72, 73, 79],
  },
];

export function getRegionById(id: string) {
  return GEOGRAPHICAL_REGIONS.find((region) => region.id === id);
}

export function applyProvinceFill(
  current: Record<string, string>,
  provinceCodes: number[],
  color: string | null,
) {
  const next = { ...current };
  const validCodes = new Set(
    provinceCodes.filter(
      (code) => Number.isInteger(code) && code >= 1 && code <= 81,
    ),
  );

  validCodes.forEach((code) => {
    if (color) {
      next[String(code)] = color;
    } else {
      delete next[String(code)];
    }
  });

  return next;
}
