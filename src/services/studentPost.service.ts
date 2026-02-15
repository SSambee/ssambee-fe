// import { axiosClientSVC } from "@/services/axiosClient";
// import { ApiResponse } from "@/types/api";
// import { CommonPostQuery } from "@/types/communication/commonPost";
// import {
//   GetStudentPostsResponse,
//   GetStudentPostDetailResponse,
//   CreateStudentPostCommentRequest,
//   UpdateStudentPostCommentRequest,
// } from "@/types/communication/studentPost";
// import {
//   StudentPostDetailComment,
//   UpdateStudentPostStatusRequest,
// } from "@/types/communication/studentPost";

// export const inquiryPostService = {
//   // 문의 목록 조회
//   getStudentPosts: async (params: CommonPostQuery) => {
//     const { data } = await axiosClientSVC.get<
//       ApiResponse<GetStudentPostsResponse>
//     >("/student-posts", {
//       params,
//     });
//     return data.data;
//   },

//   // 문의 상세 조회
//   getStudentPostDetail: async (postId: string) => {
//     const { data } = await axiosClientSVC.get<
//       ApiResponse<GetStudentPostDetailResponse>
//     >(`/student-posts/${postId}`);
//     return data.data;
//   },

//   // 문의 상태 변경
//   updateStudentPostStatus: async (
//     postId: string,
//     payload: UpdateStudentPostStatusRequest
//   ) => {
//     const { data } = await axiosClientSVC.patch<
//       ApiResponse<{ id: string; status: string; updatedAt: string }>
//     >(`/student-posts/${postId}/status`, payload);
//     return data.data;
//   },

//   // 문의 댓글 작성
//   createStudentPostComment: async (
//     postId: string,
//     payload: CreateStudentPostCommentRequest
//   ) => {
//     const { data } = await axiosClientSVC.post<
//       ApiResponse<StudentPostDetailComment>
//     >(`/student-posts/${postId}/comments`, payload);
//     return data.data;
//   },

//   // 문의 댓글 수정
//   updateStudentPostComment: async (
//     postId: string,
//     commentId: string,
//     payload: UpdateStudentPostCommentRequest
//   ) => {
//     const { data } = await axiosClientSVC.patch<
//       ApiResponse<StudentPostDetailComment>
//     >(`/student-posts/${postId}/comments/${commentId}`, payload);
//     return data.data;
//   },

//   // 문의 댓글 삭제
//   deleteStudentPostComment: async (postId: string, commentId: string) => {
//     const { data } = await axiosClientSVC.delete<
//       ApiResponse<{ message: string; commentId: string }>
//     >(`/student-posts/${postId}/comments/${commentId}`);
//     return data.data;
//   },
// };
