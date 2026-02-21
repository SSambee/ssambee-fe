"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JSONContent } from "@tiptap/react";

import { Button } from "@/components/ui/button";
import Title from "@/components/common/header/Title";
import {
  PostType,
  PostScope,
  TargetRole,
} from "@/types/communication/instructorPost";
import { useInstructorPostMutations } from "@/hooks/useInstructorPost";
import { useModal } from "@/providers/ModalProvider";
import { Materials } from "@/types/materials.type";

import PostTypeSelect from "./_components/setting/PostTypeSelect";
import PostSetting from "./_components/setting/PostSetting";
import AddResourceModal from "./_components/modal/AddResourceModal";
import CreateContent from "./_components/content/CreateContent";

export default function CreateInstructorPostPage() {
  const router = useRouter();
  const { openModal } = useModal();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<JSONContent>({});
  const [selectedClassId, setSelectedClassId] = useState<string>("ALL");
  const [selectedPostType, setSelectedPostType] = useState<PostType>("NOTICE");

  // 알림 대상 선택
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState<TargetRole>("ALL");

  // 최종 선택된 자료 리스트
  const [selectedMaterials, setSelectedMaterials] = useState<Materials[]>([]);

  // 자료 첨부 모달
  const handleOpenAddResourceModal = () => {
    openModal(
      <AddResourceModal
        // key가 바뀌면 모달 내부의 useState(initialSelected)가 강제로 재실행됨
        // 데이터의 ID들을 합쳐서 key로 만들면, 구성이 바뀔 때마다 새 모달로 인식
        key={`modal-${selectedMaterials.map((m) => m.id).join(",")}`}
        onChange={(updatedList) => setSelectedMaterials(updatedList)}
        initialSelected={selectedMaterials}
      />
    );
  };

  // Mutations
  const { createNoticeMutation, createShareMutation } =
    useInstructorPostMutations();

  // 게시글 분류 토글
  const togglePostType = (postType: PostType) => {
    setSelectedPostType(postType);
  };

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

    let scope: PostScope = "GLOBAL";

    if (selectedStudentIds.length > 0) {
      // 학생이 한 명이라도 직접 선택된 경우
      scope = "SELECTED";
    } else if (selectedClassId !== "ALL") {
      // 학생 선택은 없지만, 특정 클래스가 지정된 경우
      scope = "LECTURE";
    } else {
      // 클래스도 ALL, 학생 선택도 없는 경우
      scope = "GLOBAL";
    }

    const payload = {
      title,
      content: JSON.stringify(content),
      isImportant: selectedPostType === "NOTICE",
      scope,
      targetRole,
      lectureId: selectedClassId === "ALL" ? null : selectedClassId,
      targetEnrollmentIds: selectedStudentIds,
      materialIds: selectedMaterials.map((m) => m.id),
    };

    const mutation =
      selectedPostType === "NOTICE"
        ? createNoticeMutation
        : createShareMutation;

    mutation.mutate(payload, {
      onSuccess: () => {
        const targetTab = selectedPostType === "NOTICE" ? "NOTICE" : "INQUIRY";
        router.push(`/educators/communication?tab=${targetTab}`);
      },
    });
  };

  const isSubmitting =
    createNoticeMutation.isPending || createShareMutation.isPending;

  return (
    <div className="container mx-auto space-y-8 p-6">
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
          <PostTypeSelect
            selectedPostType={selectedPostType}
            togglePostType={togglePostType}
          />

          <PostSetting
            selectedClassId={selectedClassId}
            onClassIdChange={setSelectedClassId}
            selectedStudentIds={selectedStudentIds}
            onStudentIdsChange={setSelectedStudentIds}
            targetRole={targetRole}
            onTargetRoleChange={(role) => setTargetRole(role)}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <CreateContent
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            selectedPostType={selectedPostType}
            selectedMaterials={selectedMaterials}
            setSelectedMaterials={setSelectedMaterials}
            handleOpenAddResourceModal={handleOpenAddResourceModal}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
}
