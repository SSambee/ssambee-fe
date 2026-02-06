"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Title from "@/components/common/header/Title";
import { useModal } from "@/providers/ModalProvider";
import { useStudentSelectionStore } from "@/stores/studentsList.store";
import {
  PaginationType,
  EnrollmentListQuery,
  StudentStatus,
} from "@/types/students.type";
import {
  useEnrollmentList,
  useLecturesList,
  useUpdateAllAttendance,
  useUpdateEnrollment,
} from "@/hooks/useEnrollment";
import { STUDENT_STATUS_LABEL } from "@/constants/students.default";
import { Pagination } from "@/components/common/pagination/Pagination";
import { CheckModal } from "@/components/common/modals/CheckModal";
import { getTodayYMD } from "@/utils/date";
import { useDebounce } from "@/hooks/useDebounce";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

import { StudentTableData } from "./_components/table/StudentTableColumns";
import { StudentFilter } from "./_components/filter/StudentFilter";
import { StudentActions } from "./_components/action/StudentActions";
import { StudentTable } from "./_components/table/StudentTable";

const PAGE_LIMIT = 10;

export default function StudentsListPage() {
  const router = useRouter();
  const { openModal } = useModal();

  useSetBreadcrumb([{ label: "학생 관리" }]);

  // 검색어
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 체크박스 스토어
  const {
    selectedStudentIds,
    toggleStudent,
    addStudents,
    removeStudents,
    resetSelection,
  } = useStudentSelectionStore();

  // 강의 목록 불러오기
  const { data: lectures = [] } = useLecturesList({ page: 1, limit: 100 });
  const lectureOptions = [
    { label: "전체 수업", value: "all", status: null },
    ...lectures.map((l) => ({
      label: l.title,
      value: l.id,
      status: l.status,
    })),
  ];

  // 요청 쿼리
  const [query, setQuery] = useState<EnrollmentListQuery>({
    page: 1,
    limit: PAGE_LIMIT,
    keyword: "",
    year: null,
    status: null,
    lecture: null,
    examId: null,
  });

  // 디바운스된 검색어가 바뀔 때만 실제 query의 keyword를 업데이트
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      keyword: debouncedSearchTerm,
      page: 1, // 검색어가 바뀌면 1페이지로 리셋
    }));
  }, [debouncedSearchTerm]);

  // 수강생 목록 조회 -> 검색할 때 query.keyword가 0.5초 뒤에 변경됨
  const { data, isPending, isError } = useEnrollmentList(query);

  const studentList = data?.list || [];
  const pagination: PaginationType = data?.pagination ?? {
    totalCount: 0,
    totalPage: 1,
    currentPage: 1,
    limit: PAGE_LIMIT,
    hasNextPage: false,
    hasPrevPage: false,
  };

  // 전체 인원 수 표시용
  const { data: totalData } = useEnrollmentList({ page: 1, limit: 1 });
  const ListTotalCount = totalData?.pagination?.totalCount ?? 0;

  // 수강생 재원 상태 수정
  const { mutate: updateStatus } = useUpdateEnrollment();

  // 단체 출결 등록
  const { mutate: updateAllAttendance, isPending: isUpdating } =
    useUpdateAllAttendance();

  // 현재 선택된 수업의 상세 정보 찾기
  const selectedLectureInfo = query.lecture
    ? lectures.find((l) => l.id === query.lecture)
    : null;

  // 현재 페이지의 모든 학생이 선택되었는지 여부 확인
  const isCurrentPageAllSelected =
    studentList.length > 0 &&
    studentList.every((s) => selectedStudentIds.includes(s.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // 현재 페이지 학생들만 스토어에 추가 + 데이터 저장(모달 표시용)
      const studentsToSelect = studentList.map((s) => ({
        enrollmentId: s.id,
        name: s.studentName,
        phoneNumber: s.studentPhone,
        parentPhone: s.parentPhone,
        title: s.lecture.title,
      }));
      addStudents(studentsToSelect);
    } else {
      // 현재 페이지 학생들의 ID만 추출하여 스토어에서 제거
      const currentPageIds = studentList.map((s) => s.id);
      removeStudents(currentPageIds);
    }
  };

  // 수강생 상세 페이지 이동
  const handleNavigate = (id: string) => {
    router.push(`/educators/students/${id}`);
  };

  // 수강생 재원 상태 변경
  const handleStatusChange = (id: string, status: StudentStatus) => {
    const student = studentList.find((s) => s.id === id);
    if (!student) return;

    const oldStatusLabel = STUDENT_STATUS_LABEL[student.status];
    const newStatusLabel = STUDENT_STATUS_LABEL[status];

    openModal(
      <CheckModal
        title="상태 변경 확인"
        description={`${student.studentName} 학생의 상태를 ${oldStatusLabel}에서 ${newStatusLabel}으로 변경하시겠습니까?`}
        confirmText="확인"
        onConfirm={() => {
          updateStatus(
            { id, data: { status: status } },
            {
              onSuccess: () => {
                alert("상태 변경이 완료되었습니다.");
              },
              onError: () => {
                alert("오류가 발생했습니다. 다시 시도해주세요.");
              },
            }
          );
        }}
      />
    );
  };

  const handleAttendanceClick = () => {
    if (selectedStudentIds.length === 0 || !query.lecture) return;

    openModal(
      <CheckModal
        title="일괄 출결 등록"
        description={`선택한 ${selectedStudentIds.length}명의 학생을 오늘(${getTodayYMD()})자로 '출석' 처리하시겠습니까?`}
        confirmText="출석 등록"
        onConfirm={() => {
          updateAllAttendance(
            {
              lectureId: query.lecture ?? "",
              enrollmentIds: selectedStudentIds,
              status: "PRESENT",
            },
            {
              onSuccess: () => {
                resetSelection();
              },
            }
          );
        }}
      />
    );
  };

  if (isError) return <div>조회 실패</div>;

  // 테이블 컬럼 데이터
  const columns = StudentTableData({
    selectedStudents: selectedStudentIds,
    onToggleStudent: (student) =>
      toggleStudent({
        enrollmentId: student.id,
        name: student.studentName,
        phoneNumber: student.studentPhone,
        parentPhone: student.parentPhone,
        title: student.lecture.title,
      }),
    onNavigate: handleNavigate,
    onStatusChange: handleStatusChange,
  });

  return (
    <div className="container mx-auto px-8 py-8 max-w-[1400px]">
      <Title
        title="전체 학생 관리"
        description={`총 ${ListTotalCount}명의 학생 정보를 관리하고 있습니다.`}
      />

      <StudentFilter
        query={query}
        setQuery={setQuery}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        lectureOptions={lectureOptions.map((option) => ({
          label: option.label,
          value: option.value,
          status: option.status ?? null,
        }))}
      />

      <StudentActions
        selectedStudentIds={selectedStudentIds}
        queryLecture={query.lecture ?? null}
        isUpdating={isUpdating}
        selectedLectureStatus={selectedLectureInfo?.status}
        onAttendanceClick={handleAttendanceClick}
      />

      <StudentTable
        isPending={isPending}
        studentList={studentList}
        isCurrentPageAllSelected={isCurrentPageAllSelected}
        handleSelectAll={handleSelectAll}
        columns={columns}
      />

      <Pagination
        pagination={pagination as PaginationType}
        onPageChange={(page) =>
          setQuery((prev) => ({
            ...prev,
            page,
          }))
        }
      />
    </div>
  );
}
