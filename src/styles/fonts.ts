import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "../assets/fonts/pretendard/PretendardVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-pretendard",
});
