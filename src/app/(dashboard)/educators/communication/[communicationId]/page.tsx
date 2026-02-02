"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Paperclip,
  Send,
  Edit,
  Trash2,
  Copy,
  ArrowLeft,
  Download,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Title from "@/components/common/header/Title";
import StatusLabel from "@/components/common/label/StatusLabel";

// 타입 정의
type InquiryStatus = "답변 전" | "답변 중" | "답변 완료";
type UserRole = "강사" | "조교" | "학생";

type Attachment = {
  id: string;
  name: string;
  url: string;
  type: "image" | "file";
};

type Reply = {
  id: string;
  content: string;
  authorName: string;
  authorRole: UserRole;
  createdAt: string;
  attachments?: Attachment[];
};

type InquiryDetail = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: UserRole;
  createdAt: string;
  status: InquiryStatus;
  responsibleInstructor: string;
  deadline: string;
  attachments?: Attachment[];
  replies: Reply[];
};

// 목 데이터
const MOCK_INQUIRY: InquiryDetail = {
  id: "1",
  title: "과제 제출 방법에 대한 문의",
  content:
    "안녕하세요. 이번 주 과제 제출 방법에 대해 궁금한 점이 있습니다.\n\n과제를 PDF로 제출해야 하나요, 아니면 워드 파일로 제출해도 되나요?\n그리고 제출 기한이 정확히 언제까지인지 확인 부탁드립니다.\n\n감사합니다.",
  authorName: "김학생",
  authorRole: "학생",
  createdAt: "2024-01-15 14:30",
  status: "답변 중",
  responsibleInstructor: "이강사",
  deadline: "2024-01-20",
  attachments: [
    {
      id: "att1",
      name: "과제_예시.png",
      url: "/attachments/example.png",
      type: "image",
    },
  ],
  replies: [
    {
      id: "reply1",
      content:
        "안녕하세요, 김학생님.\n\nPDF와 워드 파일 모두 제출 가능합니다. 다만 최종 제출 시에는 PDF로 변환하여 제출해주시면 감사하겠습니다.\n\n제출 기한은 1월 20일 23:59까지입니다.",
      authorName: "이강사",
      authorRole: "강사",
      createdAt: "2024-01-15 15:00",
    },
    {
      id: "reply2",
      content: "답변 감사합니다! 그럼 PDF로 준비하겠습니다.",
      authorName: "김학생",
      authorRole: "학생",
      createdAt: "2024-01-15 15:30",
    },
  ],
};

export default function CommunicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  // const communicationId = params.communicationId as string;

  const [inquiry, setInquiry] = useState<InquiryDetail>(MOCK_INQUIRY);
  const [replyContent, setReplyContent] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  // 답변 작성
  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;

    const newReply: Reply = {
      id: `reply${Date.now()}`,
      content: replyContent,
      authorName: "이강사", // 현재 로그인한 사용자
      authorRole: "강사",
      createdAt: new Date().toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      attachments: [],
    };

    setInquiry({
      ...inquiry,
      replies: [...inquiry.replies, newReply],
      status: "답변 중",
    });
    setReplyContent("");
    setAttachments([]);
  };

  // 답변 수정
  const handleEditReply = (replyId: string) => {
    const reply = inquiry.replies.find((r) => r.id === replyId);
    if (reply) {
      setEditingReplyId(replyId);
      setEditContent(reply.content);
    }
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;

    setInquiry({
      ...inquiry,
      replies: inquiry.replies.map((reply) =>
        reply.id === editingReplyId ? { ...reply, content: editContent } : reply
      ),
    });
    setEditingReplyId(null);
    setEditContent("");
  };

  // 답변 삭제
  const handleDeleteReply = (replyId: string) => {
    if (confirm("답변을 삭제하시겠습니까?")) {
      setInquiry({
        ...inquiry,
        replies: inquiry.replies.filter((reply) => reply.id !== replyId),
      });
    }
  };

  // 답변 종료
  const handleCompleteInquiry = () => {
    if (confirm("답변을 종료하시겠습니까?")) {
      setInquiry({
        ...inquiry,
        status: "답변 완료",
      });
    }
  };

  // 문의 복사
  const handleCopyInquiry = () => {
    const copyText = `제목: ${inquiry.title}\n작성자: ${inquiry.authorName}\n내용:\n${inquiry.content}`;
    navigator.clipboard.writeText(copyText);
    alert("문의 내용이 복사되었습니다.");
  };

  // 역할별 라벨 색상
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "강사":
        return "bg-blue-100 text-blue-800";
      case "조교":
        return "bg-green-100 text-green-800";
      case "학생":
        return "bg-gray-100 text-gray-800";
    }
  };

  // 상태별 라벨 색상
  const getStatusColor = (
    status: InquiryStatus
  ): "red" | "yellow" | "green" => {
    switch (status) {
      case "답변 전":
        return "red";
      case "답변 중":
        return "yellow";
      case "답변 완료":
        return "green";
    }
  };

  return (
    <div className="container mx-auto px-8 py-8 space-y-6 max-w-[1400px]">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Title title="문의 상세" description="문의 내용과 답변을 확인합니다." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 게시글 및 답변 영역 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 게시글 상세 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              {/* 제목 */}
              <div>
                <h1 className="text-2xl font-bold mb-2">{inquiry.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className={getRoleBadgeColor(inquiry.authorRole)}>
                    {inquiry.authorRole}
                  </div>
                  <span>{inquiry.authorName}</span>
                  <span>·</span>
                  <span>{inquiry.createdAt}</span>
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-t" />

              {/* 내용 */}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {inquiry.content}
              </div>

              {/* 첨부파일 */}
              {inquiry.attachments && inquiry.attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    첨부파일
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {inquiry.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md text-sm"
                      >
                        {attachment.type === "image" ? (
                          <ImageIcon className="h-4 w-4" />
                        ) : (
                          <Paperclip className="h-4 w-4" />
                        )}
                        <span>{attachment.name}</span>
                        <Button variant="outline" className="h-6 w-6">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 답변 목록 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">
                답변 ({inquiry.replies.length})
              </h2>

              <div className="space-y-4">
                {inquiry.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    {/* 답변 헤더 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <div className={getRoleBadgeColor(reply.authorRole)}>
                          {reply.authorRole}
                        </div>
                        <span className="font-medium">{reply.authorName}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">
                          {reply.createdAt}
                        </span>
                      </div>

                      {/* 수정/삭제 버튼 (본인 답변만) */}
                      {reply.authorRole === "강사" && (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleEditReply(reply.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteReply(reply.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* 답변 내용 */}
                    {editingReplyId === reply.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleSaveEdit}>저장</Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingReplyId(null)}
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    )}

                    {/* 답변 첨부파일 */}
                    {reply.attachments && reply.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {reply.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-md text-xs"
                          >
                            <Paperclip className="h-3 w-3" />
                            <span>{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 답변 작성 */}
              <div className="border-t pt-4 space-y-3">
                <h3 className="text-sm font-semibold">답변 작성</h3>
                <Textarea
                  placeholder="답변을 입력하세요..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                />

                {/* 첨부파일 */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <Paperclip className="h-4 w-4" />
                    파일 첨부
                  </Button>
                  {attachments.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {attachments.length}개 파일 선택됨
                    </span>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim()}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    답변 등록
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 게시글 관리 정보 */}
        <div className="space-y-4">
          {/* 관리 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">게시글 관리 정보</h3>

              <div className="space-y-3">
                {/* 책임 강사 */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    책임 강사
                  </p>
                  <p className="font-medium">{inquiry.responsibleInstructor}</p>
                </div>

                {/* 현재 상태 */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    현재 상태
                  </p>
                  <StatusLabel color={getStatusColor(inquiry.status)}>
                    {inquiry.status}
                  </StatusLabel>
                </div>

                {/* 처리기한 */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    처리기한 (임시)
                  </p>
                  <p className="font-medium">{inquiry.deadline}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleCopyInquiry}
              >
                <Copy className="h-4 w-4" />
                학생 문의 복사
              </Button>

              {inquiry.status !== "답변 완료" && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={handleCompleteInquiry}
                >
                  답변 종료
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
