"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Undo, Redo } from "lucide-react";

import { Button } from "@/components/ui/button";
import "./tiptap-styles.css";

type TiptapEditorProps = {
  content: string;
  onChange?: (content: string) => void; // 읽기 전용일 땐 필수 아님
  readOnly?: boolean; // 읽기 전용(내부적으로 위험한 스크립트를 파싱 단계에서 차단함)
  placeholder?: string;
  className?: string;
};

export default function TiptapEditor({
  content,
  onChange,
  placeholder = "내용을 입력하세요",
  className = "",
  readOnly = false, // 기본값은 편집 가능 모드
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content,
    editable: !readOnly, // readOnly가 true면 편집 불가
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // 기본 에디터 영역 스타일링
        class: `tiptap focus:outline-none text-base leading-relaxed prose max-w-none ${
          readOnly ? "min-h-0 p-0" : "min-h-[250px] p-4"
        }`,
      },
    },
  });

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
      <EditorContent editor={editor} />
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
