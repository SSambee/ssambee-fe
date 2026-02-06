"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Paperclip,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Title from "@/components/common/header/Title";
import StatusLabel from "@/components/common/label/StatusLabel";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import { CONTENT_TYPE_LABEL } from "@/constants/communication.default";
import {
  MOCK_INSTRUCTOR_POSTS,
  MOCK_LEARNER_INQUIRIES,
} from "@/data/communication.mock";

export default function CommunicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const communicationId = params.communicationId as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 게시글 찾기
  const instructorPost = MOCK_INSTRUCTOR_POSTS.find(
    (post) => post.id === communicationId
  );
  const learnerInquiry = MOCK_LEARNER_INQUIRIES.find(
    (inquiry) => inquiry.id === communicationId
  );

  const postData = instructorPost || learnerInquiry;
  const isInstructorPost = !!instructorPost;
  const isMyPost = isInstructorPost;

  // 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(postData?.title || "");
  const [editContent, setEditContent] = useState(postData?.contents || "");

  const [answerContent, setAnswerContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!postData) {
    return (
      <div className="container mx-auto px-8 py-8">
        <p>게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 게시글 수정 저장
  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    console.log({
      postId: communicationId,
      title: editTitle,
      contents: editContent,
    });
    alert("수정되었습니다.");
    setIsEditing(false);
  };

  // 게시글 수정 취소
  const handleCancelEdit = () => {
    setEditTitle(postData.title);
    setEditContent(postData.contents);
    setIsEditing(false);
  };

  // 답변 등록
  const handleSubmitAnswer = () => {
    if (!answerContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }
    console.log({
      postId: communicationId,
      content: answerContent,
      file: selectedFile,
    });
    alert("답변이 등록되었습니다.");
    setAnswerContent("");
    setSelectedFile(null);
  };

  // 게시글 삭제
  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      alert("삭제되었습니다.");
      router.push("/educators/communication");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  return (
    <div className="container mx-auto px-8 py-8 space-y-6 max-w-[1400px]">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Title
          title={isInstructorPost ? "공지사항 상세" : "문의 상세"}
          description={
            isEditing
              ? "게시글을 수정 중입니다."
              : "게시글의 상세 내용을 확인하세요."
          }
        />

        <div className="flex gap-2">
          {isMyPost && !isEditing && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="h-[50px] rounded-lg text-base"
              >
                <Edit className="h-4 w-4 mr-2" /> 수정
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="h-[50px] rounded-lg text-base text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" /> 삭제
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button
                onClick={handleSaveEdit}
                className="h-[50px] rounded-lg text-base bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" /> 저장
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="h-[50px] rounded-lg text-base"
              >
                <X className="h-4 w-4 mr-2" /> 취소
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-[50px] rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> 뒤로가기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 게시글 정보 (모바일: 맨 위 / 데스크탑: 오른쪽) */}
        <div className="space-y-6 lg:order-2">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">게시글 정보</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <div>
                  <Label className="text-sm text-muted-foreground">분류</Label>
                  <div className="mt-1">
                    {isInstructorPost ? (
                      <StatusLabel
                        color={
                          CONTENT_TYPE_LABEL[instructorPost.postType].color
                        }
                      >
                        {CONTENT_TYPE_LABEL[instructorPost.postType].label}
                      </StatusLabel>
                    ) : (
                      <StatusLabel color="gray">문의</StatusLabel>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    작성일
                  </Label>
                  <p className="mt-1 text-base">{postData.date}</p>
                </div>
                {!isInstructorPost && learnerInquiry && (
                  <div className="col-span-2 lg:col-span-1">
                    <Label className="text-sm text-muted-foreground">
                      작성자
                    </Label>
                    <p className="mt-1 text-base">
                      {learnerInquiry.writer.name} (
                      {learnerInquiry.writer.type === "STUDENT"
                        ? "학생"
                        : "학부모"}
                      )
                    </p>
                  </div>
                )}
              </div>

              {!isInstructorPost && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => alert("답변 완료 처리되었습니다.")}
                    className="h-[50px] w-full rounded-lg text-base bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 font-medium transition-colors"
                  >
                    답변 완료 처리
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 게시글 본문 및 답변 영역 (모바일: 아래 / 데스크탑: 왼쪽/중앙) */}
        <div className="lg:col-span-2 lg:order-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">제목</Label>
                    <Input
                      id="title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-lg font-bold h-12"
                    />
                  </div>
                  <TiptapEditor
                    content={editContent}
                    onChange={setEditContent}
                    className="min-h-[400px]"
                  />
                </div>
              ) : (
                <div className="min-h-[300px]">
                  <h2 className="text-2xl font-bold mb-4">{postData.title}</h2>
                  <div className="border-t pt-4">
                    <TiptapEditor content={postData.contents} readOnly={true} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 답변 목록 */}
          {postData.answers && postData.answers.length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">
                  {isInstructorPost ? "댓글" : "답변"} (
                  {postData.answers.length})
                </h3>
                <div className="space-y-4">
                  {postData.answers.map((answer) => (
                    <div
                      key={answer.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span>{answer.writer}</span>
                        <span className="text-sm text-muted-foreground">
                          {answer.date}
                        </span>
                      </div>
                      <TiptapEditor content={answer.contents} readOnly={true} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 답변 작성 및 첨부파일 UX 개선 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">
                {isInstructorPost ? "댓글 작성" : "답변 작성"}
              </h3>
              <div className="space-y-3">
                <TiptapEditor
                  content={answerContent}
                  onChange={setAnswerContent}
                  placeholder={
                    isInstructorPost
                      ? "댓글을 입력하세요..."
                      : "답변 내용을 입력하세요..."
                  }
                  className="h-[200px]"
                />

                {/* 첨부파일 정보 (버튼보다 위) */}
                {!isInstructorPost && selectedFile && (
                  <div className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border shadow-sm">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                          {selectedFile.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFile(null)}
                      className="h-8 w-8 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {!isInstructorPost && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex items-center gap-2 h-9 ${selectedFile ? "text-blue-600 bg-blue-50 border-blue-200" : "text-slate-500"}`}
                      >
                        <Paperclip className="h-4 w-4" />
                        {selectedFile ? "파일 변경" : "파일 첨부"}
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={handleSubmitAnswer}
                    className="bg-slate-900 text-white hover:bg-slate-800 px-8 h-10 transition-all active:scale-95"
                  >
                    {isInstructorPost ? "댓글 등록" : "답변 등록"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
