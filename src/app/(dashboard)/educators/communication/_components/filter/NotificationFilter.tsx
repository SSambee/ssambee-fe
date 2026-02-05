import { Input } from "@/components/ui/input";
import SelectBtn from "@/components/common/button/SelectBtn";
import { CONTENT_TYPE_OPTIONS } from "@/constants/communication.default";

export default function NotificationFilter() {
  return (
    <div className="w-full border rounded-lg p-4 bg-white">
      <div className="flex flex-wrap gap-3 w-full items-center">
        <div className="w-full xl:flex-1 min-w-[300px]">
          <Input
            className="h-14 w-full p-4 text-base placeholder:text-base"
            placeholder="제목으로 검색해보세요"
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full xl:w-auto items-center">
          <div className="flex gap-2 w-full">
            <SelectBtn
              className="flex-1 w-full lg:w-[140px] h-14 text-base"
              optionSize="sm"
              value="ALL"
              placeholder="게시글 분류"
              options={CONTENT_TYPE_OPTIONS}
            />
          </div>

          <div className="flex items-center gap-2 h-14 border rounded-lg px-3 w-full md:w-auto justify-between bg-white">
            <Input
              type="date"
              className="flex-1 border-none focus-visible:ring-0 text-base min-w-[110px] p-0"
            />
            <span className="text-gray-400">~</span>
            <Input
              type="date"
              className="flex-1 border-none focus-visible:ring-0 text-base min-w-[110px] p-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
