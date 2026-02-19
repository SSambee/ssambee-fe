"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import Title from "@/components/common/header/Title";
import {
  useCreateParentPostSVC,
  useCreateStudentPostSVC,
} from "@/hooks/SVC/useCommunicationSVC";
import { AuthorRole } from "@/types/communication/studentPost";
import { useAuthContext } from "@/providers/AuthProvider";

import CreateContentSVC from "./_components/content/CreateContentSVC";
import WriterTypeSelect from "./_components/setting/WriterTypeSelect";
import LectureOptionSelect from "./_components/setting/LectureOptionSelect";

export default function CreateInquiryPostPageSVC() {
  const router = useRouter();
  const { user } = useAuthContext();

  const studentMutation = useCreateStudentPostSVC();
  const parentMutation = useCreateParentPostSVC();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedLectureId, setSelectedLectureId] = useState("");

  // 유저 정보에 따른 작성자 역할 고정
  const authorRole: AuthorRole =
    user?.userType === "PARENT" ? "PARENT" : "STUDENT";

  // 게시글 등록
  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (!selectedLectureId) {
      alert("강의를 선택해주세요.");
      return;
    }

    const baseData = {
      title,
      content,
      lectureId: selectedLectureId,
    };

    const onSuccessAction = {
      onSuccess: () => router.push(`/learners/communication`),
    };

    if (user?.userType === "PARENT") {
      parentMutation.mutate(
        {
          ...baseData,
          childLinkId: "linked-child-id", // TODO: 추가하기
        },
        onSuccessAction
      );
    } else {
      studentMutation.mutate(baseData, onSuccessAction);
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
            content={content}
            setContent={setContent}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
}
