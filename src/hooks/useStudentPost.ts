import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  GetStudentPostsQuery,
  UpdateStudentPostStatusDto,
  CreateStudentPostCommentDto,
  UpdateStudentPostCommentDto,
} from "@/types/communication/studentPost";

import { inquiryPostService } from "@/services/inquiryPost.service";

// 문의 목록 조회
export const useInquiryPosts = (params: GetStudentPostsQuery) => {
  return useQuery({
    queryKey: ["inquiryPosts", params],
    queryFn: () => inquiryPostService.getPosts(params),
  });
};

// 문의 상세 조회
export const useInquiryPostDetail = (
  postId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["inquiryPost", postId],
    queryFn: () => inquiryPostService.getPostDetail(postId),
    enabled: !!postId && !!options?.enabled,
  });
};

// 문의 상태 변경
export const useUpdateInquiryPostStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: UpdateStudentPostStatusDto;
    }) => inquiryPostService.updatePostStatus(postId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["inquiryPost", variables.postId],
        refetchType: "active",
      });
      await queryClient.invalidateQueries({
        queryKey: ["inquiryPosts"],
        refetchType: "active",
      });
      alert("문의 상태가 변경되었습니다.");
    },
    onError: (error) => {
      console.error("상태 변경 실패:", error);
      alert("상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};

// 댓글 mutations
export const useInquiryPostCommentMutations = () => {
  const queryClient = useQueryClient();

  // 댓글 작성
  const createMutation = useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: CreateStudentPostCommentDto;
    }) => inquiryPostService.createComment(postId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["inquiryPost", variables.postId],
        refetchType: "active",
      });
      await queryClient.invalidateQueries({
        queryKey: ["inquiryPosts"],
        refetchType: "active",
      });
      alert("답변이 등록되었습니다.");
    },
    onError: (error) => {
      console.error("답변 등록 실패:", error);
      alert("답변 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  // 댓글 수정
  const updateMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
      payload,
    }: {
      postId: string;
      commentId: string;
      payload: UpdateStudentPostCommentDto;
    }) => inquiryPostService.updateComment(postId, commentId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["inquiryPost", variables.postId],
        refetchType: "active",
      });
      alert("답변이 수정되었습니다.");
    },
    onError: (error) => {
      console.error("답변 수정 실패:", error);
      alert("답변 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  // 댓글 삭제
  const deleteMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => inquiryPostService.deleteComment(postId, commentId),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["inquiryPost", variables.postId],
        refetchType: "active",
      });
      alert("답변이 삭제되었습니다.");
    },
    onError: (error) => {
      console.error("답변 삭제 실패:", error);
      alert("답변 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
