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
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "oldest" },
];

export function getPaperFormDefaults(): PaperFormData {
  return {
    title: "",
    writer: "",
    className: "",
    description: "",
    file: null,
  };
}

export function getVideoFormDefaults(): VideoFormData {
  return {
    title: "",
    writer: "",
    className: "",
    description: "",
    link: "",
  };
}

export function getRequestFormDefaults(): RequestFormData {
  return {
    title: "",
    writer: "",
    className: "",
    description: "",
    file: null,
    driveLink: "",
  };
}

export function getOtherFormDefaults(): OtherFormData {
  return {
    title: "",
    writer: "",
    className: "",
    description: "",
    image: null,
  };
}
