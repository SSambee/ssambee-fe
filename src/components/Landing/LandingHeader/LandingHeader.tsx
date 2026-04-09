"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuthContext } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  API_URL_TYPE,
  getDashboardHomePath,
  useAuth,
} from "@/shared/common/hooks/useAuth";

export function LandingHeader() {
  const { user, isLoading } = useAuthContext();
  const { signout, loading } = useAuth();

  return (
    <div className="relative overflow-hidden bg-[#f8f9ff]">
      <header className="relative z-10">
        <div className="mx-auto flex h-[110px] w-full max-w-[1920px] items-center justify-between px-6 lg:px-[210px]">
          <Link href="/">
            <Image
              src="/brand/ssam-b.svg"
              alt="SSam B"
              width={160}
              height={52}
              priority
            />
          </Link>

          <div className="flex min-h-12 items-center justify-end gap-3">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-12 w-[88px] animate-pulse rounded-xl bg-gray-200/80" />
                <div className="h-12 w-[120px] animate-pulse rounded-xl bg-gray-200/80" />
              </div>
            ) : user ? (
              <>
                <Button
                  asChild
                  className="h-12 rounded-xl bg-brand-700 px-7 text-sm font-semibold text-white shadow-[0px_0px_14px_0px_rgba(138,138,138,0.08)] hover:bg-brand-800"
                >
                  <Link href={getDashboardHomePath(user.userType)}>
                    대시보드 이동
                  </Link>
                </Button>
                <Button
                  type="button"
                  onClick={() => signout(API_URL_TYPE[user.userType])}
                  disabled={loading}
                  className="h-12 rounded-xl border border-brand-100 bg-brand-25 px-7 text-sm font-semibold text-brand-700 shadow-[0px_0px_14px_0px_rgba(138,138,138,0.08)] hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  className="h-12 rounded-xl bg-brand-700 px-7 text-sm font-semibold text-white shadow-[0px_0px_14px_0px_rgba(138,138,138,0.08)] hover:bg-brand-800"
                >
                  <Link href="/educators/login">로그인</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 rounded-xl border border-brand-100 bg-brand-25 px-7 text-sm font-semibold text-brand-700 shadow-[0px_0px_14px_0px_rgba(138,138,138,0.08)] hover:bg-brand-50"
                >
                  <Link href="/learners/login">학생 로그인</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
