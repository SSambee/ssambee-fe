"use client";

import { Button } from "@/components/ui/button";
import { Lecture } from "@/types/lectures";
import { useLectureDetailModalStore, INITIAL_LIMIT } from "@/stores/lectures";

import { LectureDetailModal } from "../_detail-modal/LectureDetailModal";

import { LectureCard } from "./LectureCard";

type LecturesListProps = {
  lectures: Lecture[];
  totalCount: number;
  limit: number;
  isLoading: boolean;
  onLoadMore: () => void;
  onReset: () => void;
};

export function LecturesList({
  lectures,
  totalCount,
  limit,
  isLoading,
  onLoadMore,
  onReset,
}: LecturesListProps) {
  const selectedLectureId = useLectureDetailModalStore(
    (state) => state.selectedLectureId
  );
  const isModalOpen = useLectureDetailModalStore((state) => state.isOpen);
  const closeModal = useLectureDetailModalStore((state) => state.close);
  const selectedLecture =
    lectures.find((lecture) => lecture.id === selectedLectureId) ?? null;
  const hasMore = totalCount > limit;
  const isExpanded = limit > INITIAL_LIMIT;
  const remaining = Math.max(totalCount - limit, 0);

  const handleReset = () => {
    // 목록 접기 시 열려있는 모달도 닫기 (선택된 강의가 접힌 영역에 있을 수 있음)
    if (isModalOpen) {
      closeModal();
    }
    onReset();
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isLoading && (
          <div className="col-span-2 text-center text-sm text-muted-foreground">
            로딩 중...
          </div>
        )}
        {!isLoading && lectures.length === 0 && (
          <div className="col-span-2 text-center text-sm text-muted-foreground">
            등록된 수업이 없습니다.
          </div>
        )}
        {!isLoading &&
          lectures.map((lecture) => (
            <LectureCard key={lecture.id} lecture={lecture} />
          ))}
      </div>

      <div className="flex justify-center gap-3">
        {hasMore && (
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            className="h-12 min-w-[200px] rounded-[12px] border border-[#d6d9e0] bg-white px-6 text-[16px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
          >
            더보기 ({remaining})
          </Button>
        )}
        {isExpanded && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="h-12 min-w-[200px] rounded-[12px] border border-[#d6d9e0] bg-white px-6 text-[16px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
          >
            접기
          </Button>
        )}
      </div>

      <LectureDetailModal
        lecture={selectedLecture}
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
          }
        }}
      />
    </div>
  );
}
