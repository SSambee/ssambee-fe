import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CreateStudentPostRequest,
  CreateStudentParentPostRequest,
  UpdateStudentPostRequest,
  CreateStudentPostCommentRequest,
  UpdateStudentPostStatusRequest,
} from "@/types/communication/studentPost";
import { CommonPostQuery } from "@/types/communication/commonPost";
import {
  instructorPostServiceSVC,
  myPostServiceSVC,
} from "@/services/SVC/studentPost.service";

// 강사 공지 목록 조회
export const useInstructorPostsSVC = (
  params: CommonPostQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["instructorPosts", params],
    queryFn: () => instructorPostServiceSVC.getInstructorPostsSVC(params),
    staleTime: 1000 * 30,
    ...options,
  });
};

// 강사 공지 상세 조회
export const useInstructorPostDetailSVC = (
  postId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["instructorPost", postId],
    queryFn: () => instructorPostServiceSVC.getInstructorPostDetailSVC(postId),
    enabled: !!postId && (options?.enabled ?? true),
  });
};

// 강사 공지 댓글 mutations
export const useInstructorPostCommentMutationsSVC = () => {
  const queryClient = useQueryClient();

  // 댓글 작성
  const createInstructorPostCommentSVC = useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: CreateStudentPostCommentRequest;
    }) =>
      instructorPostServiceSVC.createInstructorPostCommentSVC(postId, payload),
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
      alert("댓글이 등록되었습니다.");
    },
    onError: () => {
      alert("댓글 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  // 댓글 수정
  const updateInstructorPostCommentSVC = useMutation({
    mutationFn: ({
      postId,
      commentId,
      payload,
    }: {
      postId: string;
      commentId: string;
      payload: CreateStudentPostCommentRequest;
    }) =>
      instructorPostServiceSVC.updateInstructorPostCommentSVC(
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
      alert("댓글이 수정되었습니다.");
    },
    onError: () => {
      alert("댓글 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  // 댓글 삭제
  const deleteInstructorPostCommentSVC = useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) =>
      instructorPostServiceSVC.deleteInstructorPostCommentSVC(
        postId,
        commentId
      ),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["instructorPost", variables.postId],
          refetchType: "active",
        }),
      ]);
      alert("댓글이 삭제되었습니다.");
    },
    onError: () => {
      alert("댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  return {
    createInstructorPostCommentSVC,
    updateInstructorPostCommentSVC,
    deleteInstructorPostCommentSVC,
  };
};

// 문의 등록 시 지정 강의 목록 조회
export const useGetLecturesTargetSVC = () => {
  return useQuery({
    queryKey: ["lectures"],
    queryFn: () => myPostServiceSVC.getLecturesSVC(),
  });
};

// 문의 목록 조회
export const useStudentPostsSVC = (
  params: CommonPostQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["studentPosts", params],
    queryFn: () => myPostServiceSVC.getStudentPostsSVC(params),
    staleTime: 1000 * 30,
    ...options,
  });
};

// 문의 상세 조회
export const useStudentPostDetailSVC = (
  postId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["studentPost", postId],
    queryFn: () => myPostServiceSVC.getStudentPostDetailSVC(postId),
    enabled: !!postId && (options?.enabled ?? true),
  });
};

// 학생 문의 생성
export const useCreateStudentPostSVC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStudentPostRequest) =>
      myPostServiceSVC.createStudentPostSVC(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["studentPosts"] });
      alert("문의가 등록되었습니다.");
    },
  });
};

// 학부모 문의 생성
export const useCreateParentPostSVC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStudentParentPostRequest) =>
      myPostServiceSVC.createStudentParentPostSVC(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["studentPosts"] });
      alert("학부모 문의가 등록되었습니다.");
    },
  });
};

// 문의 수정 & 삭제 mutations
export const useStudentPostMutationsSVC = () => {
  const queryClient = useQueryClient();

  // 문의 수정
  const updatePostSVC = useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: UpdateStudentPostRequest;
    }) => myPostServiceSVC.updateStudentPostSVC(postId, payload),
    onSuccess: async (_, variables) => {
      const { postId } = variables;
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["studentPost", postId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: ["studentPosts"],
          refetchType: "active",
        }),
      ]);
      alert("문의가 수정되었습니다.");
    },
    onError: () => {
      alert("문의 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  // 문의 삭제
  const deletePostSVC = useMutation({
    mutationFn: (postId: string) =>
      myPostServiceSVC.deleteStudentPostSVC(postId),
    onSuccess: async (_, postId) => {
      await Promise.all([
        queryClient.removeQueries({ queryKey: ["studentPost", postId] }),
        queryClient.invalidateQueries({
          queryKey: ["studentPosts"],
          refetchType: "active",
        }),
      ]);
      alert("문의가 삭제되었습니다.");
    },
    onError: () => {
      alert("문의 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  return { updatePostSVC, deletePostSVC };
};

// 문의 상태 변경
export const useUpdateStudentPostStatusSVC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: UpdateStudentPostStatusRequest;
    }) => myPostServiceSVC.updateStudentPostStatusSVC(postId, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["studentPost", variables.postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["studentPosts"],
          refetchType: "active",
        }),
      ]);
      alert("문의 상태가 변경되었습니다.");
    },
    onError: () => {
      alert("문의 상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};

// 댓글 mutations
export const useStudentPostCommentMutationsSVC = () => {
  const queryClient = useQueryClient();

  const createCommentSVC = useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: CreateStudentPostCommentRequest;
    }) => myPostServiceSVC.createStudentPostCommentSVC(postId, payload),
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
      alert("답변이 등록되었습니다.");
    },
    onError: () => {
      alert("답변 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  const updateCommentSVC = useMutation({
    mutationFn: ({
      postId,
      commentId,
      payload,
    }: {
      postId: string;
      commentId: string;
      payload: CreateStudentPostCommentRequest;
    }) =>
      myPostServiceSVC.updateStudentPostCommentSVC(postId, commentId, payload),
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
      alert("답변 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  const deleteCommentSVC = useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => myPostServiceSVC.deleteStudentPostComment(postId, commentId),
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
      alert("답변이 삭제되었습니다.");
    },
    onError: () => {
      alert("답변 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  return { createCommentSVC, updateCommentSVC, deleteCommentSVC };
};
