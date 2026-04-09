import Image from "next/image";
import Link from "next/link";

const footerLogo = "/brand/ssam-b.svg";

export function DashboardFooter() {
  return (
    <footer className="bg-neutral-100 px-20 py-12 mt-20">
      <div className="mx-auto flex w-[312px] flex-col items-center gap-8 text-center">
        <Image
          src={footerLogo}
          alt="ssam B 로고"
          width={121}
          height={28}
          priority
        />
        <nav className="flex w-full items-center justify-between text-[16px] font-semibold leading-6 tracking-[-0.16px] text-gray-400">
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
      </div>
    </footer>
  );
}
