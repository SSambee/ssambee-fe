"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GradingQuestion } from "@/types/grading";

type QuestionAnswerListProps = {
  questions: GradingQuestion[];
  examSubtitle: string;
  disabled?: boolean;
  onSelectObjectiveAnswer?: (questionNumber: number, answer: number) => void;
  onEssayAnswerChange?: (questionNumber: number, value: string) => void;
  onEssayCorrectChange?: (questionNumber: number, isCorrect: boolean) => void;
};

export function QuestionAnswerList({
  questions,
  examSubtitle,
  disabled = false,
  onSelectObjectiveAnswer,
  onEssayAnswerChange,
  onEssayCorrectChange,
}: QuestionAnswerListProps) {
  const totalCount = questions.length;
  const [visibleCount, setVisibleCount] = useState(10);
  const displayedCount = Math.min(visibleCount, totalCount);
  const visibleQuestions = questions.slice(0, displayedCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, totalCount));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">문항별 답안 입력</h2>
        <p className="text-sm text-muted-foreground">{examSubtitle}</p>
      </div>

      <div className="space-y-3">
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
            <Card key={question.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* 문항 번호 */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                    {question.number}
                  </div>

                  {/* 문항 정보 */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{question.title}</p>
                      <span className="text-sm text-muted-foreground">
                        {question.type} · {question.score}점
                      </span>
                    </div>

                    {/* 답안 선택 버튼 (객관식) */}
                    {question.type === "객관식" && (
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            className={`w-10 h-10 rounded border-2 font-medium transition-colors ${
                              question.studentAnswer === num
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-background border-input hover:bg-accent"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            onClick={() =>
                              onSelectObjectiveAnswer?.(question.number, num)
                            }
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
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={isEssayCorrect ? "default" : "outline"}
                            onClick={() =>
                              onEssayCorrectChange?.(question.number, true)
                            }
                            disabled={disabled || !hasEssayAnswer}
                          >
                            정답
                          </Button>
                          <Button
                            type="button"
                            variant={isEssayIncorrect ? "default" : "outline"}
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

                  {/* 상태 표시 */}
                  <div className="flex-shrink-0 text-right">
                    {question.status === "오답" ? (
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-1 rounded bg-red-500/20 text-red-600 text-xs font-medium">
                          오답
                        </span>
                        <p className="text-xs text-muted-foreground">
                          정답 {question.correctAnswer}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
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

      {/* 더보기 버튼 */}
      <div className="flex justify-center pt-2">
        <Button
          variant="outline"
          className="gap-2"
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
