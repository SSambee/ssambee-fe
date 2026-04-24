import { Check } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AuthorRole } from "@/types/communication/studentPost";
import { ParentIcon, StudentIcon } from "@/components/icons/AuthIcons";

type WriterTypeSelectProps = {
  selectedAuthorRole: AuthorRole;
};

export default function WriterTypeSelect({
  selectedAuthorRole,
}: WriterTypeSelectProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">현재 작성자</h3>
        </div>

        <div>
          {selectedAuthorRole === "STUDENT" && (
            <div className="group relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 bg-blue-50 border-blue-600 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg border shadow-sm transition-colors bg-white border-blue-100">
                  <StudentIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-blue-900">
                    학생
                  </span>
                </div>
              </div>
              <div className="absolute top-2 right-2 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <Check className="h-3 w-3 text-white stroke-[3px]" />
              </div>
            </div>
          )}

          {selectedAuthorRole === "PARENT" && (
            <div className="group relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 bg-blue-50 border-blue-600 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg border shadow-sm transition-colors bg-white border-blue-100">
                  <ParentIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-blue-900">
                    학부모
                  </span>
                </div>
              </div>
              <div className="absolute top-2 right-2 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <Check className="h-3 w-3 text-white stroke-[3px]" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
