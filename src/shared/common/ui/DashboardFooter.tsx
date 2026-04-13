import Image from "next/image";
import Link from "next/link";

const footerLogo = "/brand/ssam-b.svg";

export function DashboardFooter() {
  return (
    <footer className="bg-neutral-100 px-20 py-12 mt-20">
      <div className="mx-auto flex max-w-[600px] flex-col items-center gap-8 text-center">
        <Image
          src={footerLogo}
          alt="ssam B 로고"
          width={121}
          height={28}
          priority
        />
        <nav className="flex w-full max-w-[312px] items-center justify-between text-[16px] font-semibold leading-6 tracking-[-0.16px] text-gray-400">
          <Link href="#" className="transition-colors hover:text-neutral-700">
            이용약관
          </Link>
          <Link href="#" className="transition-colors hover:text-neutral-700">
            개인정보 처리방침
          </Link>
          <Link href="#" className="transition-colors hover:text-neutral-700">
            고객센터
          </Link>
        </nav>

        <div className="flex flex-col gap-3 text-sm text-gray-500">
          <p className="font-medium">© 2026 Ssambee. All Rights Reserved.</p>
          <div className="flex flex-col gap-1 text-xs leading-relaxed">
            <p>상호명: 공공구일 | 대표: 김윤기</p>
            <p>사업장소재지: 대구광역시 달서구 월배로94길 60</p>
            <p>사업자등록번호: 242-77-00590</p>
            <p>대표전화: 010-2180-6913 | 문의: meta-os@zohomail.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
