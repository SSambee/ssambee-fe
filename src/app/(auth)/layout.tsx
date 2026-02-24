import Providers from "@/providers/Providers";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
