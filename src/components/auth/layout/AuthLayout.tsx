// src/components/layouts/AuthLayout.tsx
type AuthLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-background sticky top-0 h-screen items-center justify-center p-12">
        <div className="max-w-[500px] text-white">
          <span className="text-6xl">🎓 SSAMB</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 bg-white">
        <div className="w-full max-w-[500px] space-y-6">
          <div className="text-left">
            <h1 className="text-[40px] font-bold text-label-normal mb-5">
              {title}
            </h1>
            {description && (
              <p className="text-[20px] font-semibold text-label-alternative mb-14">
                {description}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
