import { Input } from "@/components/ui/input";
import SelectBtn from "@/components/common/button/SelectBtn";
import { CONTENT_TYPE_OPTIONS } from "@/constants/communication.default";
import {
  PostFilterQuery,
  PostTypeFilter,
} from "@/types/communication/commonPost";

type NotificationFilterSVCProps = {
  query: PostFilterQuery;
  setQuery: React.Dispatch<React.SetStateAction<PostFilterQuery>>;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function NotificationFilterSVC({
  query,
  setQuery,
  searchTerm,
  setSearchTerm,
}: NotificationFilterSVCProps) {
  return (
    <div className="w-full border rounded-lg p-4 bg-white">
      <div className="flex flex-wrap gap-3 w-full items-center">
        <div className="w-full xl:flex-1 min-w-[300px]">
          <Input
            className="h-14 w-full p-4 text-base placeholder:text-base"
            placeholder="제목으로 검색해보세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full xl:w-auto items-center">
          <div className="flex gap-2 w-full">
            <SelectBtn
              className="flex-1 w-full lg:w-[140px] h-14 text-base"
              optionSize="sm"
              value={query.postType ?? "ALL"}
              placeholder="게시글 분류"
              options={CONTENT_TYPE_OPTIONS}
              onChange={(value) =>
                setQuery((prev) => ({
                  ...prev,
                  postType: value === "ALL" ? null : (value as PostTypeFilter),
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
