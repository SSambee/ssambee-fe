import { axiosClientSVC } from "@/shared/common/api/axiosClient";
import { ApiResponse } from "@/types/api";
import {
  CommonPostComment,
  CommonPostQuery,
} from "@/types/communication/commonPost";
import {
  GetInstructorPostsResponse,
  GetInstructorPostDetailResponse,
  CreateInstructorPostCommentRequest,
} from "@/types/communication/instructorPost";
import {
  GetStudentPostsResponse,
  GetStudentPostDetailResponse,
  CreateStudentPostCommentRequest,
  CreateStudentPostRequest,
  CreateStudentParentPostRequest,
  UpdateStudentPostRequest,
  GetLecturesResponse,
  GetMyChildrenResponse,
} from "@/types/communication/studentPost";
import { UpdateStudentPostStatusRequest } from "@/types/communication/studentPost";
import { DownloadResponse } from "@/types/materials.type";

export const instructorPostServiceSVC = {
  // 강사 공지 목록 조회
  getInstructorPostsSVC: async (params: CommonPostQuery) => {
    const { data } = await axiosClientSVC.get<
      ApiResponse<GetInstructorPostsResponse>
    >("/instructor-posts", {
      params,
    });
    return data.data;
  },

  // 강사 공지 상세 조회
  getInstructorPostDetailSVC: async (postId: string) => {
    const { data } = await axiosClientSVC.get<
      ApiResponse<GetInstructorPostDetailResponse>
    >(`/instructor-posts/${postId}`);
    return data.data;
  },

  // 강사 공지 댓글 작성
  createInstructorPostCommentSVC: async (
    postId: string,
    payload: CreateInstructorPostCommentRequest
  ) => {
    const { data } = await axiosClientSVC.post<ApiResponse<CommonPostComment>>(
      `/instructor-posts/${postId}/comments`,
      payload
    );
    return data.data;
  },

  // 강사 공지 댓글 수정
  updateInstructorPostCommentSVC: async (
    postId: string,
    commentId: string,
    payload: CreateInstructorPostCommentRequest
  ) => {
    const { data } = await axiosClientSVC.patch<ApiResponse<CommonPostComment>>(
      `/instructor-posts/${postId}/comments/${commentId}`,
      payload
    );
    return data.data;
  },

  // 강사 공지 댓글 삭제
  deleteInstructorPostCommentSVC: async (postId: string, commentId: string) => {
    const { data } = await axiosClientSVC.delete<
      ApiResponse<CommonPostComment>
    >(`/instructor-posts/${postId}/comments/${commentId}`);
    return data.data;
  },
};

export const myPostServiceSVC = {
  // 문의 등록 시 지정 강의 목록 조회
  getLecturesSVC: async () => {
    const { data } = await axiosClientSVC.get<ApiResponse<GetLecturesResponse>>(
      "/student-posts/my-lectures"
    );
    return data.data.lectures;
  },

  // 학생용 문의 생성
  createStudentPostSVC: async (payload: CreateStudentPostRequest) => {
    const { data } = await axiosClientSVC.post<
      ApiResponse<GetStudentPostDetailResponse>
    >("/student-posts", payload);
    return data.data;
  },

  //학부모용 자녀 조회
  getMyChildrenSVC: async () => {
    const { data } =
      await axiosClientSVC.get<ApiResponse<GetMyChildrenResponse>>("/children");
    return data.data;
  },

  // 학부모용 문의 생성
  createStudentParentPostSVC: async (
    payload: CreateStudentParentPostRequest
  ) => {
    const { data } = await axiosClientSVC.post<
      ApiResponse<GetStudentPostDetailResponse>
    >("/student-posts", payload);
    return data.data;
  },

  // 내 문의 목록 조회
  getStudentPostsSVC: async (params: CommonPostQuery) => {
    const { data } = await axiosClientSVC.get<
      ApiResponse<GetStudentPostsResponse>
    >("/student-posts", {
      params,
    });
    return data.data;
  },

  // 내 문의 상세 조회
  getStudentPostDetailSVC: async (postId: string) => {
    const { data } = await axiosClientSVC.get<
      ApiResponse<GetStudentPostDetailResponse>
    >(`/student-posts/${postId}`);
    return data.data;
  },

  // 내 문의 수정
  updateStudentPostSVC: async (
    postId: string,
    payload: UpdateStudentPostRequest | FormData
  ) => {
    const { data } = await axiosClientSVC.patch<
      ApiResponse<GetStudentPostDetailResponse>
    >(`/student-posts/${postId}`, payload);
    return data.data;
  },

  // 내 문의 삭제
  deleteStudentPostSVC: async (postId: string) => {
    const { data } = await axiosClientSVC.delete<
      ApiResponse<GetStudentPostDetailResponse>
    >(`/student-posts/${postId}`);
    return data.data;
  },

  // 내 문의 상태 변경
  updateStudentPostStatusSVC: async (
    postId: string,
    payload: UpdateStudentPostStatusRequest
  ) => {
    const { data } = await axiosClientSVC.patch<
      ApiResponse<GetStudentPostDetailResponse>
    >(`/student-posts/${postId}/status`, payload);
    return data.data;
  },

  // 내 문의 댓글 작성
  createStudentPostCommentSVC: async (
    postId: string,
    payload: CreateStudentPostCommentRequest
  ) => {
    const { data } = await axiosClientSVC.post<ApiResponse<CommonPostComment>>(
      `/student-posts/${postId}/comments`,
      payload
    );
    return data.data;
  },

  // 내 문의 댓글 수정
  updateStudentPostCommentSVC: async (
    postId: string,
    commentId: string,
    payload: CreateStudentPostCommentRequest | FormData
  ) => {
    const { data } = await axiosClientSVC.patch<ApiResponse<CommonPostComment>>(
      `/student-posts/${postId}/comments/${commentId}`,
      payload
    );
    return data.data;
  },

  // 내 문의 댓글 삭제
  deleteStudentPostCommentSVC: async (postId: string, commentId: string) => {
    const { data } = await axiosClientSVC.delete<
      ApiResponse<CommonPostComment>
    >(`/student-posts/${postId}/comments/${commentId}`);
    return data.data;
  },

  // 내 게시글 첨부파일 다운로드
  getMyPostDownloadSVC: async (attachmentId: string) => {
    const { data } = await axiosClientSVC.get<DownloadResponse>(
      `/student-posts/attachments/${attachmentId}/download-url`
    );
    return data;
  },
};
