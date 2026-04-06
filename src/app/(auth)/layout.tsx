import AuthBoundaryProvider from "@/app/providers/AuthBoundaryProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthBoundaryProvider>{children}</AuthBoundaryProvider>;
}
