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
    <footer className="bg-white px-[82px] py-[84px]">
      <div className="mx-auto flex w-[312px] flex-col items-center gap-10 text-center">
        <Image
          src={footerLogo}
          alt="ssam B 로고"
          width={121}
          height={28}
          priority
        />

        <nav className="flex w-full items-center justify-between text-[16px] font-semibold leading-6 tracking-[-0.16px] text-[#8b90a3]">
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
      </div>
    </footer>
  );
}
