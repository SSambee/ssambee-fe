import { Input } from "@/components/ui/input";
import SelectBtn from "@/components/common/button/SelectBtn";
import {
  ANSWER_STATUS_OPTIONS,
  WRITER_TYPE_OPTIONS,
} from "@/constants/communication.default";
import {
  InquiryWriterTypeFilter,
  AnswerStatusFilter,
  PostFilterQuery,
} from "@/types/communication/commonPost";

type InquiryFilterSVCProps = {
  query: PostFilterQuery;
  setQuery: React.Dispatch<React.SetStateAction<PostFilterQuery>>;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function InquiryFilterSVC({
  query,
  setQuery,
  searchTerm,
  setSearchTerm,
}: InquiryFilterSVCProps) {
  return (
    <div className="w-full bg-surface-normal-light">
      <div className="flex flex-wrap gap-4 w-full items-center">
        <div className="w-full xl:flex-1 min-w-[300px]">
          <Input
            className="h-14 w-full px-5 rounded-[12px] shadow-none border-neutral-200 text-base text-neutral-700 placeholder:text-neutral-300 focus:border-brand-500 focus:ring-brand-500 transition-all"
            placeholder="학생명, 제목으로 검색해보세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full xl:w-auto items-center">
          <div className="flex gap-2 w-full">
            <SelectBtn
              className="flex-1 w-full lg:w-[140px] h-14 text-base font-semibold border-neutral-200 rounded-[12px] text-neutral-500 hover:bg-surface-elevated-light transition-colors"
              optionSize="sm"
              value={query.writerType ?? "ALL"}
              placeholder="작성자"
              options={WRITER_TYPE_OPTIONS}
              onChange={(value) =>
                setQuery((prev) => ({
                  ...prev,
                  writerType: value as InquiryWriterTypeFilter,
                }))
              }
            />
            <SelectBtn
              className="flex-1 w-full lg:w-[140px] h-14 text-base font-semibold border-neutral-200 rounded-[12px] text-neutral-500 hover:bg-surface-elevated-light transition-colors"
              optionSize="sm"
              value={query.answerStatus ?? "ALL"}
              placeholder="답변 상태"
              options={ANSWER_STATUS_OPTIONS}
              onChange={(value) =>
                setQuery((prev) => ({
                  ...prev,
                  answerStatus: value as AnswerStatusFilter,
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
