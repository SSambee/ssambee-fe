import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Paperclip,
} from "lucide-react";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
    }
  };

  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      updateToolbar();
    });
  });

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
      <Button
        variant="outline"
        className={`h-8 w-8 ${isBold ? "bg-muted" : ""}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        type="button"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className={`h-8 w-8 ${isItalic ? "bg-muted" : ""}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        type="button"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className={`h-8 w-8 ${isUnderline ? "bg-muted" : ""}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        type="button"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="outline"
        className="h-8 w-8"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        type="button"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        type="button"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        type="button"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        type="button"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="outline"
        className="h-8 w-8"
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        type="button"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8"
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        type="button"
      >
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="outline"
        className="h-8 w-8"
        onClick={() => {
          // TODO: 파일 첨부 기능 구현
          alert("파일 첨부 기능은 추후 구현 예정입니다.");
        }}
        type="button"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      <ToolbarPlugin />
      <HistoryPlugin />
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="min-h-[300px]">
              <div className="p-4" ref={onRef}>
                <ContentEditable placeholder={"내용을 입력하세요..."} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </div>
  );
}
