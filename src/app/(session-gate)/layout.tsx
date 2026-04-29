import AuthBoundaryProvider from "@/app/providers/AuthBoundaryProvider";

export default function SessionGateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthBoundaryProvider>{children}</AuthBoundaryProvider>;
}
