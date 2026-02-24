"use client";

import { useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { JSONContent } from "@tiptap/react";

import Title from "@/components/common/header/Title";
import { useDownloadMaterial } from "@/hooks/useMaterials";
import {
  useInstructorPostCommentMutationsSVC,
  useInstructorPostDetailSVC,
  useStudentPostCommentMutationsSVC,
  useStudentPostMutationsSVC,
  useUpdateStudentPostStatusSVC,
} from "@/hooks/SVC/useCommunicationSVC";
import { useStudentPostDetailSVC } from "@/hooks/SVC/useCommunicationSVC";
import { CommonPostAttachment } from "@/types/communication/commonPost";
import { useDialogAlert } from "@/hooks/useDialogAlert";

import PostActionSVC from "./_components/PostActionSVC";
import PostInfoSVC from "./_components/PostInfoSVC";
import PostContentSVC from "./_components/PostContentSVC";
import PostCommentSVC from "./_components/PostCommentSVC";

export default function CommunicationDetailPageSVC() {
  const router = useRouter();
  const params = useParams();
  const { showAlert } = useDialogAlert();
  const searchParams = useSearchParams();
  const communicationId = params.communicationId as string;
  const typeParam = searchParams.get("type");
  const type: "notice" | "inquiry" =
    typeParam === "notice" ? "notice" : "inquiry";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isNoticePost = type === "notice";

  // 상세 페이지 조회
  const { data: noticePostData, isLoading: isLoadingNotice } =
    useInstructorPostDetailSVC(communicationId, { enabled: isNoticePost });
  const { data: inquiryPostData, isLoading: isLoadingInquiry } =
    useStudentPostDetailSVC(communicationId, { enabled: !isNoticePost });

  // 문의 상세 페이지 수정 & 삭제
  const { updatePostSVC, deletePostSVC } = useStudentPostMutationsSVC();

  // 공지 댓글 생성 & 수정 & 삭제
  const {
    createInstructorPostCommentSVC,
    updateInstructorPostCommentSVC,
    deleteInstructorPostCommentSVC,
  } = useInstructorPostCommentMutationsSVC();

  // 문의 댓글 생성 & 수정 & 삭제
  const { createCommentSVC, updateCommentSVC, deleteCommentSVC } =
    useStudentPostCommentMutationsSVC();

  // 문의 답변 상태 변경
  const updateStatusSVC = useUpdateStudentPostStatusSVC();

  // 자료 다운로드
  const { mutate: downloadMaterial } = useDownloadMaterial("LEARNERS");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState<JSONContent>({});
  const [answerContent, setAnswerContent] = useState<JSONContent>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (isLoadingNotice || isLoadingInquiry) {
    return (
      <div className="container mx-auto px-8 py-8">
        <p>로딩 중...</p>
      </div>
    );
  }

  const currentData = isNoticePost ? noticePostData : inquiryPostData;
  if (!currentData) {
    return (
      <div className="container mx-auto px-8 py-8">
        <p>게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 게시글 수정 시작
  const handleStartEdit = () => {
    if (currentData) {
      setEditTitle(currentData.title);

      // DB에서 가져온 content(문자열 JSON)를 객체로 파싱하여 에디터에 전달
      try {
        const parsedContent = JSON.parse(currentData.content);
        setEditContent(parsedContent);
      } catch {
        // 만약 예전에 저장된 데이터가 일반 텍스트라면 그대로 보냄
        setEditContent({
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: currentData.content }],
            },
          ],
        });
      }
    }
    setIsEditing(true);
  };
  // 게시글 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // 게시글 수정 저장
  const handleSaveEdit = async () => {
    const isContentEmpty =
      !editContent.content || editContent.content.length === 0;

    if (!editTitle.trim() || isContentEmpty) {
      await showAlert({ description: "제목과 내용을 모두 입력해주세요." });
      return;
    }

    // 서버에는 무조건 stringify 해서 전송
    const payloadContent = JSON.stringify(editContent);

    if (!isNoticePost) {
      updatePostSVC.mutate(
        {
          postId: communicationId,
          payload: { title: editTitle, content: payloadContent },
        },
        { onSuccess: () => setIsEditing(false) }
      );
    }
  };

  // 문의 답변 상태 변경
  const handleToggleStatus = () => {
    if (isNoticePost || !inquiryPostData) return;

    // 현재 상태 확인
    const currentStatus = inquiryPostData.status;

    // REGISTERED <-> COMPLETED 토글
    const newStatus =
      currentStatus === "COMPLETED" ? "REGISTERED" : "COMPLETED";

    updateStatusSVC.mutate({
      postId: communicationId,
      payload: { status: newStatus },
    });
  };

  // 게시글 삭제
  const handleDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    if (!isNoticePost) {
      deletePostSVC.mutate(communicationId, {
        onSuccess: () => router.push("/learners/communication"),
      });
    }
  };

  // 댓글 작성
  const handleSubmitAnswer = async () => {
    const isContentEmpty =
      !answerContent.content || answerContent.content.length === 0;

    if (isContentEmpty) {
      await showAlert({ description: "댓글 내용을 입력해주세요." });
      return;
    }
    const handleSuccess = () => {
      setAnswerContent({}); // 초기화 시 빈 객체
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const payload = { content: JSON.stringify(answerContent) };

    if (isNoticePost) {
      createInstructorPostCommentSVC.mutate(
        { postId: communicationId, payload },
        { onSuccess: handleSuccess }
      );
    } else {
      createCommentSVC.mutate(
        { postId: communicationId, payload },
        { onSuccess: handleSuccess }
      );
    }
  };

  //댓글 수정
  const handleUpdateComment = async (
    commentId: string,
    content: JSONContent
  ) => {
    if (!content || !content.content || content.content.length === 0) {
      await showAlert({ description: "내용을 입력해주세요." });
      return;
    }

    if (isNoticePost) {
      updateInstructorPostCommentSVC.mutate({
        postId: communicationId,
        commentId,
        payload: { content: JSON.stringify(content) },
      });
    } else {
      updateCommentSVC.mutate({
        postId: communicationId,
        commentId,
        payload: { content: JSON.stringify(content) },
      });
    }
  };

  //댓글 삭제
  const handleDeleteComment = (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    if (isNoticePost) {
      deleteInstructorPostCommentSVC.mutate({
        postId: communicationId,
        commentId,
      });
    } else {
      deleteCommentSVC.mutate({
        postId: communicationId,
        commentId,
      });
    }
  };

  // 자료 변경
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // 자료 다운로드
  const handleAttachmentClick = (file: CommonPostAttachment) => {
    const isVideo =
      file.fileUrl?.includes("youtube.com") ||
      file.fileUrl?.includes("youtube");

    if (isVideo) {
      window.open(file.fileUrl, "_blank");
      return;
    }
    downloadMaterial({
      materialsId: file.materialId,
      attachmentId: file.id,
      fileUrl: file.fileUrl,
      isNotice: isNoticePost,
    });
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Title
          title={isNoticePost ? "공지사항 상세" : "문의 상세"}
          description={
            isEditing
              ? "게시글을 수정 중입니다."
              : "게시글의 상세 내용을 확인하세요."
          }
        />
        <PostActionSVC
          isEditing={isEditing}
          isMine={currentData.isMine ?? false}
          handleStartEdit={handleStartEdit}
          handleDelete={handleDelete}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          handleBack={() => router.back()}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:order-2">
          <PostInfoSVC
            isNoticePost={isNoticePost}
            noticePostData={noticePostData ?? undefined}
            inquiryPostData={inquiryPostData ?? undefined}
            currentData={currentData}
            updateStatus={handleToggleStatus}
          />
        </div>

        <div className="lg:col-span-2 lg:order-1 space-y-6">
          <PostContentSVC
            isNoticePost={isNoticePost}
            isEditing={isEditing}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editContent={editContent}
            setEditContent={setEditContent}
            noticePostData={noticePostData}
            inquiryPostData={inquiryPostData}
            currentData={currentData}
            handleAttachmentClick={handleAttachmentClick}
          />

          <PostCommentSVC
            isNoticePost={isNoticePost}
            currentData={currentData}
            answerContent={answerContent}
            setAnswerContent={setAnswerContent}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
            handleFileChange={handleFileChange}
            handleSubmitAnswer={handleSubmitAnswer}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>
      </div>
    </div>
  );
}
