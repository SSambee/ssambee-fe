import { Input } from "@/components/ui/input";
import SelectBtn from "@/components/common/button/SelectBtn";
import StatusLabel from "@/components/common/label/StatusLabel";
import {
  EnrollmentListQuery,
  SchoolYear,
  StudentStatus,
  LectureStatus,
} from "@/types/students.type";
import {
  GRADE_SELECT_OPTIONS,
  STATUS_SELECT_OPTIONS,
  LECTURE_STATUS_LABEL,
} from "@/constants/students.default";

type StudentFilterProps = {
  query: EnrollmentListQuery;
  setQuery: React.Dispatch<React.SetStateAction<EnrollmentListQuery>>;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  lectureOptions: Array<{
    label: string | React.ReactNode;
    value: string;
    status: LectureStatus | null;
  }>;
};

export function StudentFilter({
  query,
  setQuery,
  searchTerm,
  setSearchTerm,
  lectureOptions,
}: StudentFilterProps) {
  return (
    <div className="border rounded-lg p-4 mt-[74px]">
      <div className="w-full flex flex-col items-start gap-2 mb-3">
        <h2 className="text-lg font-semibold mr-1">수업 선택</h2>

        <div className="w-full flex flex-wrap items-center gap-4">
          <div className="w-full lg:w-[280px] shrink-0 h-14">
            <SelectBtn
              className="text-base px-4 h-full w-full"
              optionSize="sm"
              value={query.lecture ?? "all"}
              placeholder="전체 수업"
              options={lectureOptions.map((option) => ({
                value: option.value,
                label: option.status ? (
                  <div className="flex items-center gap-2">
                    <span>{option.label as string}</span>
                    <StatusLabel
                      color={
                        LECTURE_STATUS_LABEL[option.status as LectureStatus]
                          .color
                      }
                    >
                      {
                        LECTURE_STATUS_LABEL[option.status as LectureStatus]
                          .label
                      }
                    </StatusLabel>
                  </div>
                ) : (
                  option.label
                ),
              }))}
              onChange={(value) =>
                setQuery((prev) => ({
                  ...prev,
                  lecture: value === "all" ? null : (value as string),
                  page: 1,
                }))
              }
            />
          </div>

          <div className="flex-1 flex flex-wrap sm:flex-nowrap justify-end items-center gap-3 h-ful text-base">
            <Input
              className="h-14 w-full sm:flex-1 min-w-[200px] max-w-[400px] p-4 text-base placeholder:text-base"
              placeholder="이름, 전화번호로 검색해보세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2 w-full sm:w-[280px] shrink-0 h-14">
              <div className="h-full">
                <SelectBtn
                  className="text-base px-4 h-full w-full"
                  optionSize="sm"
                  value={query.year ?? "all"}
                  placeholder="학년 선택"
                  options={GRADE_SELECT_OPTIONS}
                  onChange={(value) =>
                    setQuery((prev) => ({
                      ...prev,
                      year: value === "all" ? null : (value as SchoolYear),
                      page: 1,
                    }))
                  }
                />
              </div>
              <div className="h-full">
                <SelectBtn
                  className="text-base px-4 h-full w-full"
                  optionSize="sm"
                  value={query.status ?? "all"}
                  placeholder="상태 선택"
                  options={STATUS_SELECT_OPTIONS}
                  onChange={(value) =>
                    setQuery((prev) => ({
                      ...prev,
                      status: value === "all" ? null : (value as StudentStatus),
                      page: 1,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
