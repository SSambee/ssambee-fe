"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SerializedEditorState } from "lexical";
import { ArrowLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Title from "@/components/common/header/Title";
import { Editor } from "@/components/blocks/editor-00/editor";

// 타입 정의
type ViewerType = "학생/학부모" | "조교";

type Class = {
  id: string;
  name: string;
};

type Student = {
  id: string;
  name: string;
  classId: string;
  className: string;
};

// 목 데이터
const MOCK_CLASSES: Class[] = [
  { id: "class1", name: "수학 A반" },
  { id: "class2", name: "수학 B반" },
  { id: "class3", name: "영어 A반" },
  { id: "class4", name: "영어 B반" },
  { id: "class5", name: "과학 A반" },
  { id: "class6", name: "과학 B반" },
];

const MOCK_STUDENTS: Student[] = [
  { id: "student1", name: "김학생", classId: "class1", className: "수학 A반" },
  { id: "student2", name: "이학생", classId: "class1", className: "수학 A반" },
  { id: "student3", name: "박학생", classId: "class1", className: "수학 A반" },
  { id: "student4", name: "최학생", classId: "class2", className: "수학 B반" },
  { id: "student5", name: "정학생", classId: "class2", className: "수학 B반" },
  { id: "student6", name: "강학생", classId: "class3", className: "영어 A반" },
  { id: "student7", name: "조학생", classId: "class3", className: "영어 A반" },
  { id: "student8", name: "윤학생", classId: "class4", className: "영어 B반" },
  { id: "student9", name: "장학생", classId: "class4", className: "영어 B반" },
  { id: "student10", name: "임학생", classId: "class5", className: "과학 A반" },
  { id: "student11", name: "한학생", classId: "class5", className: "과학 A반" },
  { id: "student12", name: "오학생", classId: "class6", className: "과학 B반" },
];

const initialEditorValue = {
  root: {
    children: [
      {
        children: [],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export default function CreateInquiryPage() {
  const router = useRouter();

  // 에디터 상태
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialEditorValue);
  const [title, setTitle] = useState("");

  // 공개 대상 선택
  const [selectedViewers, setSelectedViewers] = useState<ViewerType[]>([]);

  // 알림 대상 선택
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // 공개 대상 토글
  const toggleViewer = (viewer: ViewerType) => {
    setSelectedViewers((prev) =>
      prev.includes(viewer)
        ? prev.filter((v) => v !== viewer)
        : [...prev, viewer]
    );
  };

  // 클래스 선택
  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    // 클래스 변경 시 선택된 학생 초기화
    setSelectedStudentIds([]);
  };

  // 필터링된 학생 목록
  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    const matchesClass = selectedClassId
      ? student.classId === selectedClassId
      : true;
    const matchesSearch = student.name
      .toLowerCase()
      .includes(studentSearchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // 표시할 학생 목록 (최대 5개)
  const displayedStudents = filteredStudents.slice(0, 5);
  const hasMoreStudents = filteredStudents.length > 5;

  // 학생 선택 토글
  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // 전체 선택/해제
  const toggleAllStudents = () => {
    if (selectedStudentIds.length === displayedStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(displayedStudents.map((s) => s.id));
    }
  };

  // 게시글 등록
  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (selectedViewers.length === 0) {
      alert("공개 대상을 선택해주세요.");
      return;
    }

    // TODO: API 호출
    console.log({
      title,
      content: editorState,
      viewers: selectedViewers,
      notifyStudents: selectedStudentIds,
    });

    alert("게시글이 등록되었습니다.");
    router.push("/educators/communication");
  };

  return (
    <div className="container mx-auto px-8 py-8 space-y-6 max-w-[1400px]">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Title title="문의 등록" description="새로운 문의를 작성합니다." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 공개 대상 및 알림 설정 */}
        <div className="space-y-6">
          {/* 공개 대상 선택 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">공개 대상</h3>
              <p className="text-sm text-muted-foreground">
                이 게시글을 볼 수 있는 대상을 선택하세요.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedViewers.includes("학생/학부모")
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => toggleViewer("학생/학부모")}
                >
                  <CardContent className="p-4 flex items-center justify-center">
                    <span className="text-sm font-medium">학생/학부모</span>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${
                    selectedViewers.includes("조교")
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => toggleViewer("조교")}
                >
                  <CardContent className="p-4 flex items-center justify-center">
                    <span className="text-sm font-medium">조교</span>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* 알림 대상 선택 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">알림 대상</h3>
              <p className="text-sm text-muted-foreground">
                게시글 등록 알림을 받을 학생을 선택하세요.
              </p>

              {/* 클래스 필터 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">클래스 선택</Label>
                <div className="max-h-[150px] overflow-y-auto space-y-1 border rounded-md p-2">
                  <div
                    className={`px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                      selectedClassId === ""
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => handleClassSelect("")}
                  >
                    전체 클래스
                  </div>
                  {MOCK_CLASSES.map((cls) => (
                    <div
                      key={cls.id}
                      className={`px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                        selectedClassId === cls.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleClassSelect(cls.id)}
                    >
                      {cls.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* 학생 검색 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">학생 검색</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="학생 이름으로 검색..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* 학생 목록 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">학생 선택</Label>
                  {displayedStudents.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={toggleAllStudents}
                      className="h-auto py-1 px-2 text-xs"
                    >
                      {selectedStudentIds.length === displayedStudents.length
                        ? "전체 해제"
                        : "전체 선택"}
                    </Button>
                  )}
                </div>

                <div className="max-h-[200px] overflow-y-auto space-y-1 border rounded-md p-2">
                  {displayedStudents.length > 0 ? (
                    <>
                      {displayedStudents.map((student) => (
                        <div
                          key={student.id}
                          className={`px-3 py-2 rounded-md text-sm cursor-pointer transition-colors flex items-center gap-2 ${
                            selectedStudentIds.includes(student.id)
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => toggleStudent(student.id)}
                        >
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={selectedStudentIds.includes(student.id)}
                            onCheckedChange={() => toggleStudent(student.id)}
                            onClick={(e) => e.stopPropagation()}
                            className={
                              selectedStudentIds.includes(student.id)
                                ? "border-primary-foreground"
                                : ""
                            }
                          />
                          <Label
                            htmlFor={`student-${student.id}`}
                            className="cursor-pointer flex-1"
                          >
                            {student.name}
                            <span
                              className={`text-xs ml-2 ${
                                selectedStudentIds.includes(student.id)
                                  ? "text-primary-foreground/80"
                                  : "text-muted-foreground"
                              }`}
                            >
                              ({student.className})
                            </span>
                          </Label>
                        </div>
                      ))}
                      {hasMoreStudents && (
                        <p className="text-xs text-muted-foreground text-center pt-2">
                          {filteredStudents.length - 5}명 더 있음 (검색으로
                          좁혀보세요)
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      검색 결과가 없습니다.
                    </p>
                  )}
                </div>

                {selectedStudentIds.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {selectedStudentIds.length}명 선택됨
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 게시글 작성 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">게시글 작성</h3>

              {/* 제목 입력 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">제목</Label>
                <Input
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* 에디터 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">내용</Label>
                <Editor
                  editorSerializedState={editorState}
                  onSerializedChange={(value) => setEditorState(value)}
                />
              </div>

              {/* 등록 버튼 */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => router.back()}>
                  취소
                </Button>
                <Button onClick={handleSubmit}>게시글 등록</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
