"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const footerLogo = "/brand/ssam-b.svg";
const miniIcon = "/brand/mini-icon.svg";

export function DashboardSidebarFooterPanel() {
  return (
    <div className="w-full min-w-0">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="footer-info"
          className="overflow-hidden rounded-[12px] border-0 bg-transparent shadow-none [&:has([data-state=open])]:bg-[#f4f6fe]"
        >
          <AccordionTrigger className="group/service-policy relative h-14 cursor-pointer justify-between gap-[14px] rounded-[12px] bg-transparent px-6 py-4 text-[18px] font-semibold leading-[26px] tracking-[-0.18px] text-[rgba(22,22,27,0.28)] shadow-none transition-none hover:bg-transparent hover:text-inherit hover:no-underline data-[state=open]:rounded-b-none data-[state=open]:bg-transparent data-[state=open]:font-bold data-[state=open]:text-[#4b72f7] data-[state=open]:hover:bg-transparent data-[state=open]:hover:text-[#4b72f7] data-[state=open]:after:absolute data-[state=open]:after:bottom-0 data-[state=open]:after:left-4 data-[state=open]:after:right-4 data-[state=open]:after:h-px data-[state=open]:after:bg-[#e9ebf0] data-[state=open]:after:content-[''] [&>svg]:shrink-0 [&>svg]:text-current data-[state=open]:[&>svg]:text-[#4b72f7] data-[state=open]:hover:[&>svg]:text-[#4b72f7]">
            <span className="-ml-1 flex min-w-0 flex-1 items-center gap-[14px]">
              <Image
                src={miniIcon}
                alt=""
                width={22}
                height={22}
                className="size-[22px] shrink-0 opacity-[0.28] transition-none group-hover/service-policy:opacity-100 group-hover/service-policy:brightness-0 group-data-[state=open]/service-policy:opacity-100 group-data-[state=open]/service-policy:brightness-100 group-data-[state=open]/service-policy:group-hover/service-policy:brightness-100"
                aria-hidden
              />
              <span className="min-w-0 truncate">서비스 정책</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="border-0 pb-0 pt-0 [&>div]:px-6 [&>div]:pb-4 [&>div]:pt-3">
            <div className="flex flex-col items-start gap-4 text-left">
              <Image
                src={footerLogo}
                alt="ssam B 로고"
                width={100}
                height={23}
                className="h-[23px] w-auto shrink-0"
                priority
              />
              <nav className="flex w-full flex-col gap-2 text-[15px] font-semibold leading-6 tracking-[-0.15px] text-gray-400">
                <Link
                  href="#"
                  className="transition-colors hover:text-neutral-700"
                >
                  이용약관
                </Link>
                <Link
                  href="#"
                  className="transition-colors hover:text-neutral-700"
                >
                  개인정보 처리방침
                </Link>
                <Link
                  href="#"
                  className="transition-colors hover:text-neutral-700"
                >
                  고객센터
                </Link>
              </nav>

              <div className="flex w-full flex-col gap-1 text-left text-xs leading-relaxed text-gray-500">
                <p className="font-medium">
                  © 2026 Ssambee. All Rights Reserved.
                </p>
                <p>상호명: 공공구일</p>
                <p>대표: 김윤기</p>
                <p>사업장소재지: 대구광역시 달서구 월배로94길 60</p>
                <p>사업자등록번호: 242-77-00590</p>
                <p>대표전화: 010-2180-6913</p>
                <p>문의: meta-os@zohomail.com</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
