"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CommonDataTable, {
  ColumnDefinition,
} from "@/components/common/table/DataTable";
import { Pagination } from "@/components/common/pagination/Pagination";
import {
  MOCK_INSTRUCTOR_POSTS,
  MOCK_LEARNER_INQUIRIES,
} from "@/data/communication.mock";
import { LearnersWriteInquiry } from "@/types/communication.type";

import InquiryFilter from "../filter/InquiryFilter";
import NotificationFilter from "../filter/NotificationFilter";
import { INSTRUCTOR_POST_COLUMNS } from "../table/NoticeTableColumns";
import { INQUIRY_TABLE_COLUMNS } from "../table/InquiryTableColumns";

export default function TabSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"INQUIRY" | "NOTICE">("INQUIRY");

  const isInquiry = activeTab === "INQUIRY";

  const currentData = isInquiry
    ? MOCK_LEARNER_INQUIRIES
    : MOCK_INSTRUCTOR_POSTS;

  const currentColumns = isInquiry
    ? INQUIRY_TABLE_COLUMNS
    : INSTRUCTOR_POST_COLUMNS;

  return (
    <div className="space-y-6">
      {/* 탭 메뉴 */}
      <div className="flex border-b border-gray-200">
        {[
          { id: "INQUIRY", label: "문의글" },
          { id: "NOTICE", label: "내 공지사항" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "INQUIRY" | "NOTICE")}
            className={`px-6 py-3 text-base font-medium transition-colors relative ${
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

      {/* 필터 영역 */}
      {isInquiry ? <InquiryFilter /> : <NotificationFilter />}

      {/* 테이블 영역 */}
      <div className="min-h-[550px]">
        <CommonDataTable
          data={currentData as LearnersWriteInquiry[]}
          columns={currentColumns as ColumnDefinition<LearnersWriteInquiry>[]}
          onRowClick={(row) =>
            router.push(`/educators/communication/${row.id}`)
          }
        />
      </div>

      {/* 페이지네이션 */}
      <Pagination
        pagination={{
          totalCount: currentData.length,
          totalPage: 1,
          currentPage: 1,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        }}
        onPageChange={(page) => console.log(page)}
      />
    </div>
  );
}
