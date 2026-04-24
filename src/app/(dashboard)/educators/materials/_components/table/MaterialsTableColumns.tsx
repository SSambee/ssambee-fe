import { Download } from "lucide-react";

import { Materials } from "@/types/materials.type";
import { MATERIALS_TYPE_LABEL } from "@/constants/materials.default";
import StatusLabel from "@/components/common/label/StatusLabel";
import { Button } from "@/components/ui/button";

type MaterialTypeLabelKey = keyof typeof MATERIALS_TYPE_LABEL;

const resolveMaterialTypeKey = (typeValue?: string): MaterialTypeLabelKey => {
  const normalized = (typeValue ?? "").toUpperCase();
  if (normalized in MATERIALS_TYPE_LABEL) {
    return normalized as MaterialTypeLabelKey;
  }
  return "OTHER";
};

export const MATERIALS_TABLE_COLUMNS = ({
  onDownload,
}: {
  onDownload: (material: Materials) => void;
}) => [
  {
    key: "title",
    label: "자료명",
    render: (row: Materials) => (
      <span className="font-medium block w-[400px]">{row.title || "-"}</span>
    ),
  },
  {
    key: "type",
    label: "자료 유형",
    render: (row: Materials) => {
      const typeKey = resolveMaterialTypeKey(row.type);
      const typeMeta = MATERIALS_TYPE_LABEL[typeKey];

      return <StatusLabel color={typeMeta.color}>{typeMeta.label}</StatusLabel>;
    },
  },
  {
    key: "writer",
    label: "작성자",
    render: (row: Materials) => <span className="w-[100px]">{row.writer}</span>,
  },
  {
    key: "date",
    label: "등록일",
    render: (row: Materials) => <span className="w-[100px]">{row.date}</span>,
  },
  {
    key: "download",
    label: "다운로드",
    render: (row: Materials) => {
      const typeKey = resolveMaterialTypeKey(row.type);
      // 파일이 있는 타입만 다운로드 버튼 표시
      if (typeKey === "VIDEO") return null;

      return (
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(row);
          }}
          className="group h-10 px-4 gap-2 rounded-xl border-neutral-200 hover:border-brand-500 hover:bg-brand-50 transition-all cursor-pointer shadow-none"
        >
          <Download className="h-4 w-4 text-neutral-500 group-hover:text-brand-500 transition-colors" />
          <span className="text-sm font-semibold text-neutral-500 group-hover:text-brand-500 transition-colors">
            다운로드
          </span>
        </Button>
      );
    },
  },
];
