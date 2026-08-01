const RICH_NOTE_PREFIX = "<!--atlas-rich-note:v1-->";

const ALLOWED_TAGS = new Set([
  "B",
  "STRONG",
  "UL",
  "OL",
  "LI",
  "DIV",
  "P",
  "BR",
  "SPAN",
]);

const BLOCKED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "SVG",
  "MATH",
  "IMG",
  "LINK",
  "META",
]);

function safeColor(value: string) {
  const trimmed = value.trim();
  return /^(#[0-9a-f]{6}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\))$/i.test(
    trimmed,
  )
    ? trimmed
    : "";
}

function unwrap(element: Element) {
  element.replaceWith(...Array.from(element.childNodes));
}

export function sanitizeGeneralNoteHtml(html: string) {
  const template = document.createElement("template");
  template.innerHTML = html;

  Array.from(template.content.querySelectorAll<HTMLElement>("*"))
    .reverse()
    .forEach((element) => {
      if (BLOCKED_TAGS.has(element.tagName)) {
        element.remove();
        return;
      }

      if (element.tagName === "FONT") {
        const color = safeColor(element.getAttribute("color") ?? "");
        if (!color) {
          unwrap(element);
          return;
        }
        const span = document.createElement("span");
        span.style.color = color;
        span.append(...Array.from(element.childNodes));
        element.replaceWith(span);
        return;
      }

      if (!ALLOWED_TAGS.has(element.tagName)) {
        unwrap(element);
        return;
      }

      const color =
        element.tagName === "SPAN" ? safeColor(element.style.color) : "";
      Array.from(element.attributes).forEach((attribute) =>
        element.removeAttribute(attribute.name),
      );
      if (color) element.setAttribute("style", `color: ${color}`);
    });

  return template.innerHTML;
}

function plainTextFromHtml(html: string) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return (template.content.textContent ?? "").replace(/\u00a0/g, " ").trim();
}

export function generalNoteToEditorHtml(note: string) {
  if (note.startsWith(RICH_NOTE_PREFIX)) {
    return sanitizeGeneralNoteHtml(note.slice(RICH_NOTE_PREFIX.length));
  }

  const container = document.createElement("div");
  container.textContent = note;
  return container.innerHTML.replace(/\r?\n/g, "<br>");
}

export function serializeGeneralNoteHtml(html: string) {
  const sanitized = sanitizeGeneralNoteHtml(html);
  return plainTextFromHtml(sanitized)
    ? `${RICH_NOTE_PREFIX}${sanitized}`
    : "";
}

export function generalNoteCharacterCount(html: string) {
  return plainTextFromHtml(html).length;
}
