import { z } from "zod";

export const questionSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().optional(),
    type: z.literal("객관식"),
    score: z.number().int().min(0, "배점은 0 이상이어야 합니다"),
    category: z.string().optional(),
    source: z.string().optional(),
    content: z.string().trim().min(1, "문항 내용을 입력해주세요"),
    answer: z.object({
      selected: z.number().int().min(1).max(5),
    }),
  }),
  z.object({
    id: z.string().optional(),
    type: z.literal("주관식"),
    score: z.number().int().min(0, "배점은 0 이상이어야 합니다"),
    category: z.string().optional(),
    source: z.string().optional(),
    content: z.string().trim().min(1, "문항 내용을 입력해주세요"),
    answer: z.object({
      text: z.string().min(1, "정답을 입력해주세요"),
    }),
  }),
]);

export const examFormSchema = z
  .object({
    name: z.string().trim().min(1, "시험명을 입력해주세요"),
    subject: z.string().trim().min(1, "과목을 선택해주세요"),
    category: z.string().optional(),
    examDate: z.string().trim().min(1, "시험일을 선택해주세요"),
    lectureId: z.string().trim().min(1, "수업을 선택해주세요"),
    source: z.string().optional(),
    passScore: z.number().min(0).max(100).optional(),
    isAutoClinic: z.boolean(),
    autoScore: z.boolean(),
    questions: z
      .array(questionSchema)
      .min(1, "최소 1개 이상의 문항이 필요합니다"),
  })
  .superRefine((data, ctx) => {
    if (!data.questions || data.questions.length === 0) return;
    const totalScore = data.questions.reduce(
      (sum, question) => sum + question.score,
      0
    );
    if (totalScore !== 100) {
      ctx.addIssue({
        code: "custom",
        message: "총 배점은 100점이어야 합니다.",
        path: ["questions"],
      });
    }
  });

export type ExamFormInput = z.infer<typeof examFormSchema>;
