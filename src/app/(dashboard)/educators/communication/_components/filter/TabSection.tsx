"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import DataTable from "@/components/common/table/DataTable";
import { Pagination } from "@/components/common/pagination/Pagination";
import { useInstructorPosts, useStudentPosts } from "@/hooks/useInstructorPost";
import {
  AnswerStatus,
  InquiryWriterType,
} from "@/types/communication/studentPost";
import { PostType } from "@/types/communication/instructorPost";
import { useDebounce } from "@/hooks/useDebounce";
import {
  CommonPostQuery,
  PaginationType,
  PostFilterQuery,
} from "@/types/communication/commonPost";

import InquiryFilter from "../filter/InquiryFilter";
import NotificationFilter from "../filter/NotificationFilter";
import { NOTICE_POST_COLUMNS } from "../table/NoticeTableColumns";
import { INQUIRY_TABLE_COLUMNS } from "../table/InquiryTableColumns";

const PAGE_LIMIT = 10;

export default function TabSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab =
    (searchParams.get("tab") as "INQUIRY" | "NOTICE") || "INQUIRY";
  const [activeTab, setActiveTab] = useState<"INQUIRY" | "NOTICE">(initialTab);

  // 검색어 상태 및 디바운스
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 요청 쿼리
  const [query, setQuery] = useState<PostFilterQuery>({
    page: 1,
    limit: PAGE_LIMIT,
    answerStatus: "ALL",
    writerType: "ALL",
    postType: "ALL",
  });

  // 탭 상태
  const isInquiryTab = activeTab === "INQUIRY";

  // 문의 목록 조회
  const { data: studentPostsData, isLoading: isLoadingStudentPosts } =
    useStudentPosts({
      page: query.page,
      limit: query.limit,
      search: debouncedSearchTerm || undefined,
      answerStatus: query.answerStatus === "ALL" ? null : query.answerStatus,
      writerType: query.writerType === "ALL" ? null : query.writerType,
    });

  // 강사 게시글 목록 조회
  const { data: instructorPostsData, isLoading: isLoadingInstructorPosts } =
    useInstructorPosts({
      page: query.page,
      limit: query.limit,
      search: debouncedSearchTerm || undefined,
      postType: query.postType === "ALL" ? null : query.postType,
    });

  // 탭 선택에 따른 현재 표시 데이터
  const currentResponse = isInquiryTab ? studentPostsData : instructorPostsData;

  const isLoading = isInquiryTab
    ? isLoadingStudentPosts
    : isLoadingInstructorPosts;

  const pagination: PaginationType = currentResponse?.pagination ?? {
    totalCount: 0,
    totalPage: 1,
    currentPage: 1,
    limit: PAGE_LIMIT,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const handleTabChange = (tab: "INQUIRY" | "NOTICE") => {
    setActiveTab(tab);
    router.replace(`/educators/communication?tab=${tab}`, { scroll: false });
    setSearchTerm("");

    setQuery({
      page: 1,
      limit: PAGE_LIMIT,
      answerStatus: null,
      writerType: null,
      postType: null,
    }); // 탭 변경 시 페이지 & 쿼리 초기화
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        {[
          { id: "INQUIRY", label: "문의글" },
          { id: "NOTICE", label: "공지사항" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as "INQUIRY" | "NOTICE")}
            className={`px-6 py-3 text-base font-medium transition-colors relative cursor-pointer ${
              activeTab === tab.id
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {isInquiryTab ? (
        <InquiryFilter
          query={query}
          setQuery={setQuery}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <NotificationFilter
          query={query}
          setQuery={setQuery}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      <div className="min-h-[550px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[550px]">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        ) : (
          <>
            {isInquiryTab ? (
              // 문의글 전용 테이블
              <DataTable
                data={studentPostsData?.list ?? []}
                columns={INQUIRY_TABLE_COLUMNS}
                onRowClick={(row) =>
                  router.push(`/educators/communication/${row.id}?type=inquiry`)
                }
              />
            ) : (
              // 공지사항 전용 테이블
              <DataTable
                data={instructorPostsData?.list ?? []}
                columns={NOTICE_POST_COLUMNS}
                onRowClick={(row) =>
                  router.push(`/educators/communication/${row.id}?type=notice`)
                }
              />
            )}
            <Pagination
              pagination={pagination}
              onPageChange={(page) =>
                setQuery((prev) => ({
                  ...prev,
                  page,
                }))
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
