"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

type AuthLayoutProps = {
  title: string;
  description?: string;
  role: "instructor" | "assistant" | "student";
  type: "login" | "register";
  children: React.ReactNode;
};

const contentMap = {
  instructor: {
    login: {
      title: "교육 실무자를 위한\n전문 관리 시스템",
      subtitle:
        "강사와 조교님들의 효율적인 학사 행정을 지원합니다.\n실시간 성적 입력과 학생 출결 관리를 한 곳에서 시작하세요.",
      images: [
        "/image/instructor_review_1.svg",
        "/image/instructor_review_2.svg",
      ],
    },
    register: {
      title: "교육의 미래를\n선도하는 파트너",
      subtitle:
        "최고의 강의 환경과 학생 관리 시스템을 제공합니다.\n선생님의 열정을 뒷받침할 SsamB를 만나보세요.",
      images: [
        "/image/instructor_review_1.svg",
        "/image/instructor_review_2.svg",
      ],
    },
  },
  assistant: {
    login: {
      title: "교육 실무자를 위한\n전문 관리 시스템",
      subtitle:
        "강사와 조교님들의 효율적인 학사 행정을 지원합니다.\n실시간 성적 입력과 학생 출결 관리를 한 곳에서 시작하세요.",
      images: [
        "/image/instructor_review_1.svg",
        "/image/instructor_review_2.svg",
      ],
    },
    register: {
      title: "교육의 효율을\n극대화하는 조교 파트너",
      subtitle:
        "강사님과 유기적으로 소통하고 학생을 관리하세요.\n조교 전용 관리 툴로 업무 효율을 높여보세요.",
      images: [
        "/image/instructor_review_1.svg",
        "/image/instructor_review_2.svg",
      ],
    },
  },
  student: {
    login: {
      title: "새로운 시작을\n함께 만들어갑니다.",
      subtitle:
        "강력한 학습 관리 도구로 더 나은 교육 환경을 경험하세요.\n지금 바로 SsamB의 회원이 되어보세요.",
      images: ["/image/student_review_1.svg", "/image/student_review_2.svg"],
    },
    register: {
      title: "학습의 모든 과정을\n한 곳에서 스마트하게",
      subtitle:
        "학생과 학부모를 위한 전용 학습 지원 솔루션\n학업 성취도 확인과 맞춤형 관리를 지금 바로 시작하세요.",
      images: ["/image/student_review_1.svg", "/image/student_review_2.svg"],
    },
  },
};

export default function AuthLayout({
  title,
  description,
  role,
  type,
  children,
}: AuthLayoutProps) {
  const content = contentMap[role][type];
  const prefersReducedMotion = useReducedMotion();

  const IMAGE_WIDTH = 242;
  const IMAGE_GAP = 16;
  const IMAGE_SET_WIDTH =
    content.images.length * IMAGE_WIDTH +
    (content.images.length - 1) * IMAGE_GAP;
  const marqueeImages = [
    ...content.images,
    ...content.images,
    ...content.images,
    ...content.images,
  ];

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-brand-700 sticky top-0 h-screen items-center justify-center p-20">
        <div className="flex flex-col items-start justify-center overflow-hidden">
          <div>
            <h2
              className="text-[56px] font-bold leading-tight whitespace-pre-line"
              style={{ color: "#F4F6FE" }}
            >
              {content.title}
            </h2>
            <p
              className="text-[22px] leading-relaxed mt-6 whitespace-pre-line"
              style={{ color: "#A9BBFB" }}
            >
              {content.subtitle}
            </p>
          </div>
          <div className="mt-[160px] w-full overflow-hidden relative">
            <motion.div
              className="flex gap-4 w-max"
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      x: [0, -(IMAGE_SET_WIDTH * 2 + IMAGE_GAP * 2)],
                    }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 24,
                      ease: "linear",
                      repeat: Infinity,
                    }
              }
            >
              {marqueeImages.map((src, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden shrink-0"
                >
                  <Image
                    src={src}
                    alt={`review ${(index % content.images.length) + 1}`}
                    width={242}
                    height={242}
                    className="object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 bg-white">
        <div className="w-full max-w-[500px] space-y-6">
          <div className="text-left">
            <h1 className="text-[40px] font-bold text-label-normal mb-5">
              {title}
            </h1>
            {description && (
              <p className="text-[20px] font-semibold text-label-alternative mb-14">
                {description}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
