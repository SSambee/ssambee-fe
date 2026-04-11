"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputForm } from "@/components/common/input/InputForm";
import SelectBtn from "@/components/common/button/SelectBtn";
import { phoneNumberFormatter } from "@/utils/phone";
import {
  BankForm,
  ReceiptType,
  CustomerType,
  BANKS,
  INITIAL_FORM,
} from "@/features/landing/checkout/lib/types";
import { bankFormSchema } from "@/features/landing/checkout/lib/validation";

const RECEIPT_TYPE_OPTIONS: { value: ReceiptType; label: string }[] = [
  { value: "none", label: "미신청" },
  { value: "cash", label: "현금영수증" },
  { value: "tax", label: "세금계산서" },
];

const CUSTOMER_TYPE_OPTIONS: { value: CustomerType; label: string }[] = [
  { value: "personal", label: "개인" },
  { value: "business", label: "사업자" },
];

type Props = {
  amount: number;
  onSubmit: (data: BankForm) => void;
};

function StepLabel({ number, label }: { number: number; label: string }) {
  return (
    <h3 className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
      <span className="w-5 h-5 rounded-full bg-brand-700 text-white text-[10px] flex items-center justify-center font-bold">
        {number}
      </span>
      {label}
    </h3>
  );
}

export function BankFormSection({ amount, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<BankForm>({
    resolver: zodResolver(bankFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: INITIAL_FORM,
  });

  const formValues = useWatch({ control });

  const handleFormSubmit = (data: BankForm) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <StepLabel number={1} label="입금 정보" />
        <div className="p-4 mb-4 text-sm border border-blue-100 bg-blue-50 rounded-xl">
          <p className="font-semibold text-brand-700 mb-1">입금 계좌</p>
          <p className="text-gray-700">국민은행 123-456-789012 · (주)도코코</p>
          <p className="mt-1 text-xs text-gray-500">
            입금 확인 후 영업일 기준 1일 이내 이용 가능
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              입금 은행
            </label>
            <SelectBtn
              id="bank"
              value={formValues.bank || ""}
              onChange={(value) => setValue("bank", value)}
              placeholder="은행 선택"
              optionSize="sm"
              className="text-base px-4 h-[58px] w-full my-2"
              options={BANKS.map((bank) => ({ value: bank, label: bank }))}
              isError={!!errors.bank}
            />
            {errors.bank && (
              <p className="mt-1 text-[12px] text-red-600">
                {errors.bank.message}
              </p>
            )}
          </div>
          <InputForm
            id="depositorName"
            label="입금자명"
            error={errors.depositorName?.message}
            {...register("depositorName")}
            showReset={!!formValues.depositorName}
            onReset={() => {
              setValue("depositorName", "");
              clearErrors("depositorName");
            }}
          />
        </div>
      </div>

      <div>
        <StepLabel number={2} label="결제 증빙 신청" />
        <div className="grid grid-cols-3 gap-2 mb-4">
          {RECEIPT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("receiptType", opt.value)}
              className={`py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                formValues.receiptType === opt.value
                  ? "bg-brand-700 text-white border-brand-700"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-700/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {formValues.receiptType === "cash" && (
          <div className="p-4 space-y-4 border border-gray-100 rounded-xl bg-gray-50">
            <div>
              <p className="mb-2 text-xs text-gray-500">발급 유형</p>
              <div className="flex gap-3">
                {CUSTOMER_TYPE_OPTIONS.map((t) => (
                  <label
                    key={t.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={t.value}
                      checked={formValues.customerType === t.value}
                      {...register("customerType")}
                      className="accent-brand-700"
                    />
                    <span className="text-sm text-gray-700">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>
            {formValues.customerType === "personal" ? (
              <InputForm
                id="cashReceiptPhone"
                label="현금영수증 발급 휴대폰 번호"
                type="tel"
                error={errors.cashReceiptPhone?.message}
                {...register("cashReceiptPhone", {
                  onChange: (e) => {
                    const formatted = phoneNumberFormatter(e.target.value);
                    setValue("cashReceiptPhone", formatted);
                  },
                })}
                showReset={!!formValues.cashReceiptPhone}
                onReset={() => {
                  setValue("cashReceiptPhone", "");
                  clearErrors("cashReceiptPhone");
                }}
              />
            ) : (
              <InputForm
                id="businessNumber-cash"
                label="사업자등록번호"
                error={errors.businessNumber?.message}
                {...register("businessNumber")}
                showReset={!!formValues.businessNumber}
                onReset={() => {
                  setValue("businessNumber", "");
                  clearErrors("businessNumber");
                }}
              />
            )}
          </div>
        )}

        {formValues.receiptType === "tax" && (
          <div className="p-4 space-y-4 border border-gray-100 rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500">
              사업자 정보를 입력해 주세요.
            </p>
            <InputForm
              id="businessNumber"
              label="사업자등록번호"
              error={errors.businessNumber?.message}
              {...register("businessNumber")}
              showReset={!!formValues.businessNumber}
              onReset={() => {
                setValue("businessNumber", "");
                clearErrors("businessNumber");
              }}
            />
            <InputForm
              id="businessName"
              label="사업체명"
              error={errors.businessName?.message}
              {...register("businessName")}
              showReset={!!formValues.businessName}
              onReset={() => {
                setValue("businessName", "");
                clearErrors("businessName");
              }}
            />
            <InputForm
              id="ceoName"
              label="대표자명"
              error={errors.ceoName?.message}
              {...register("ceoName")}
              showReset={!!formValues.ceoName}
              onReset={() => {
                setValue("ceoName", "");
                clearErrors("ceoName");
              }}
            />
            <InputForm
              id="businessEmail"
              label="계산서 수신 이메일"
              type="email"
              error={errors.businessEmail?.message}
              {...register("businessEmail")}
              showReset={!!formValues.businessEmail}
              onReset={() => {
                setValue("businessEmail", "");
                clearErrors("businessEmail");
              }}
            />
            <InputForm
              id="businessType"
              label="업태"
              error={errors.businessType?.message}
              {...register("businessType")}
              showReset={!!formValues.businessType}
              onReset={() => {
                setValue("businessType", "");
                clearErrors("businessType");
              }}
            />
            <InputForm
              id="businessCategory"
              label="종목"
              error={errors.businessCategory?.message}
              {...register("businessCategory")}
              showReset={!!formValues.businessCategory}
              onReset={() => {
                setValue("businessCategory", "");
                clearErrors("businessCategory");
              }}
            />
            <InputForm
              id="businessAddress"
              label="사업장 주소"
              error={errors.businessAddress?.message}
              {...register("businessAddress")}
              showReset={!!formValues.businessAddress}
              onReset={() => {
                setValue("businessAddress", "");
                clearErrors("businessAddress");
              }}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-brand-700 hover:bg-[#2952e0] text-white rounded-xl font-bold text-base transition-all duration-200 cursor-pointer active:scale-[0.99] shadow-lg shadow-blue-100"
      >
        {amount.toLocaleString("ko-KR")}원 무통장 입금 신청하기
      </button>

      <p className="text-xs text-center text-gray-400">
        입금 확인 후 안내 메일을 발송해 드립니다.
      </p>
    </form>
  );
}
