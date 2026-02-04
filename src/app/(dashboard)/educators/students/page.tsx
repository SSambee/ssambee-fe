"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Title from "@/components/common/header/Title";
import SelectBtn from "@/components/common/button/SelectBtn";
import StatusLabel from "@/components/common/label/StatusLabel";
import { useModal } from "@/providers/ModalProvider";
import { useStudentSelectionStore } from "@/stores/studentsList.store";
import {
  PaginationType,
  SchoolYear,
  EnrollmentListQuery,
  StudentStatus,
} from "@/types/students.type";
import {
  useEnrollmentList,
  useLecturesList,
  useUpdateAllAttendance,
  useUpdateEnrollment,
} from "@/hooks/useEnrollment";
import {
  GRADE_SELECT_OPTIONS,
  STATUS_SELECT_OPTIONS,
  STUDENT_STATUS_LABEL,
  STUDENTS_TABLE_COLUMNS,
  LECTURE_STATUS_LABEL,
} from "@/constants/students.default";
import { Pagination } from "@/components/common/pagination/Pagination";
import { CheckModal } from "@/components/common/modals/CheckModal";
import { getTodayYMD } from "@/utils/date";
import { useDebounce } from "@/hooks/useDebounce";

import { StudentChangeModal } from "./_components/students-modal/ClassChangeModal";
import { TalkNotificationModal } from "./_components/students-modal/TalkNotificationModal";
import { StudentTableData } from "./_components/table/StudentTableColumns";
import { StudentCreateModal } from "./_components/students-modal/StudentCreateModal";

const PAGE_LIMIT = 10;

export default function StudentsListPage() {
  const router = useRouter();
  const { openModal } = useModal();

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
  const { data: lectures = [] } = useLecturesList({ page: 1, limit: 20 });

  const lectureOptions = useMemo(
    () => [
      { label: "전체 수업", value: "all", status: null },
      ...lectures.map((l) => ({
        label: l.title,
        value: l.id,
        status: l.status,
      })),
    ],
    [lectures]
  );

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

  // 수강생 재원 상태 수정
  const { mutate: updateStatus } = useUpdateEnrollment();

  // 단체 출결 등록
  const { mutate: updateAllAttendance, isPending: isUpdating } =
    useUpdateAllAttendance();

  // 현재 선택된 수업의 상세 정보 찾기
  const selectedLectureInfo = useMemo(() => {
    if (!query.lecture) return null;
    return lectures.find((l) => l.id === query.lecture);
  }, [lectures, query.lecture]);

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
    if (selectedStudentIds.length === 0) return;

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
        description={`총 ${pagination.totalCount}명의 학생 정보를 관리하고 있습니다.`}
      />
      {/* 필터 */}
      <div className="border rounded-lg p-4 mt-[74px]">
        <div className="w-full flex flex-col items-start gap-2 mb-3">
          <h2 className="text-lg font-semibold mr-1">수업 선택</h2>

          <div className="w-full flex flex-wrap items-center gap-4">
            <div className="w-full lg:w-[280px] shrink-0 h-14">
              <SelectBtn
                className="text-base px-4 h-full w-full"
                optionSize="sm"
                value={query.lecture ?? "all"}
                placeholder="전체 수업"
                options={lectureOptions.map((option) => ({
                  value: option.value,
                  label: option.status ? (
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                      <StatusLabel
                        color={LECTURE_STATUS_LABEL[option.status].color}
                      >
                        {LECTURE_STATUS_LABEL[option.status].label}
                      </StatusLabel>
                    </div>
                  ) : (
                    option.label
                  ),
                }))}
                onChange={(value) =>
                  setQuery((prev) => ({
                    ...prev,
                    lecture: value === "all" ? null : (value as string),
                    page: 1,
                  }))
                }
              />
            </div>

            <div className="flex-1 flex flex-wrap sm:flex-nowrap justify-end items-center gap-3 h-ful text-base">
              <Input
                className="h-14 w-full sm:flex-1 min-w-[200px] max-w-[400px] p-4 text-base placeholder:text-base"
                placeholder="이름, 전화번호로 검색해보세요"
                value={searchTerm} // query.keyword 대신 사용
                onChange={(e) => setSearchTerm(e.target.value)} // setQuery 대신 setSearchTerm 사용
              />
              <div className="grid grid-cols-2 gap-2 w-full sm:w-[280px] shrink-0 h-14">
                <div className="h-full">
                  <SelectBtn
                    className="text-base px-4 h-full w-full"
                    optionSize="sm"
                    value={query.year ?? "all"}
                    placeholder="학년 선택"
                    options={GRADE_SELECT_OPTIONS}
                    onChange={(value) =>
                      setQuery((prev) => ({
                        ...prev,
                        year: value === "all" ? null : (value as SchoolYear),
                        page: 1,
                      }))
                    }
                  />
                </div>
                <div className="h-full">
                  <SelectBtn
                    className="text-base px-4 h-full w-full"
                    optionSize="sm"
                    value={query.status ?? "all"}
                    placeholder="상태 선택"
                    options={STATUS_SELECT_OPTIONS}
                    onChange={(value) =>
                      setQuery((prev) => ({
                        ...prev,
                        status:
                          value === "all" ? null : (value as StudentStatus),
                        page: 1,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-[58px] mb-5">
        {/* 모달 버튼 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => openModal(<StudentCreateModal />)}
          >
            학생 등록
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={selectedStudentIds.length === 0}
            onClick={() => openModal(<StudentChangeModal />)}
          >
            수업 변경
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={selectedStudentIds.length === 0}
            onClick={() => openModal(<TalkNotificationModal />)}
          >
            알림 발송
          </Button>
          <Button
            variant="default"
            disabled={
              !query.lecture ||
              selectedStudentIds.length === 0 ||
              isUpdating ||
              selectedLectureInfo?.status === "COMPLETED"
            }
            className="cursor-pointer"
            onClick={handleAttendanceClick}
          >
            {isUpdating ? "등록 중..." : "출결 등록"}
          </Button>
        </div>
        {selectedStudentIds.length > 0 && (
          <div>
            <span className="flex items-end text-sm text-muted-foreground">
              선택된 학생 {selectedStudentIds.length}명
            </span>
          </div>
        )}
      </div>

      {/* 테이블 */}
      <div className="border rounded-lg overflow-x-auto min-h-[550px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap w-[50px]">
                <Checkbox
                  checked={isCurrentPageAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              {STUDENTS_TABLE_COLUMNS.map((col) => (
                <TableHead key={col.key} className="whitespace-nowrap">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={STUDENTS_TABLE_COLUMNS.length + 1}
                  className="text-center"
                >
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : studentList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={STUDENTS_TABLE_COLUMNS.length + 1}
                  className="h-[550px] text-center align-middle"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-gray-400 text-lg font-medium">
                      검색 결과가 없습니다.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              studentList.map((studentData) => (
                <TableRow key={studentData.id}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className="whitespace-nowrap text-sm"
                    >
                      {col.render(studentData)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
