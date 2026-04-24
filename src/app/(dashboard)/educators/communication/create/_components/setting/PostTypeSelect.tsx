import { Check, FolderOpen, Megaphone } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PostType } from "@/types/communication/instructorPost";

type PostTypeSelectProps = {
  selectedPostType: PostType;
  togglePostType: (postType: PostType) => void;
};

export default function PostTypeSelect({
  selectedPostType,
  togglePostType,
}: PostTypeSelectProps) {
  return (
    <Card className="border shadow-none lg:border lg:shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">게시글 분류</h3>
          <p className="text-sm text-slate-500 mt-1">
            이 게시글이 어떤 내용인지 선택하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            role="button"
            onClick={() => togglePostType("NOTICE")}
            className={`group relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              selectedPostType === "NOTICE"
                ? "bg-blue-50 border-blue-600 shadow-sm"
                : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2.5 rounded-lg border shadow-sm transition-colors ${
                  selectedPostType === "NOTICE"
                    ? "bg-white border-blue-100"
                    : "bg-slate-50 border-slate-100"
                }`}
              >
                <Megaphone
                  className={`h-5 w-5 ${
                    selectedPostType === "NOTICE"
                      ? "text-blue-500"
                      : "text-slate-400"
                  }`}
                />
              </div>

              <div className="flex flex-col">
                <span
                  className={`text-[15px] font-bold ${
                    selectedPostType === "NOTICE"
                      ? "text-blue-900"
                      : "text-slate-700"
                  }`}
                >
                  공지사항
                </span>
              </div>
            </div>

            {selectedPostType === "NOTICE" && (
              <div className="absolute top-2 right-2 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <Check className="h-3 w-3 text-white stroke-[3px]" />
              </div>
            )}
          </div>

          <div
            role="button"
            onClick={() => togglePostType("SHARE")}
            className={`group relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              selectedPostType === "SHARE"
                ? "bg-blue-50 border-blue-600 shadow-sm"
                : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2.5 rounded-lg border shadow-sm transition-colors ${
                  selectedPostType === "SHARE"
                    ? "bg-white border-blue-100"
                    : "bg-slate-50 border-slate-100"
                }`}
              >
                <FolderOpen
                  className={`h-5 w-5 ${
                    selectedPostType === "SHARE"
                      ? "text-blue-500"
                      : "text-slate-400"
                  }`}
                />
              </div>

              <div className="flex flex-col">
                <span
                  className={`text-[15px] font-bold ${
                    selectedPostType === "SHARE"
                      ? "text-blue-900"
                      : "text-slate-700"
                  }`}
                >
                  자료 공유
                </span>
              </div>
            </div>

            {selectedPostType === "SHARE" && (
              <div className="absolute top-2 right-2 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <Check className="h-3 w-3 text-white stroke-[3px]" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
