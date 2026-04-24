type TitleProps = {
  title: string;
  description?: string;
};

export default function Title({ title, description }: TitleProps) {
  return (
    <section className="-mx-6 -mt-6 border-b border-neutral-100 bg-white px-6 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-col gap-[6px]">
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-label-normal sm:text-[36px] sm:leading-[48px]">
          {title}
        </h1>
        {description ? (
          <p className="text-[16px] font-medium leading-6 tracking-[-0.01em] text-label-alternative sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
