"use client";

import { useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { JSONContent } from "@tiptap/react";

import Title from "@/components/common/header/Title";
import {
  useCreateInstructorPostComment,
  useInstructorPostDetail,
  useStudentPostMutations,
  useInstructorPostMutations,
  useStudentPostDetail,
} from "@/hooks/useInstructorPost";
import { useDownloadMaterial } from "@/hooks/useMaterials";
import { CommonPostAttachment } from "@/types/communication/commonPost";

import PostInfo from "./_components/PostInfo";
import PostContent from "./_components/PostContent";
import PostComment from "./_components/PostComment";
import PostAction from "./_components/PostAction";

export default function CommunicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const communicationId = params.communicationId as string;
  const type = searchParams.get("type") as "notice" | "inquiry";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isNoticePost = type === "notice";

  // 상세 페이지 조회
  const { data: noticePostData, isLoading: isLoadingNotice } =
    useInstructorPostDetail(communicationId, { enabled: isNoticePost });
  const { data: inquiryPostData, isLoading: isLoadingInquiry } =
    useStudentPostDetail(communicationId, { enabled: !isNoticePost });

  // 상세 페이지 수정 & 삭제
  const { updateNoticeMutation, deleteNoticeMutation } =
    useInstructorPostMutations();
  // 댓글 생성 & 수정 & 삭제
  const {
    createInstructorPostCommentMutation,
    updateInstructorPostCommentMutation,
    deleteInstructorPostCommentMutation,
  } = useCreateInstructorPostComment();
  // 댓글 생성 & 수정 & 삭제
  const {
    createStudentPostCommentMutation,
    updateStudentPostCommentMutation,
    deleteStudentPostCommentMutation,
  } = useStudentPostMutations();
  // 자료 다운로드
  const { mutate: downloadMaterial } = useDownloadMaterial("EDUCATORS");

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
    const safeParse = (content: string): JSONContent => {
      try {
        return JSON.parse(content);
      } catch {
        return {
          type: "doc",
          content: [
            { type: "paragraph", content: [{ type: "text", text: content }] },
          ],
        };
      }
    };
    if (isNoticePost && noticePostData) {
      setEditTitle(noticePostData.title);
      setEditContent(safeParse(noticePostData.content));
    } else if (!isNoticePost && inquiryPostData) {
      setEditTitle(inquiryPostData.title);
      setEditContent(safeParse(inquiryPostData.content));
    }
    setIsEditing(true);
  };

  // 게시글 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // 게시글 수정 저장
  const handleSaveEdit = () => {
    const isContentEmpty =
      !editContent.content || editContent.content.length === 0;

    if (!editTitle.trim() || isContentEmpty) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const payloadContent = JSON.stringify(editContent);

    if (isNoticePost) {
      updateNoticeMutation.mutate(
        {
          postId: communicationId,
          payload: {
            title: editTitle,
            content: payloadContent,
          },
        },
        { onSuccess: () => setIsEditing(false) }
      );
    }
  };

  // 게시글 삭제
  const handleDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    if (isNoticePost) {
      deleteNoticeMutation.mutate(communicationId, {
        onSuccess: () => router.push("/educators/communication"),
      });
    }
  };

  // 댓글 작성
  const handleSubmitAnswer = () => {
    const isContentEmpty =
      !answerContent ||
      !answerContent.content ||
      answerContent.content.length === 0;

    if (isContentEmpty) {
      alert(
        isNoticePost ? "댓글 내용을 입력해주세요." : "답변 내용을 입력해주세요."
      );
      return;
    }
    const handleSuccess = () => {
      setAnswerContent({});
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const payload = { content: JSON.stringify(answerContent) };

    if (isNoticePost) {
      createInstructorPostCommentMutation.mutate(
        { postId: communicationId, payload },
        { onSuccess: handleSuccess }
      );
    } else {
      createStudentPostCommentMutation.mutate(
        { postId: communicationId, payload },
        { onSuccess: handleSuccess }
      );
    }
  };

  //댓글 수정
  const handleUpdateComment = (commentId: string, content: JSONContent) => {
    const payload = { content: JSON.stringify(content) };

    if (isNoticePost) {
      updateInstructorPostCommentMutation.mutate({
        postId: communicationId,
        commentId,
        payload,
      });
    } else {
      updateStudentPostCommentMutation.mutate({
        postId: communicationId,
        commentId,
        payload,
      });
    }
  };

  //댓글 삭제
  const handleDeleteComment = (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    if (isNoticePost) {
      deleteInstructorPostCommentMutation.mutate({
        postId: communicationId,
        commentId,
      });
    } else {
      deleteStudentPostCommentMutation.mutate({
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
      materialsId: file.materialId, // 공지사항일 때 존재
      attachmentId: file.id, // 문의글일 때 존재
      fileUrl: file.fileUrl, // 직접 다운로드
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
        <PostAction
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
          <PostInfo
            isNoticePost={isNoticePost}
            noticePostData={noticePostData ?? undefined}
            inquiryPostData={inquiryPostData ?? undefined}
            currentData={currentData}
          />
        </div>

        <div className="lg:col-span-2 lg:order-1 space-y-6">
          <PostContent
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

          <PostComment
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
