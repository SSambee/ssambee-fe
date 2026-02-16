"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import DataTable from "@/components/common/table/DataTable";
import { Pagination } from "@/components/common/pagination/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  PaginationType,
  PostFilterQuery,
} from "@/types/communication/commonPost";
import {
  useInstructorPostsSVC,
  useStudentPostsSVC,
} from "@/hooks/SVC/useCommunicationSVC";

import InquiryFilterSVC from "../filter/InquiryFilterSVC";
import NotificationFilterSVC from "../filter/NotificationFilterSVC";
import { NOTICE_TABLE_COLUMNS_SVC } from "../table/NotificationTableColumnsSVC";
import { INQUIRY_TABLE_COLUMNS_SVC } from "../table/InquiryTableColumnsSVC";

const PAGE_LIMIT = 10;

export default function TabSectionSVC() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab");
  const initialTab: "INQUIRY" | "NOTICE" =
    rawTab === "NOTICE" ? "NOTICE" : "INQUIRY";
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
  const {
    data: studentPostsData,
    isLoading: isLoadingStudentPosts,
    isError: isErrorStudentPosts,
  } = useStudentPostsSVC(
    {
      page: query.page,
      limit: query.limit,
      search: debouncedSearchTerm || undefined,
      answerStatus: query.answerStatus === "ALL" ? null : query.answerStatus,
      writerType: query.writerType === "ALL" ? null : query.writerType,
    },
    { enabled: isInquiryTab }
  );

  // 강사 공지 목록 조회
  const {
    data: instructorPostsData,
    isLoading: isLoadingInstructorPosts,
    isError: isErrorInstructorPosts,
  } = useInstructorPostsSVC(
    {
      page: query.page,
      limit: query.limit,
      search: debouncedSearchTerm || undefined,
      postType: query.postType === "ALL" ? null : query.postType,
    },
    { enabled: !isInquiryTab }
  );

  // 탭 선택에 따른 현재 표시 데이터
  const currentResponse = isInquiryTab ? studentPostsData : instructorPostsData;

  const isLoading = isInquiryTab
    ? isLoadingStudentPosts
    : isLoadingInstructorPosts;

  const isError = isInquiryTab ? isErrorStudentPosts : isErrorInstructorPosts;

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
    router.replace(`/learners/communication?tab=${tab}`, { scroll: false });
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
        <InquiryFilterSVC
          query={query}
          setQuery={setQuery}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <NotificationFilterSVC
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
        ) : isError ? (
          <div className="flex items-center justify-center h-[550px]">
            <p className="text-muted-foreground">오류가 발생했습니다.</p>
          </div>
        ) : (
          <>
            {isInquiryTab ? (
              // 문의글 전용 테이블
              <DataTable
                data={studentPostsData?.list ?? []}
                columns={INQUIRY_TABLE_COLUMNS_SVC}
                onRowClick={(row) =>
                  router.push(`/learners/communication/${row.id}?type=inquiry`)
                }
              />
            ) : (
              // 공지사항 전용 테이블
              <DataTable
                data={instructorPostsData?.list ?? []}
                columns={NOTICE_TABLE_COLUMNS_SVC}
                onRowClick={(row) =>
                  router.push(`/learners/communication/${row.id}?type=notice`)
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
