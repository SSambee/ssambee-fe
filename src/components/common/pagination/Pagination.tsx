"use client";

import { Button } from "@/components/ui/button";
import { PaginationType } from "@/types/students.type";

type PaginationProps = {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
};

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const {
    totalCount,
    totalPage,
    currentPage,
    limit,
    hasNextPage,
    hasPrevPage,
  } = pagination;

  const PAGE_GROUP_SIZE = 5;

  const hasData = totalCount > 0;

  const startIndex = hasData ? (currentPage - 1) * limit + 1 : 0;
  const endIndex = hasData ? Math.min(currentPage * limit, totalCount) : 0;

  const currentGroup = Math.ceil(currentPage / PAGE_GROUP_SIZE);
  const startPage = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPage);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="mt-2 flex items-start justify-between px-2">
      <p className="text-sm font-medium text-neutral-400">
        전체 <span className="text-neutral-700">{totalCount}</span>개 중{" "}
        <span className="text-neutral-700">
          {startIndex}-{endIndex}
        </span>{" "}
        표시
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-9 rounded-[8px] border-neutral-200 bg-surface-normal-light px-3 text-sm font-semibold text-neutral-500 hover:bg-surface-elevated-light disabled:opacity-50 shadow-none transition-colors"
        >
          이전
        </Button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((page) => {
            const isActive = page === currentPage;
            return (
              <Button
                key={page}
                variant={isActive ? "default" : "outline"}
                className={`h-9 w-9 rounded-[8px] text-sm font-bold shadow-none transition-all ${
                  isActive
                    ? "bg-brand-700 text-white hover:bg-brand-800 border-transparent"
                    : "border-transparent bg-transparent text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700"
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-9 rounded-[8px] border-neutral-200 bg-surface-normal-light px-3 text-sm font-semibold text-neutral-500 hover:bg-surface-elevated-light disabled:opacity-50 shadow-none transition-colors"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
