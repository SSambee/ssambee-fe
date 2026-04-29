export default function EmailSentModal() {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-[400px] text-center">
        <h2 className="text-lg font-bold text-neutral-900 mb-3">
          비밀번호 재설정 메일을 보냈어요
        </h2>
        <p className="text-sm text-neutral-400 leading-relaxed mb-6">
          <span>입력하신 이메일 주소로 인증번호(OTP)를 보냈어요.</span>
          <br />
          <span>메일함을 확인하고 비밀번호를 다시 설정해주세요.</span>
        </p>
        <a
          href="/reset-password"
          className="block w-full py-4 px-4 rounded-lg font-medium text-sm bg-blue-700 text-white hover:bg-blue-500 transition-colors duration-200 cursor-pointer text-center"
        >
          확인
        </a>
      </div>
    </div>
  );
}
