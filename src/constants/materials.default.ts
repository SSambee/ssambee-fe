import {
  OtherFormData,
  PaperFormData,
  RequestFormData,
  VideoFormData,
} from "@/types/materials.type";

export const MATERIALS_TYPE_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "시험지", value: "PAPER" },
  { label: "동영상", value: "VIDEO" },
  { label: "요청 자료", value: "REQUEST" },
  { label: "기타", value: "OTHER" },
];

export const MATERIALS_TYPE_LABEL = {
  ALL: { label: "전체", color: "gray" },
  PAPER: { label: "시험지", color: "blue" },
  VIDEO: { label: "동영상", color: "red" },
  REQUEST: { label: "요청 자료", color: "green" },
  OTHER: { label: "기타", color: "gray" },
} as const;

export const SORT_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "최신순", value: "LATEST" },
  { label: "오래된순", value: "OLDEST" },
];

export function getVideoFormDefaults(): VideoFormData {
  return {
    title: "",
    writer: "현재 로그인된 사용자", // TODO: 실제 로그인 유저 정보로 대체
    className: "",
    description: "",
    youtubeLink: "",
  };
}

export function getRequestFormDefaults(): RequestFormData {
  return {
    title: "",
    writer: "현재 로그인된 사용자", // TODO: 실제 로그인 유저 정보로 대체
    className: "",
    description: "",
    file: null as unknown as File,
    driveLink: "",
  };
}

export function getOtherFormDefaults(): OtherFormData {
  return {
    title: "",
    writer: "현재 로그인된 사용자", // TODO: 실제 로그인 유저 정보로 대체
    className: "",
    description: "",
    file: null as unknown as File,
  };
}

export function getPaperFormDefaults(): PaperFormData {
  return {
    title: "",
    writer: "현재 로그인된 사용자", // TODO: 실제 로그인 유저 정보로 대체
    className: "",
    description: "",
    file: null as unknown as File,
  };
}
