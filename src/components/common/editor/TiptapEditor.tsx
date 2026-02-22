"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo,
  Redo,
  Paperclip,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import "./tiptap-styles.css";

type TiptapEditorProps = {
  content: string | JSONContent;
  onChange?: (json: JSONContent) => void;
  readOnly?: boolean; // 읽기 전용(내부적으로 위험한 스크립트를 파싱 단계에서 차단함)
  placeholder?: string;
  className?: string;
  onFileUpload?: (file: File) => void;
  attachment?: File;
  onRemoveAttachment?: () => void;
};

export default function TiptapEditor({
  content,
  onChange,
  onFileUpload,
  placeholder = "내용을 입력하세요",
  className = "",
  readOnly = false, // 기본값은 편집 가능 모드
  attachment,
  onRemoveAttachment,
}: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: content, // 초기 로드,
    editable: !readOnly, // readOnly가 true면 편집 불가
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // 타이핑할 때마다 JSON 객체만 부모로 전달
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        // 기본 에디터 영역 스타일링
        class: `tiptap focus:outline-none p-4 prose max-w-none h-full ${
          readOnly ? "min-h-0 p-0" : "min-h-[200px] p-4"
        }`,
      },
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (!editor) return;

    // 현재 에디터의 JSON과 외부에서 들어온 content 객체 비교
    const currentJson = JSON.stringify(editor.getJSON());
    const incomingJson = JSON.stringify(content);

    if (incomingJson !== currentJson) {
      // JSON 객체를 그대로 주입 (Tiptap이 알아서 안전하게 처리)
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  // readOnly 상태값 변화도 실시간으로 에디터에 반영 ---
  useEffect(() => {
    if (editor) editor.setEditable(!readOnly);
  }, [readOnly, editor]);

  if (!editor) return null;

  // 읽기 전용 모드일 때는 툴바 없이 내용만 렌더링
  if (readOnly) {
    return <EditorContent editor={editor} className={className} />;
  }

  return (
    <div className={`border rounded-lg bg-white overflow-hidden ${className}`}>
      {/* 툴바 영역 */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        {onFileUpload && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" // 화면에서 숨김
            />
            <ToolbarButton onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="h-4 w-4" />
            </ToolbarButton>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
          </>
        )}

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* 실제 에디터 입력창 */}
      <div className="relative flex-1 overflow-y-auto bg-white custom-scrollbar">
        <EditorContent editor={editor} />
      </div>

      {attachment && (
        <>
          <div className="border-t border-slate-150" />
          <div className="mx-4 my-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-white rounded-lg border shadow-sm shrink-0">
                <Paperclip className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-slate-700 truncate max-w-[400px]">
                {attachment.name}
              </span>
            </div>
            <Button
              type="button" // 폼 제출 방지
              variant="outline"
              onClick={onRemoveAttachment}
              className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// 툴바 버튼 공통 컴포넌트
function ToolbarButton({
  children,
  onClick,
  active = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={`h-8 w-8 p-0 ${active ? "bg-gray-200 text-blue-600" : "text-gray-600"}`}
    >
      {children}
    </Button>
  );
}
