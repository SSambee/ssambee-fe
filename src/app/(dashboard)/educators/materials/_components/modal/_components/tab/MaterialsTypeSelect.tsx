import { MaterialsType } from "@/types/materials.type";

type MaterialsTypeSelectProps = {
  selectedMaterialsType: MaterialsType;
  toggleMaterialsType: (materialsType: MaterialsType) => void;
};

export default function MaterialsTypeSelect({
  selectedMaterialsType,
  toggleMaterialsType,
}: MaterialsTypeSelectProps) {
  return (
    <div className="space-y-4 border rounded-[20px] px-[24px] py-[16px] bg-white">
      <div>
        <h3 className="text-[18px] font-semibold text-label-neutral py-[11px]">
          게시글 분류
        </h3>
        <p className="text-sm text-muted-foreground">
          이 게시글이 어떤 내용인지 선택하세요.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          className={`cursor-pointer transition-all rounded-[12px] p-4 flex items-center justify-center border ${
            selectedMaterialsType === "PAPER"
              ? "bg-blue-50 border-blue-600 shadow-sm"
              : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
          }`}
          onClick={() => toggleMaterialsType("PAPER")}
        >
          <span
            className={`text-sm font-medium ${
              selectedMaterialsType === "PAPER"
                ? "text-blue-700"
                : "text-neutral-600"
            }`}
          >
            시험지
          </span>
        </button>

        <button
          type="button"
          className={`cursor-pointer transition-all rounded-[12px] p-4 flex items-center justify-center border ${
            selectedMaterialsType === "VIDEO"
              ? "bg-red-50 border-red-600 shadow-sm"
              : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
          }`}
          onClick={() => toggleMaterialsType("VIDEO")}
        >
          <span
            className={`text-sm font-medium ${
              selectedMaterialsType === "VIDEO"
                ? "text-red-700"
                : "text-neutral-600"
            }`}
          >
            동영상
          </span>
        </button>

        <button
          type="button"
          className={`cursor-pointer transition-all rounded-[12px] p-4 flex items-center justify-center border ${
            selectedMaterialsType === "REQUEST"
              ? "bg-green-50 border-green-600 shadow-sm"
              : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
          }`}
          onClick={() => toggleMaterialsType("REQUEST")}
        >
          <span
            className={`text-sm font-medium ${
              selectedMaterialsType === "REQUEST"
                ? "text-green-700"
                : "text-neutral-600"
            }`}
          >
            요청 자료
          </span>
        </button>

        <button
          type="button"
          className={`cursor-pointer transition-all rounded-[12px] p-4 flex items-center justify-center border ${
            selectedMaterialsType === "OTHER"
              ? "bg-gray-50 border-gray-600 shadow-sm"
              : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
          }`}
          onClick={() => toggleMaterialsType("OTHER")}
        >
          <span
            className={`text-sm font-medium ${
              selectedMaterialsType === "OTHER"
                ? "text-gray-700"
                : "text-neutral-600"
            }`}
          >
            기타
          </span>
        </button>
      </div>
    </div>
  );
}
