"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JSONContent } from "@tiptap/react";

import { Button } from "@/components/ui/button";
import Title from "@/components/common/header/Title";
import {
  useCreateParentPostSVC,
  useCreateStudentPostSVC,
  useGetMyChildrenSVC,
} from "@/hooks/SVC/useCommunicationSVC";
import {
  AuthorRole,
  CreateStudentPostRequest,
} from "@/types/communication/studentPost";
import { useAuthContext } from "@/providers/AuthProvider";
import { CreateStudentParentPostRequest } from "@/types/communication/studentPost";

import CreateContentSVC from "./_components/content/CreateContentSVC";
import WriterTypeSelect from "./_components/setting/WriterTypeSelect";
import LectureOptionSelect from "./_components/setting/LectureOptionSelect";

export default function CreateInquiryPostPageSVC() {
  const router = useRouter();
  const { user } = useAuthContext();

  const studentMutation = useCreateStudentPostSVC();
  const parentMutation = useCreateParentPostSVC();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<JSONContent>({});
  const [selectedLectureId, setSelectedLectureId] = useState("");
  const [attachment, setAttachment] = useState<File | undefined>(undefined);

  // 유저 정보에 따른 작성자 역할 고정
  const authorRole: AuthorRole =
    user?.userType === "PARENT" ? "PARENT" : "STUDENT";

  const { data: myChildren } = useGetMyChildrenSVC();

  const effectiveChildId = myChildren?.[0]?.id || "";

  // 게시글 등록
  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    // JSON 데이터 내용 체크
    const isContentEmpty =
      !content || !content.content || content.content.length === 0;

    if (isContentEmpty) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (!selectedLectureId) {
      alert("강의를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    // 서버 전송 직전에만 Stringify 실행
    formData.append("content", JSON.stringify(content));
    formData.append("lectureId", selectedLectureId);

    if (attachment) {
      formData.append("file", attachment);
    }

    const onSuccessAction = {
      onSuccess: () => router.push(`/learners/communication`),
    };

    if (user?.userType === "PARENT") {
      // 학부모일 경우 추가 데이터 삽입
      if (effectiveChildId) {
        formData.append("childLinkId", effectiveChildId);
      }

      parentMutation.mutate(
        formData as CreateStudentParentPostRequest,
        onSuccessAction
      );
    } else {
      studentMutation.mutate(
        formData as CreateStudentPostRequest,
        onSuccessAction
      );
    }
  };

  const isSubmitting = studentMutation.isPending || parentMutation.isPending;

  return (
    <div className="container mx-auto px-8 py-8 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between gap-4">
        <Title title="게시글 등록" description="새로운 게시글을 작성합니다." />

        <Button
          variant="outline"
          onClick={() => router.back()}
          className="max-w-[180px] h-[50px] w-full rounded-lg text-base cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          뒤로가기
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <WriterTypeSelect selectedAuthorRole={authorRole} />

          <LectureOptionSelect
            selectedLectureId={selectedLectureId}
            onLectureIdChange={setSelectedLectureId}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <CreateContentSVC
            title={title}
            setTitle={setTitle}
            content={content} // JSONContent 객체를 그대로 전달
            setContent={setContent}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => router.back()}
            attachment={attachment} // 현재 파일 상태 (미리보기용)
            setAttachment={setAttachment} // 파일 변경 함수 (추가/삭제 공용)
          />
        </div>
      </div>
    </div>
  );
}
