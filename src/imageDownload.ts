const OBJECT_URL_LIFETIME_MS = 1_000;

export function downloadImageBlob(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  globalThis.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, OBJECT_URL_LIFETIME_MS);
}
