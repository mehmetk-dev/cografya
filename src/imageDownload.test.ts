import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadImageBlob } from "./imageDownload";

describe("downloadImageBlob", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("PNG dosyasını geçici Blob adresiyle güvenli biçimde indirir", () => {
    vi.useFakeTimers();

    const click = vi.fn();
    const remove = vi.fn();
    const appendChild = vi.fn();
    const anchor = {
      href: "",
      download: "",
      rel: "",
      click,
      remove,
    };
    const createObjectURL = vi.fn(() => "blob:cografya-gorseli");
    const revokeObjectURL = vi.fn();

    vi.stubGlobal("document", {
      createElement: vi.fn(() => anchor),
      body: { appendChild },
    });
    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL,
    });

    const image = new Blob(["png"], { type: "image/png" });
    downloadImageBlob(image, "milli-parklar.png");

    expect(createObjectURL).toHaveBeenCalledWith(image);
    expect(anchor).toMatchObject({
      href: "blob:cografya-gorseli",
      download: "milli-parklar.png",
      rel: "noopener",
    });
    expect(appendChild).toHaveBeenCalledWith(anchor);
    expect(click).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledOnce();
    expect(revokeObjectURL).not.toHaveBeenCalled();

    vi.runAllTimers();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:cografya-gorseli");
  });
});
