"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GradingQuestion } from "@/types/grading";

type QuestionAnswerListProps = {
  questions: GradingQuestion[];
  examSubtitle: string;
  disabled?: boolean;
  onSelectObjectiveAnswer?: (questionNumber: number, answer: number) => void;
  onEssayAnswerChange?: (questionNumber: number, value: string) => void;
  onEssayCorrectChange?: (questionNumber: number, isCorrect: boolean) => void;
  onSaveAndNextAction?: () => void;
  canSaveAndNext?: boolean;
  onSelectPrevStudent?: () => void;
  onSelectNextStudent?: () => void;
};

const OBJECTIVE_CHOICES = [1, 2, 3, 4, 5] as const;

const resolveObjectiveDigit = (event: KeyboardEvent): number | null => {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return null;
  }

  if (/^[1-5]$/.test(event.key)) {
    return Number(event.key);
  }

  const numpadMatch = event.code.match(/^Numpad([1-5])$/);
  return numpadMatch ? Number(numpadMatch[1]) : null;
};

const isTextInputElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
};

export function QuestionAnswerList({
  questions,
  examSubtitle,
  disabled = false,
  onSelectObjectiveAnswer,
  onEssayAnswerChange,
  onEssayCorrectChange,
  onSaveAndNextAction,
  canSaveAndNext = false,
  onSelectPrevStudent,
  onSelectNextStudent,
}: QuestionAnswerListProps) {
  const totalCount = questions.length;
  const [visibleCount, setVisibleCount] = useState(10);
  const displayedCount = Math.min(visibleCount, totalCount);
  const visibleQuestions = questions.slice(0, displayedCount);
  const objectiveQuestions = useMemo(
    () => questions.filter((question) => question.type === "객관식"),
    [questions]
  );
  const objectiveIndexByNumber = useMemo(
    () =>
      new Map(
        objectiveQuestions.map((question, index) => [question.number, index])
      ),
    [objectiveQuestions]
  );
  const [activeObjectiveIndex, setActiveObjectiveIndex] = useState(0);
  const resolvedActiveObjectiveIndex =
    objectiveQuestions.length === 0
      ? 0
      : Math.min(activeObjectiveIndex, objectiveQuestions.length - 1);
  const hasPendingObjectiveAnswers = useMemo(
    () => objectiveQuestions.some((question) => question.status === "미입력"),
    [objectiveQuestions]
  );
  const activeObjectiveQuestion =
    objectiveQuestions[resolvedActiveObjectiveIndex];

  const ensureQuestionVisible = useCallback(
    (questionNumber: number) => {
      const targetIndex = questions.findIndex(
        (question) => question.number === questionNumber
      );

      if (targetIndex < 0 || targetIndex < displayedCount) {
        return;
      }

      setVisibleCount((prev) =>
        Math.min(totalCount, Math.max(prev + 10, targetIndex + 1))
      );
    },
    [displayedCount, questions, totalCount]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTextInputElement(event.target)) {
        return;
      }

      if (event.key === "[" || event.key === "PageUp") {
        event.preventDefault();
        onSelectPrevStudent?.();
        return;
      }

      if (event.key === "]" || event.key === "PageDown") {
        event.preventDefault();
        onSelectNextStudent?.();
        return;
      }

      if (disabled || objectiveQuestions.length === 0) {
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex = Math.max(resolvedActiveObjectiveIndex - 1, 0);
        setActiveObjectiveIndex(nextIndex);
        const targetQuestion = objectiveQuestions[nextIndex];
        if (targetQuestion) {
          ensureQuestionVisible(targetQuestion.number);
        }
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = Math.min(
          resolvedActiveObjectiveIndex + 1,
          objectiveQuestions.length - 1
        );
        setActiveObjectiveIndex(nextIndex);
        const targetQuestion = objectiveQuestions[nextIndex];
        if (targetQuestion) {
          ensureQuestionVisible(targetQuestion.number);
        }
        return;
      }

      const selectedNumber = resolveObjectiveDigit(event);
      if (selectedNumber !== null) {
        const questionNumber =
          objectiveQuestions[resolvedActiveObjectiveIndex]?.number;
        if (!questionNumber) return;

        event.preventDefault();
        onSelectObjectiveAnswer?.(questionNumber, selectedNumber);
        const nextIndex = Math.min(
          resolvedActiveObjectiveIndex + 1,
          objectiveQuestions.length - 1
        );
        setActiveObjectiveIndex(nextIndex);
        const targetQuestion = objectiveQuestions[nextIndex];
        if (targetQuestion) {
          ensureQuestionVisible(targetQuestion.number);
        }
        return;
      }

      if (
        event.key === "Enter" &&
        canSaveAndNext &&
        !hasPendingObjectiveAnswers
      ) {
        event.preventDefault();
        onSaveAndNextAction?.();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const nextIndex = Math.min(
          resolvedActiveObjectiveIndex + 1,
          objectiveQuestions.length - 1
        );
        setActiveObjectiveIndex(nextIndex);
        const targetQuestion = objectiveQuestions[nextIndex];
        if (targetQuestion) {
          ensureQuestionVisible(targetQuestion.number);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    disabled,
    canSaveAndNext,
    hasPendingObjectiveAnswers,
    objectiveQuestions,
    resolvedActiveObjectiveIndex,
    ensureQuestionVisible,
    onSaveAndNextAction,
    onSelectNextStudent,
    onSelectObjectiveAnswer,
    onSelectPrevStudent,
  ]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, totalCount));
  };

  return (
    <div className="space-y-4 rounded-[24px] border border-[#eaecf2] bg-white p-5 shadow-none sm:p-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-[20px] font-semibold tracking-[-0.2px] text-[#4a4d5c]">
            문항별 답안 입력
          </h2>
          <p className="text-[12px] font-medium text-[#8b90a3]">
            단축키: 1~5 입력 · ↑/↓ 문항 이동 · [ / ] 학생 이동 · Enter 저장+다음
            학생
          </p>
        </div>
        <p className="text-[13px] font-semibold text-[#8b90a3]">
          {examSubtitle}
        </p>
      </div>

      <div className="space-y-2.5">
        {visibleQuestions.map((question) => {
          const statusText =
            question.status === "미입력"
              ? question.type === "객관식"
                ? `미입력 정답 ${question.correctAnswer}`
                : "미입력"
              : question.status === "오답"
                ? "오답"
                : "정답";
          const isEssayCorrect = question.status === "정답";
          const isEssayIncorrect = question.status === "오답";
          const essayAnswer =
            typeof question.studentAnswer === "string"
              ? question.studentAnswer
              : "";
          const hasEssayAnswer = essayAnswer.trim().length > 0;

          return (
            <Card
              key={question.id}
              className={cn(
                "rounded-[18px] border border-[#eaecf2] bg-white shadow-none",
                question.type === "객관식" &&
                  activeObjectiveQuestion?.number === question.number
                  ? "border-[#c8d5ff] ring-2 ring-[#dce4ff]"
                  : ""
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[14px] font-semibold text-[#3863f6]">
                    {question.number}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-[#4a4d5c]">
                        {question.title}
                      </p>
                      <span className="text-[12px] font-semibold text-[#8b90a3]">
                        {question.type} · {question.score}점
                      </span>
                    </div>

                    {question.type === "객관식" && (
                      <div className="flex gap-2">
                        {OBJECTIVE_CHOICES.map((num) => (
                          <button
                            key={num}
                            type="button"
                            className={`h-9 w-9 rounded-[10px] border text-[13px] font-semibold transition-colors ${
                              question.studentAnswer === num
                                ? "border-[#3863f6] bg-[#3863f6] text-white"
                                : "border-[#d6d9e0] bg-white text-[#4a4d5c] hover:bg-[#fcfcfd]"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            onClick={() => {
                              const nextIndex = objectiveIndexByNumber.get(
                                question.number
                              );
                              if (nextIndex !== undefined) {
                                setActiveObjectiveIndex(nextIndex);
                              }
                              onSelectObjectiveAnswer?.(question.number, num);
                            }}
                            disabled={disabled}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    )}

                    {question.type === "주관식" && (
                      <div className="space-y-2">
                        <Input
                          value={essayAnswer}
                          onChange={(event) =>
                            onEssayAnswerChange?.(
                              question.number,
                              event.target.value
                            )
                          }
                          placeholder="학생 답안을 입력하세요"
                          disabled={disabled}
                          className="h-10 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[13px] font-medium tracking-[-0.13px] placeholder:text-[#8b90a3]"
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "h-9 rounded-[10px] px-4 text-[12px] font-semibold",
                              isEssayCorrect
                                ? "border-[#3863f6] bg-[#3863f6] text-white hover:bg-[#2f57e8] hover:text-white"
                                : "border-[#d6d9e0] bg-white text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                            )}
                            onClick={() =>
                              onEssayCorrectChange?.(question.number, true)
                            }
                            disabled={disabled || !hasEssayAnswer}
                          >
                            정답
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "h-9 rounded-[10px] px-4 text-[12px] font-semibold",
                              isEssayIncorrect
                                ? "border-[#3863f6] bg-[#3863f6] text-white hover:bg-[#2f57e8] hover:text-white"
                                : "border-[#d6d9e0] bg-white text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                            )}
                            onClick={() =>
                              onEssayCorrectChange?.(question.number, false)
                            }
                            disabled={disabled || !hasEssayAnswer}
                          >
                            오답
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-right">
                    {question.status === "오답" ? (
                      <div className="space-y-1">
                        <span className="inline-block rounded-full bg-[#ffefef] px-2.5 py-1 text-[11px] font-semibold text-[#d84949]">
                          오답
                        </span>
                        <p className="text-[11px] font-medium text-[#8b90a3]">
                          정답 {question.correctAnswer}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] font-medium text-[#8b90a3]">
                        {statusText}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-2">
        <Button
          variant="outline"
          className="h-10 gap-2 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
          onClick={handleLoadMore}
          disabled={displayedCount >= totalCount}
        >
          더보기 ({displayedCount}/{totalCount})
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
