import dynamic from "next/dynamic";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useGetLecturesTargetSVC } from "@/hooks/SVC/useCommunicationSVC";

// 하이드레이션 에러
const SelectBtn = dynamic(
  () => import("@/components/common/button/SelectBtn"),
  {
    ssr: false, // 서버 사이드 렌더링 비활성화
    loading: () => (
      <div className="h-14 w-full bg-gray-100 rounded-lg animate-pulse" />
    ),
  }
);

type LectureOptionSelectProps = {
  selectedLectureId: string;
  onLectureIdChange: (id: string) => void;
};

export default function LectureOptionSelect({
  selectedLectureId,
  onLectureIdChange,
}: LectureOptionSelectProps) {
  const { data: lectures, isLoading, isError } = useGetLecturesTargetSVC();

  // 내 강의 목록
  const lectureOptions = (lectures || []).map((lecture) => {
    const days =
      lecture.lectureTimes?.length > 0
        ? Array.from(new Set(lecture.lectureTimes.map((t) => t.day))).join(", ")
        : "요일 정보 없음";

    return {
      label: `${lecture.title} (${days})`,
      value: lecture.id,
    };
  });

  if (isLoading)
    return (
      <Card>
        <CardContent className="p-10 text-center text-muted-foreground animate-pulse">
          강의 목록 로딩 중...
        </CardContent>
      </Card>
    );

  if (isError)
    return (
      <Card>
        <CardContent className="p-10 text-center text-muted-foreground">
          강의 목록 로딩 중 오류가 발생했습니다.
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">게시글 설정</h3>
        <p className="text-sm text-muted-foreground">
          게시글을 작성할 강의를 선택하세요.
        </p>

        <div className="space-y-2">
          <Label className="text-base font-medium">강의 선택</Label>
          <SelectBtn
            id="lectureSelect"
            value={selectedLectureId}
            onChange={(value) => onLectureIdChange(value)}
            placeholder="강의를 선택하세요"
            optionSize="lg"
            className="text-base px-4 h-[58px] w-full my-2"
            options={lectureOptions}
          />
        </div>
      </CardContent>
    </Card>
  );
}
