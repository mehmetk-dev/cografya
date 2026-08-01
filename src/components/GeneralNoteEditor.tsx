import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Bold, List as ListIcon, ListOrdered } from "lucide-react";
import { sanitizeGeneralNoteHtml } from "../generalNoteRichText";

type GeneralNoteEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

export function GeneralNoteEditor({
  value,
  onChange,
}: GeneralNoteEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const [textColor, setTextColorState] = useState("#c0392b");

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) editor.innerHTML = value;
  }, [value]);

  const rememberSelection = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
      selectionRef.current = range.cloneRange();
    }
  };

  const restoreSelection = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection) return;
    editor.focus();
    if (!selectionRef.current) return;
    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  };

  const publishChange = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const sanitized = sanitizeGeneralNoteHtml(editor.innerHTML);
    if (sanitized !== editor.innerHTML) editor.innerHTML = sanitized;
    onChange(sanitized);
    rememberSelection();
  };

  const runCommand = (command: string) => {
    restoreSelection();
    document.execCommand(command, false);
    publishChange();
  };

  const setTextColor = (color: string) => {
    restoreSelection();
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (
      range.collapsed ||
      !editor.contains(range.commonAncestorContainer)
    ) {
      return;
    }
    const span = document.createElement("span");
    span.style.color = color;
    span.append(range.extractContents());
    range.insertNode(span);
    selection.removeAllRanges();
    const coloredRange = document.createRange();
    coloredRange.selectNodeContents(span);
    selection.addRange(coloredRange);
    publishChange();
  };

  return (
    <div className="general-note-editor">
      <div
        className="general-note-editor__toolbar"
        aria-label="Not biçimlendirme araçları"
      >
        <button
          type="button"
          title="Kalın"
          aria-label="Kalın"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("bold")}
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          title="Madde işaretli liste"
          aria-label="Madde işaretli liste"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("insertUnorderedList")}
        >
          <ListIcon size={16} />
        </button>
        <button
          type="button"
          title="Numaralı liste"
          aria-label="Numaralı liste"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("insertOrderedList")}
        >
          <ListOrdered size={16} />
        </button>
        <label
          title="Yazı rengi"
          style={{ "--general-note-color": textColor } as CSSProperties}
        >
          <span aria-hidden="true">A</span>
          <input
            type="color"
            value={textColor}
            aria-label="Yazı rengi"
            onMouseDown={rememberSelection}
            onInput={(event) => {
              setTextColorState(event.currentTarget.value);
              setTextColor(event.currentTarget.value);
            }}
          />
        </label>
      </div>
      <div
        ref={editorRef}
        className="general-note-editor__surface"
        role="textbox"
        aria-label="Genel harita notu"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Örn. Türkiye'de dağlar genel olarak doğu-batı yönünde uzanır..."
        onInput={publishChange}
        onKeyUp={rememberSelection}
        onMouseUp={rememberSelection}
        onBlur={rememberSelection}
      />
    </div>
  );
}
