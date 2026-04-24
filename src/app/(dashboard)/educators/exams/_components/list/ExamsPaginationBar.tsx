"use client";

import { Pagination } from "@/components/common/pagination/Pagination";

type ExamsPaginationBarProps = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  isDisabled?: boolean;
  onPageChange: (page: number) => void;
};

export function ExamsPaginationBar({
  totalCount,
  totalPages,
  currentPage,
  itemsPerPage,
  isDisabled = false,
  onPageChange,
}: ExamsPaginationBarProps) {
  return (
    <div className="border-t border-[#eaecf2] pt-4">
      <Pagination
        pagination={{
          totalCount,
          totalPage: totalPages,
          currentPage,
          limit: itemsPerPage,
          hasNextPage: !isDisabled && currentPage < totalPages,
          hasPrevPage: !isDisabled && currentPage > 1,
        }}
        onPageChange={(page) => {
          if (isDisabled) return;
          onPageChange(page);
        }}
      />
    </div>
  );
}
