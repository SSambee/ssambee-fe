export function DashboardHeader() {
  return (
    <section className="-mx-6 -mt-6 border-b border-[#e9ebf0] bg-white px-6 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-col gap-[6px]">
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#040405] sm:text-[36px] sm:leading-[48px]">
          홈
        </h1>
        <p className="text-[16px] font-medium leading-6 tracking-[-0.01em] text-[rgba(22,22,27,0.4)] sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
          오늘의 업무와 소통 현황을 한눈에 확인하세요
        </p>
      </div>
    </section>
  );
}
