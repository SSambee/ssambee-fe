"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import DataTable from "@/components/common/table/DataTable";
import { Pagination } from "@/components/common/pagination/Pagination";
import {
  useAssistantWorks,
  useInstructorPosts,
  useStudentPosts,
} from "@/hooks/useInstructorPost";
import { useDebounce } from "@/hooks/useDebounce";
import {
  PaginationType,
  PostFilterQuery,
} from "@/types/communication/commonPost";
import { useAuthContext } from "@/providers/AuthProvider";

import NotificationFilter from "../filter/NotificationFilter";
import { NOTICE_POST_COLUMNS } from "../table/NoticeTableColumns";
import { INQUIRY_TABLE_COLUMNS } from "../table/InquiryTableColumns";
import { ASSISTANT_WORKS_COLUMNS } from "../table/AssistantTableColumns";

import InquiryFilter from "./InquiryFilter";
import AssistantWorksFilter from "./AssistantWorksFilter";

const PAGE_LIMIT = 10;
type TabType = "INQUIRY" | "NOTICE" | "WORKS";

export default function TabSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthContext();

  const isAssistant = user?.userType === "ASSISTANT";

  const rawTab = searchParams.get("tab");
  const VALID_TABS: TabType[] = [
    "INQUIRY",
    "NOTICE",
    ...(isAssistant ? (["WORKS"] as TabType[]) : []),
  ];
  const initialTab: TabType =
    rawTab && VALID_TABS.includes(rawTab as TabType)
      ? (rawTab as TabType)
      : "INQUIRY";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

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
    workStatus: "ALL",
    priority: "ALL",
  });

  // 탭 상태
  const isInquiryTab = activeTab === "INQUIRY";
  const isNoticeTab = activeTab === "NOTICE";
  const isWorksTab = activeTab === "WORKS";

  const tabs = [
    { id: "INQUIRY", label: "문의글" },
    { id: "NOTICE", label: "공지사항" },
    ...(isAssistant ? [{ id: "WORKS", label: "조교 업무" }] : []),
  ];

  // 문의 목록 조회
  const {
    data: studentPostsData,
    isLoading: isLoadingStudentPosts,
    isError: isErrorStudentPosts,
  } = useStudentPosts(
    {
      page: query.page,
      limit: query.limit,
      search: debouncedSearchTerm || undefined,
      answerStatus: query.answerStatus === "ALL" ? null : query.answerStatus,
      writerType: query.writerType === "ALL" ? null : query.writerType,
    },
    { enabled: isInquiryTab }
  );

  // 강사 게시글 목록 조회
  const {
    data: instructorPostsData,
    isLoading: isLoadingInstructorPosts,
    isError: isErrorInstructorPosts,
  } = useInstructorPosts(
    {
      page: query.page,
      limit: query.limit,
      search: debouncedSearchTerm || undefined,
      postType: query.postType === "ALL" ? null : query.postType,
    },
    { enabled: !isInquiryTab }
  );

  // 조교 업무 목록 조회
  const {
    data: assistantWorksData,
    isLoading: isLoadingWorks,
    isError: isErrorWorks,
  } = useAssistantWorks(
    {
      page: query.page,
      limit: query.limit,
      search: debouncedSearchTerm || undefined,
      workStatus: query.workStatus === "ALL" ? null : query.workStatus,
      priority: query.priority === "ALL" ? null : query.priority,
    },
    { enabled: isWorksTab && isAssistant }
  );

  const isLoading = isInquiryTab
    ? isLoadingStudentPosts
    : isNoticeTab
      ? isLoadingInstructorPosts
      : isLoadingWorks;
  const isError = isInquiryTab
    ? isErrorStudentPosts
    : isNoticeTab
      ? isErrorInstructorPosts
      : isErrorWorks;

  // 탭 선택에 따른 현재 표시 데이터
  const currentResponse = isInquiryTab
    ? studentPostsData
    : isNoticeTab
      ? instructorPostsData
      : isWorksTab
        ? assistantWorksData
        : null;

  const pagination: PaginationType = currentResponse?.pagination ?? {
    totalCount: 0,
    totalPage: 1,
    currentPage: 1,
    limit: PAGE_LIMIT,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.replace(`/educators/communication?tab=${tab}`, { scroll: false });
    setSearchTerm("");

    setQuery({
      page: 1,
      limit: PAGE_LIMIT,
      answerStatus: "ALL",
      writerType: "ALL",
      postType: "ALL",
      workStatus: "ALL",
      priority: "ALL",
    }); // 탭 변경 시 페이지 & 쿼리 초기화
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as TabType)}
            className={`px-6 py-3 text-[18px] font-medium transition-colors relative cursor-pointer ${
              activeTab === tab.id
                ? "text-brand-700 border-brand-800"
                : "text-neutral-500 hover:text-neutral-700"
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
      ) : isNoticeTab ? (
        <NotificationFilter
          query={query}
          setQuery={setQuery}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : isWorksTab ? (
        <AssistantWorksFilter
          query={query}
          setQuery={setQuery}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : null}
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
            {isInquiryTab && (
              // 문의글 전용 테이블
              <DataTable
                data={studentPostsData?.list ?? []}
                columns={INQUIRY_TABLE_COLUMNS}
                onRowClick={(row) =>
                  router.push(`/educators/communication/${row.id}?type=inquiry`)
                }
              />
            )}
            {isNoticeTab && (
              // 공지사항 전용 테이블
              <DataTable
                data={instructorPostsData?.list ?? []}
                columns={NOTICE_POST_COLUMNS}
                onRowClick={(row) =>
                  router.push(`/educators/communication/${row.id}?type=notice`)
                }
              />
            )}
            {isWorksTab && (
              <DataTable
                data={assistantWorksData?.orders ?? []}
                columns={ASSISTANT_WORKS_COLUMNS}
                onRowClick={(row) =>
                  router.push(`/educators/communication/${row.id}?type=works`)
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
