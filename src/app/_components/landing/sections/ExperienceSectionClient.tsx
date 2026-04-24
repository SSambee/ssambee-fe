"use client";

import { motion, useReducedMotion } from "motion/react";

import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { TeacherProfileAvatar } from "@/components/common/avatar/TeacherProfileAvatar";

const SHARED_SECTION_BG =
  "radial-gradient(50% 50% at 50% 50%, rgba(221, 233, 253, 0.45) 15%, rgba(221, 233, 253, 0.45) 20%, rgba(227, 235, 254, 0.45) 25%, rgba(232, 238, 255, 0.45) 85%)";
const SECTION_TITLE_CLASS =
  "text-[34px] font-bold leading-[45px] tracking-[-0.34px] text-[#2b2e3a] lg:text-[44px] lg:leading-[58px] lg:tracking-[-0.44px]";
const SECTION_DESC_CLASS =
  "mx-auto mt-6 max-w-[860px] text-[18px] font-normal leading-[28px] tracking-[-0.18px] text-[#8b90a3] lg:text-[22px] lg:leading-[30px] lg:tracking-[-0.22px]";

const testimonials = [
  {
    id: "review-1",
    name: "김○○",
    role: "고2 학생",
    content: "과제랑 수업 일정이 한 화면에서\n보여서 꼼꼼하게 챙길 수 있어요.",
  },
  {
    id: "review-2",
    name: "김○○",
    role: "강사",
    content:
      "공지 전달과 과제 관리가 훨씬 간편해졌습니다. 학생들과의 소통도 더 원활해졌어요.",
  },
  {
    id: "review-3",
    name: "박○○",
    role: "고3 학생",
    content: "출결이랑 성적을 바로 확인할 수\n있어서 너무 편리해요.",
  },
  {
    id: "review-4",
    name: "이○○",
    role: "강사",
    content:
      "학생별 진행 상황을 쉽게 확인할 수 있어서 수업을 더 체계적으로 운영할 수 있게 됐어요.",
  },
  {
    id: "review-5",
    name: "윤○○",
    role: "학부모",
    content: "학원에 따로 문의하지 않아도\n진행 상황을 바로 확인할 수 있어요.",
  },
  {
    id: "review-6",
    name: "고○○",
    role: "조교",
    content: "업무 내역이 한 눈에 정리되어\n전달 누락이 줄어들었어요.",
  },
  {
    id: "review-7",
    name: "정○○",
    role: "학부모",
    content: "공지와 진도표가 정리되어 있어\n아이 학습 흐름을 보기 쉬웠어요.",
  },
] as const;

const REVIEW_CARD_WIDTH = 260;
const REVIEW_CARD_GAP = 16;
const REVIEW_SET_WIDTH =
  testimonials.length * REVIEW_CARD_WIDTH +
  (testimonials.length - 1) * REVIEW_CARD_GAP;
const marqueeTestimonials = [...testimonials, ...testimonials] as const;

function ReviewRoleAvatar({
  role,
  seedKey,
}: {
  role: string;
  seedKey: string;
}) {
  const isInstructor = role.includes("강사");

  if (isInstructor) {
    return (
      <TeacherProfileAvatar
        sizePreset="Medium"
        seedKey={seedKey}
        size={36}
        className="border border-[#ced9fd]/30"
        label="강사 아바타"
      />
    );
  }

  return (
    <StudentProfileAvatar
      sizePreset="Medium"
      seedKey={seedKey}
      size={36}
      className="border border-[#ced9fd]/30"
      label={`${role} 아바타`}
    />
  );
}

export default function ExperienceSectionClient() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative z-10 -mt-2 py-20 lg:-mt-3 lg:py-[96px]"
      style={{ background: SHARED_SECTION_BG }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/88 via-white/38 to-transparent blur-[3px]" />
      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-6">
        <motion.div
          className="mb-12 text-center"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className={SECTION_TITLE_CLASS}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            whileInView={
              prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
            }
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            SSam B로 달라진 수업 경험
          </motion.h2>
          <motion.p
            className={SECTION_DESC_CLASS}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
            whileInView={
              prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
            }
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
          >
            학생, 학부모, 강사, 조교 모두가 실제 수업에서 변화를 경험하고
            있어요.
            <br />
            지금 바로 SSam B에서 확인해보세요.
          </motion.p>
        </motion.div>

        <section className="overflow-hidden" aria-label="SSam B 사용자 후기">
          <motion.div
            className="flex w-max gap-4"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    x: [0, -REVIEW_SET_WIDTH],
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
            {marqueeTestimonials.map((testimonial, index) => {
              const isDuplicate = index >= testimonials.length;

              return (
                <motion.article
                  key={`${testimonial.id}-${index}`}
                  aria-hidden={isDuplicate}
                  className="relative h-[220px] w-[260px] shrink-0 overflow-hidden rounded-2xl bg-[#476ff7] px-6 py-6 shadow-[0px_0px_40px_0px_rgba(92,127,248,0.2)]"
                  initial={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: 0, y: 16, scale: 0.98 }
                  }
                  whileInView={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.42,
                    ease: "easeOut",
                    delay: prefersReducedMotion ? 0 : index * 0.07,
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: -7,
                          scale: 1.025,
                          boxShadow: "0px 28px 56px 0px rgba(55,86,170,0.32)",
                        }
                  }
                >
                  <div className="absolute inset-0 bg-[#f4f6fe] opacity-10" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <ReviewRoleAvatar
                        role={testimonial.role}
                        seedKey={`${testimonial.id}-${testimonial.name}`}
                      />
                      <div>
                        <div className="flex items-center gap-1.5 text-[16px] leading-6 tracking-[-0.16px]">
                          <p className="font-semibold text-[#f4f6fe]">
                            {testimonial.name}
                          </p>
                          <p className="font-medium text-[#ced9fd]">
                            {testimonial.role}
                          </p>
                        </div>
                        <p className="text-lg leading-5 tracking-tight text-[#f9d14c]">
                          ★★★★★
                        </p>
                      </div>
                    </div>
                    <p className="whitespace-pre-line text-[13px] font-normal leading-5 tracking-[-0.13px] text-[#ced9fd]">
                      {testimonial.content}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </section>
      </div>
    </section>
  );
}
