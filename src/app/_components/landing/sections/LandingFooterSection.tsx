import Image from "next/image";
import Link from "next/link";

import {
  FOOTER_ADDRESS_LINE,
  FOOTER_BRAND_LOGO_ALT,
  FOOTER_BRAND_LOGO_SRC,
  FOOTER_BUSINESS_REG_LINE,
  FOOTER_COMPANY_LINE,
  FOOTER_CONTACT_COMBINED_LINE,
  FOOTER_COPYRIGHT,
  FOOTER_NAV_ITEMS,
} from "@/shared/common/lib/constants/footer-constants";

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
          src={FOOTER_BRAND_LOGO_SRC}
          alt={FOOTER_BRAND_LOGO_ALT}
          width={121}
          height={28}
          priority
        />

        <nav className="flex w-full max-w-[312px] items-center justify-between text-[16px] font-semibold leading-6 tracking-[-0.16px] text-[#8b90a3]">
          {FOOTER_NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
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
          <p className="font-medium">{FOOTER_COPYRIGHT}</p>
          <div className="flex flex-col gap-1 text-xs leading-relaxed">
            <p>{FOOTER_COMPANY_LINE}</p>
            <p>{FOOTER_ADDRESS_LINE}</p>
            <p>{FOOTER_BUSINESS_REG_LINE}</p>
            <p>{FOOTER_CONTACT_COMBINED_LINE}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
