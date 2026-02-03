"use client";

import { Controller, UseFormReturn } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockLectures } from "@/data/lectures.mock";
import { ExamFormInput } from "@/validation/exam.validation";

type ExamInfoSectionProps = {
  form: UseFormReturn<ExamFormInput>;
  disabled?: boolean;
};

export function ExamInfoSection({
  form,
  disabled = false,
}: ExamInfoSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Card>
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">📄 시험 정보</h2>
      </div>
      <CardContent className="p-6 space-y-6">
        {/* 입력 필드 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 좌측 열 */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="exam-name"
                className="block text-sm font-medium mb-2"
              >
                시험 <span className="text-red-500">*</span>
              </label>
              <Input
                id="exam-name"
                {...register("name")}
                placeholder="예: 2024년 1학기 중간고사 수학"
                disabled={disabled}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="exam-subject"
                className="block text-sm font-medium mb-2"
              >
                과목 <span className="text-red-500">*</span>
              </label>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger id="exam-subject">
                      <SelectValue placeholder="과목 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="수학">수학</SelectItem>
                      <SelectItem value="영어">영어</SelectItem>
                      <SelectItem value="국어">국어</SelectItem>
                      <SelectItem value="과학">과학</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subject && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="exam-type"
                className="block text-sm font-medium mb-2"
              >
                시험지 유형
              </label>
              <Input
                id="exam-type"
                {...register("examType")}
                placeholder="예: 모의고사, 단원 평가"
                disabled={disabled}
              />
            </div>
            <div>
              <label
                htmlFor="exam-date"
                className="block text-sm font-medium mb-2"
              >
                시험일 <span className="text-red-500">*</span>
              </label>
              <Input
                id="exam-date"
                type="date"
                {...register("examDate")}
                disabled={disabled}
              />
              {errors.examDate && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.examDate.message}
                </p>
              )}
            </div>
          </div>

          {/* 우측 열 */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="exam-class"
                className="block text-sm font-medium mb-2"
              >
                수업 <span className="text-red-500">*</span>
              </label>
              <Controller
                name="lectureId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger id="exam-class">
                      <SelectValue placeholder="수업 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLectures.map((lecture) => (
                        <SelectItem key={lecture.id} value={lecture.id}>
                          {lecture.name} ({lecture.subject} ·{" "}
                          {lecture.schoolYear})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.lectureId && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.lectureId.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="exam-source"
                className="block text-sm font-medium mb-2"
              >
                출처
              </label>
              <Input
                id="exam-source"
                {...register("source")}
                placeholder="예: 자체 제작, 기출"
                disabled={disabled}
              />
            </div>
            <div>
              <label
                htmlFor="exam-pass-score"
                className="block text-sm font-medium mb-2"
              >
                통과 기준 점수
              </label>
              <div className="flex gap-2">
                <Input
                  id="exam-pass-score"
                  type="number"
                  placeholder="80"
                  {...register("passScore", {
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                  disabled={disabled}
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground">
                  점
                </span>
              </div>
              {errors.passScore && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.passScore.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 재시험 대상 자동 분류 활성화 */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("autoRetest")}
              disabled={disabled}
              className="mt-1"
            />
            <div>
              <div className="font-medium">재시험 대상 자동 분류 활성화</div>
              <div className="text-sm text-muted-foreground mt-1">
                통과 기준 점수에 미달하는 학생을 자동으로 재시험 대상 그룹으로
                분류합니다.
              </div>
            </div>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
