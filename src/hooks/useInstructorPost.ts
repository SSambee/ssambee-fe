import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CreateInstructorPostCommentRequest,
  CreateInstructorPostRequest,
  UpdateInstructorPostRequest,
  UpdateAssistantWorkStatus,
} from "@/types/communication/instructorPost";
import { CreateStudentPostCommentRequest } from "@/types/communication/studentPost";
import {
  assistantPostService,
  instructorPostService,
  studentPostService,
} from "@/services/instructorPost.service";
import { CommonPostQuery } from "@/types/communication/commonPost";
import { useDialogAlert } from "@/hooks/useDialogAlert";

// 공지 알림 대상 조회
export const useInstructorPostTargets = () => {
  return useQuery({
    queryKey: ["instructorPostsTargets"],
    queryFn: () => instructorPostService.getInstructorPostTargets(),
  });
};

// 공지 목록 조회
export const useInstructorPosts = (
  params: CommonPostQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["instructorPosts", params],
    queryFn: () => instructorPostService.getInstructorPosts(params),
    staleTime: 1000 * 30,
    ...options,
  });
};

// 공지 상세 조회
export const useInstructorPostDetail = (
  postId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["instructorPost", postId],
    queryFn: () => instructorPostService.getInstructorPostDetail(postId),
    enabled: !!postId && (options?.enabled ?? true),
  });
};

// 강사 게시글 관련 mutations
export const useInstructorPostMutations = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useDialogAlert();

  // 공지 생성
  const createNoticeMutation = useMutation({
    mutationFn: (payload: CreateInstructorPostRequest) =>
      instructorPostService.createInstructorNoticePost(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["instructorPosts"],
          refetchType: "active",
        }),
      ]);
      showAlert({ description: "공지사항이 성공적으로 등록되었습니다." });
    },
    onError: () => {
      showAlert({
        description: "공지 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    },
  });

  // 자료 공유 생성
  const createShareMutation = useMutation({
    mutationFn: (payload: CreateInstructorPostRequest) =>
      instructorPostService.createInstructorSharePost(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["instructorPosts"],
          refetchType: "active",
        }),
      ]);
      showAlert({ description: "자료 공유가 성공적으로 등록되었습니다." });
    },
    onError: () => {
      showAlert({
        description:
          "자료 공유 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    },
  });

  // 공지 수정
  const updateNoticeMutation = useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: UpdateInstructorPostRequest;
    }) => instructorPostService.updateInstructorPost(postId, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["instructorPost", variables.postId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: ["instructorPosts"],
          refetchType: "active",
        }),
      ]);
      showAlert({ description: "공지사항이 수정되었습니다." });
    },
    onError: () => {
      showAlert({
        description: "공지 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    },
  });

  // 공지 삭제
  const deleteNoticeMutation = useMutation({
    mutationFn: (postId: string) =>
      instructorPostService.deleteInstructorPost(postId),
    onSuccess: async (_, postId) => {
      await Promise.all([
        queryClient.removeQueries({ queryKey: ["instructorPost", postId] }),
        queryClient.invalidateQueries({
          queryKey: ["instructorPosts"],
          refetchType: "active",
        }),
      ]);
      showAlert({ description: "공지사항이 삭제되었습니다." });
    },
    onError: () => {
      showAlert({
        description: "공지 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    },
  });

  return {
    createNoticeMutation,
    createShareMutation,
    updateNoticeMutation,
    deleteNoticeMutation,
  };
};

// 강사 게시글 댓글 관련 mutations
export const useCreateInstructorPostComment = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useDialogAlert();

  // 강사 게시글 댓글 작성
  const createInstructorPostCommentMutation = useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: CreateInstructorPostCommentRequest;
    }) => instructorPostService.createInstructorPostComment(postId, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["instructorPost", variables.postId],
          refetchType: "active",
        }),
      ]);
      showAlert({ description: "댓글이 등록되었습니다." });
    },
    onError: () => {
      showAlert({
        description: "댓글 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    },
  });

  // 강사 게시글 댓글 수정
  const updateInstructorPostCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
      payload,
    }: {
      postId: string;
      commentId: string;
      payload: CreateInstructorPostCommentRequest;
    }) =>
      instructorPostService.updateInstructorPostComment(
        postId,
        commentId,
        payload
      ),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["instructorPost", variables.postId],
          refetchType: "active",
        }),
      ]);
      showAlert({ description: "댓글이 수정되었습니다." });
    },
    onError: () => {
      showAlert({
        description: "댓글 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    },
  });

  // 강사 게시글 댓글 삭제
  const deleteInstructorPostCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => instructorPostService.deleteInstructorPostComment(postId, commentId),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["instructorPost", variables.postId],
          refetchType: "active",
        }),
      ]);
      showAlert({ description: "댓글이 삭제되었습니다." });
    },
    onError: () => {
      showAlert({
        description: "댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    },
  });

  return {
    createInstructorPostCommentMutation,
    updateInstructorPostCommentMutation,
    deleteInstructorPostCommentMutation,
  };
};

// 학생 문의 목록 조회
export const useStudentPosts = (
  params: CommonPostQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["studentPosts", params],
    queryFn: () => studentPostService.getStudentPosts(params),
    staleTime: 1000 * 30,
    ...options,
  });
};

// 학생 문의 상세 조회
export const useStudentPostDetail = (
  postId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["studentPost", postId],
    queryFn: () => studentPostService.getStudentPostDetail(postId),
    enabled: !!postId && (options?.enabled ?? true),
  });
};

// 학생 문의 답변 관련 mutations
export const useStudentPostMutations = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useDialogAlert();

  // 학생 문의 답변 생성
  const createStudentPostCommentMutation = useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: CreateStudentPostCommentRequest;
    }) => studentPostService.createStudentPostComment(postId, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["studentPost", variables.postId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: ["studentPosts"],
          refetchType: "active",
        }),
      ]);
      showAlert({ description: "답변이 등록되었습니다." });
    },
    onError: () => {
      showAlert({ description: "답변 등록 중 오류가 발생했습니다." });
    },
  });

  // 학생 문의 답변 수정
  const updateStudentPostCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
      payload,
    }: {
      postId: string;
      commentId: string;
      payload: CreateStudentPostCommentRequest;
    }) =>
      studentPostService.updateStudentPostComment(postId, commentId, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["studentPost", variables.postId],
          refetchType: "active",
        }),
      ]);
      alert("답변이 수정되었습니다.");
    },
    onError: () => {
      alert("답변 수정 중 오류가 발생했습니다.");
    },
  });

  // 학생 문의 답변 삭제
  const deleteStudentPostCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => studentPostService.deleteStudentPostComment(postId, commentId),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["studentPost", variables.postId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: ["studentPosts"],
          refetchType: "active",
        }),
      ]);
      showAlert({ description: "답변이 삭제되었습니다." });
    },
    onError: () => {
      showAlert({ description: "답변 삭제 중 오류가 발생했습니다." });
    },
  });

  return {
    createStudentPostCommentMutation,
    updateStudentPostCommentMutation,
    deleteStudentPostCommentMutation,
  };
};

// 조교 업무 리스트 조회
export const useAssistantWorks = (
  params: CommonPostQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["assistantWorks", params],
    queryFn: () => assistantPostService.getAssistantWorks(params),
    staleTime: 1000 * 30,
    ...options,
  });
};

// 조교 업무 상세 조회
export const useAssistantWorkDetail = (
  assistantOrderId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["assistantWork", assistantOrderId],
    queryFn: () =>
      assistantPostService.getAssistantWorkDetail(assistantOrderId),
    enabled: !!assistantOrderId && (options?.enabled ?? true),
  });
};

// 업무 상태 변경
export const useUpdateAssistantWorkStatus = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useDialogAlert();

  return useMutation({
    mutationFn: ({
      assistantOrderId,
      payload,
    }: {
      assistantOrderId: string;
      payload: UpdateAssistantWorkStatus;
    }) => assistantPostService.updateWorkStatus(assistantOrderId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["assistantWork", variables.assistantOrderId],
        refetchType: "active",
      });
      await queryClient.invalidateQueries({
        queryKey: ["assistantWorks"],
        refetchType: "active",
      });
      showAlert({ description: "업무 상태가 변경되었습니다." });
    },
    onError: () => {
      showAlert({
        description: "상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    },
  });
};
