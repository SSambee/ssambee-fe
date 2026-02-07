import { Card, CardContent } from "@/components/ui/card";
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
    <Card>
      <CardContent className="p-6 space-y-2">
        <h3 className="font-semibold text-lg">게시글 분류</h3>
        <p className="text-sm text-muted-foreground">
          이 게시글이 어떤 내용인지 선택하세요.
        </p>

        <div className="grid grid-cols-4 gap-2">
          <Card
            className={`cursor-pointer transition-all ${
              selectedMaterialsType === "PAPER"
                ? "bg-blue-50 border-blue-600 shadow-md"
                : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
            onClick={() => toggleMaterialsType("PAPER")}
          >
            <CardContent className="p-4 flex items-center justify-center">
              <span
                className={`text-sm font-medium ${
                  selectedMaterialsType === "PAPER"
                    ? "text-blue-700"
                    : "text-neutral-600"
                }`}
              >
                시험지
              </span>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedMaterialsType === "VIDEO"
                ? "bg-red-50 border-red-600 shadow-md"
                : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
            onClick={() => toggleMaterialsType("VIDEO")}
          >
            <CardContent className="p-4 flex items-center justify-center">
              <span
                className={`text-sm font-medium ${
                  selectedMaterialsType === "VIDEO"
                    ? "text-red-700"
                    : "text-neutral-600"
                }`}
              >
                동영상
              </span>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedMaterialsType === "REQUEST"
                ? "bg-green-50 border-green-600 shadow-md"
                : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
            onClick={() => toggleMaterialsType("REQUEST")}
          >
            <CardContent className="p-4 flex items-center justify-center">
              <span
                className={`text-sm font-medium ${
                  selectedMaterialsType === "REQUEST"
                    ? "text-green-700"
                    : "text-neutral-600"
                }`}
              >
                요청 자료
              </span>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedMaterialsType === "OTHER"
                ? "bg-gray-50 border-gray-600 shadow-md"
                : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
            onClick={() => toggleMaterialsType("OTHER")}
          >
            <CardContent className="p-4 flex items-center justify-center">
              <span
                className={`text-sm font-medium ${
                  selectedMaterialsType === "OTHER"
                    ? "text-gray-700"
                    : "text-neutral-600"
                }`}
              >
                기타
              </span>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
