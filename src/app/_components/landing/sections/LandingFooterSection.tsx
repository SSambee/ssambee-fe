import Image from "next/image";
import Link from "next/link";

const footerLogo = "/brand/ssam-b.svg";

const footerSocialLinks = [
  { id: "facebook", href: "#", src: "/icons/social/facebook.svg" },
  { id: "instagram", href: "#", src: "/icons/social/instagram.svg" },
  { id: "linkedin", href: "#", src: "/icons/social/linkedin.svg" },
] as const;

export function LandingFooterSection() {
  return (
    <footer className="bg-white px-[82px] py-[70px]">
      <div className="mx-auto flex max-w-[600px] flex-col items-center gap-10 text-center">
        <Image
          src={footerLogo}
          alt="ssam B 로고"
          width={121}
          height={28}
          priority
        />

        <nav className="flex w-full max-w-[312px] items-center justify-between text-[16px] font-semibold leading-6 tracking-[-0.16px] text-[#8b90a3]">
          <Link href="#">이용약관</Link>
          <Link href="#">개인정보 처리방침</Link>
          <Link href="#">고객센터</Link>
        </nav>

        <div className="flex items-center gap-5">
          {footerSocialLinks.map((social) => (
            <Link
              key={social.id}
              href={social.href}
              aria-label={social.id}
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src={social.src}
                alt={`${social.id} icon`}
                width={40}
                height={40}
              />
            </Link>
          ))}
        </div>

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
