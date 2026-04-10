const EFFECTIVE_DATE = "2026년 4월 10일";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 mt-10 text-xl font-bold text-gray-900">{children}</h2>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 leading-7 text-gray-700">{children}</p>;
}

function InfoTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mb-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border border-gray-200 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-800"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-gray-200 px-4 py-3 text-gray-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PrivacyContent() {
  return (
    <article className="prose-sm max-w-none">
      <Paragraph>
        ________(이하 &quot;쌤비&quot;)는 정보주체의 자유와 권리 보호를 위해
        「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게
        개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」
        제30조에 따라 정보주체에게 개인정보의 처리와 보호에 관한 절차 및 기준을
        안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기
        위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
      </Paragraph>

      <SectionTitle>
        1. 개인정보의 처리 목적, 수집 항목, 보유 및 이용기간
      </SectionTitle>
      <Paragraph>
        쌤비는 「개인정보 보호법」에 따라 서비스 제공을 위해 필요 최소한의
        범위에서 개인정보를 수집·이용합니다.
      </Paragraph>

      <p className="mb-2 font-semibold text-gray-800">
        가. 정보주체의 동의를 받지 않고 처리하는 개인정보
      </p>
      <InfoTable
        headers={["법적 근거", "처리 목적", "처리 항목", "보유기간"]}
        rows={[
          [
            "개인정보보호법 제15조제1항제4호 (계약 이행)",
            "이용자 식별 및 인증, 역할별 접근 권한 관리",
            "이름, 이메일 주소, 비밀번호(암호화), 역할(강사/조교/학생/학부모)",
            "회원 탈퇴 시까지",
          ],
          [
            "개인정보보호법 제15조제1항제4호 (계약 이행)",
            "강사 프로필 관리",
            "전화번호, 과목, 학원명",
            "회원 탈퇴 시까지",
          ],
          [
            "개인정보보호법 제15조제1항제4호 (계약 이행)",
            "유료 서비스 결제 및 환불 처리",
            "결제 수단 정보(카드사명, 승인번호, 입금자명, 입금 은행 등), 결제 일시, 결제 금액, 현금영수증 발급용 전화번호",
            "회원 탈퇴 시까지 (관련 법령 보존 의무 별도)",
          ],
          [
            "개인정보보호법 제15조제1항제4호 (계약 이행)",
            "세금계산서 발행",
            "사업자등록번호, 사업체명, 대표자명, 업태, 종목, 사업장 주소, 계산서 수신 이메일",
            "회원 탈퇴 시까지 (관련 법령 보존 의무 별도)",
          ],
        ]}
      />

      <p className="mb-2 font-semibold text-gray-800">
        나. 서비스 이용 과정에서 자동으로 수집되는 개인정보
      </p>
      <InfoTable
        headers={["구분", "처리 목적", "처리 항목"]}
        rows={[
          [
            "접속 정보",
            "서비스 안정성 확보 및 보안",
            "IP 주소, 브라우저 종류, 접속 일시, User Agent",
          ],
          [
            "이용 내역",
            "서비스 이용 통계 및 품질 개선",
            "페이지 방문 기록, 기능 사용 빈도 등 (익명화 처리)",
          ],
        ]}
      />

      <p className="mb-2 font-semibold text-gray-800">
        다. 관련 법령에 따른 개인정보 보존
      </p>
      <Paragraph>
        회원 탈퇴 후에도 다음 법령에 따라 일정 기간 개인정보를 보존합니다.
      </Paragraph>
      <InfoTable
        headers={["보존 항목", "보존 근거", "보존 기간"]}
        rows={[
          ["계약 또는 청약철회 등에 관한 기록", "전자상거래법 제6조", "5년"],
          [
            "대금결제 및 재화 등의 공급에 관한 기록",
            "전자상거래법 제6조",
            "5년",
          ],
          [
            "소비자의 불만 또는 분쟁처리에 관한 기록",
            "전자상거래법 제6조",
            "3년",
          ],
          [
            "웹사이트 방문 기록 (로그인 기록, 접속 로그)",
            "통신비밀보호법 제15조의2",
            "3개월",
          ],
        ]}
      />

      <SectionTitle>2. 개인정보의 제3자 제공</SectionTitle>
      <Paragraph>
        수집된 개인정보는 법령에 의한 경우를 제외하고 제3자에게 제공하지
        않습니다.
      </Paragraph>

      <SectionTitle>3. 개인정보 처리업무의 위탁</SectionTitle>
      <Paragraph>
        쌤비는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를
        위탁하고 있습니다.
      </Paragraph>
      <InfoTable
        headers={["위탁받는 자 (수탁자)", "위탁 업무"]}
        rows={[
          ["Vercel Inc.", "웹 애플리케이션 호스팅"],
          [
            "Amazon Web Services",
            "데이터베이스 및 서버 운영, 파일 저장(S3) 및 콘텐츠 배포(CloudFront)",
          ],
          ["토스페이먼츠(TossPayments)", "결제 처리 및 정산"],
          ["Sentry", "오류 모니터링 및 서비스 안정성 확보"],
          ["카카오(Kakao)", "카카오톡 메시지 발송 (성적표 등)"],
          ["SMTP 이메일 서비스", "이메일 발송 (인증, 결제 안내 등)"],
        ]}
      />
      <Paragraph>
        위탁업무의 내용이나 수탁자가 변경될 경우에는 지체 없이 본 개인정보
        처리방침을 통하여 공개하겠습니다.
      </Paragraph>

      <SectionTitle>4. 개인정보의 국외 이전</SectionTitle>
      <Paragraph>
        쌤비는 서비스 제공을 위해 수집한 개인정보를 아래와 같이 국외에 이전하고
        있으며, 「개인정보 보호법」 제28조의8제2항에 따라 안내합니다.
      </Paragraph>
      <InfoTable
        headers={[
          "이전받는 자",
          "이전 국가",
          "이용 목적",
          "이전 항목",
          "보유기간",
        ]}
        rows={[
          [
            "Vercel Inc.",
            "미국",
            "웹 호스팅",
            "접속 로그, 쿠키",
            "서비스 이용 기간",
          ],
          [
            "Amazon Web Services",
            "미국 등",
            "데이터베이스 운영, 파일 저장 및 배포",
            "이메일, 이름, 서비스 데이터, 업로드 파일",
            "회원 탈퇴 시까지",
          ],
          [
            "Sentry",
            "미국",
            "오류 모니터링",
            "IP 주소, 브라우저 정보, 에러 로그",
            "90일",
          ],
        ]}
      />
      <Paragraph>
        국외 이전을 원치 않을 경우 회원 탈퇴를 진행하거나 관리자 이메일로 요청할
        수 있습니다.
      </Paragraph>

      <SectionTitle>5. 개인정보의 파기 절차 및 방법</SectionTitle>
      <Paragraph>
        쌤비는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게
        되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
      </Paragraph>
      <ul className="mb-4 list-disc space-y-1 pl-6 text-gray-700">
        <li className="leading-7">
          파기절차: 파기 사유가 발생한 개인정보를 선정하고, 개인정보
          보호책임자의 확인을 거쳐 파기합니다.
        </li>
        <li className="leading-7">
          파기방법: 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수
          없도록 파기합니다.
        </li>
        <li className="leading-7">
          계정 삭제 시 수업, 학생, 성적 등 관련 데이터는 즉시 삭제됩니다.
        </li>
      </ul>
      <Paragraph>
        다만, 관련 법령에 따른 보존 대상 정보는 해당 기간 동안 별도 분리하여
        보관한 후 기간 경과 시 지체 없이 파기합니다. 탈퇴 후 보존되는 개인정보는
        보존 목적 외의 용도로 이용하지 않습니다.
      </Paragraph>

      <SectionTitle>
        6. 개인정보 자동 수집 장치의 설치·운영 및 거부
      </SectionTitle>
      <Paragraph>
        서비스는 다음과 같은 쿠키 및 클라이언트 저장소를 사용합니다.
      </Paragraph>
      <ul className="mb-4 list-disc space-y-1 pl-6 text-gray-700">
        <li className="leading-7">인증 목적의 세션 쿠키</li>
        <li className="leading-7">UI 상태 저장을 위한 쿠키 및 localStorage</li>
        <li className="leading-7">
          서비스 이용 통계 및 품질 개선을 위한 분석 도구: Google Analytics,
          Microsoft Clarity, Vercel Analytics, Vercel Speed Insights
        </li>
        <li className="leading-7">
          오류 모니터링을 위한 Sentry (세션 리플레이 포함). 오류 발생 시 IP
          주소, 브라우저 정보 등 사용자 식별 정보가 함께 전송될 수 있습니다.
        </li>
      </ul>
      <Paragraph>
        이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우
        서비스 이용이 제한될 수 있습니다.
      </Paragraph>

      <SectionTitle>
        7. 정보주체와 법정대리인의 권리·의무 및 행사방법
      </SectionTitle>
      <Paragraph>
        정보주체는 쌤비에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구
        등의 권리를 행사할 수 있습니다.
      </Paragraph>
      <ul className="mb-4 list-disc space-y-1 pl-6 text-gray-700">
        <li className="leading-7">
          서비스 내 행사: 계정 설정 페이지에서 개인정보 조회·수정·삭제(계정
          삭제) 가능
        </li>
        <li className="leading-7">
          이메일 행사: 관리자 이메일로 열람 등 요구 가능
        </li>
      </ul>
      <Paragraph>
        권리 행사는 「개인정보 보호법 시행령」 제41조제1항에 따라 서면, 전자우편
        등을 통하여 하실 수 있으며, 쌤비는 이에 대해 지체 없이 조치하겠습니다.
      </Paragraph>

      <SectionTitle>8. 개인정보의 안전성 확보조치</SectionTitle>
      <Paragraph>
        쌤비는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
      </Paragraph>
      <ul className="mb-4 list-disc space-y-1 pl-6 text-gray-700">
        <li className="leading-7">
          기술적 조치: 모든 통신 HTTPS(TLS) 암호화, 세션 쿠키 기반 인증 관리,
          접근통제시스템 운영
        </li>
        <li className="leading-7">
          관리적 조치: 최소한의 접근 권한 부여(역할 기반 접근 제어), 개인정보
          접근 권한 제한
        </li>
      </ul>

      <SectionTitle>9. 개인정보 보호책임자 및 고충처리</SectionTitle>
      <Paragraph>
        쌤비는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와
        관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보
        보호책임자를 지정하고 있습니다.
      </Paragraph>
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm leading-7 text-gray-600">
        <p className="mb-2 font-semibold text-gray-800">개인정보 보호책임자</p>
        <p>성명: ________</p>
        <p>직책: ________</p>
        <p>상호명: ________</p>
        <p>사업장소재지: ________</p>
        <p>사업자등록번호: ________</p>
        <p>통신판매업 신고번호: ________</p>
        <p>연락처: ________</p>
      </div>
      <Paragraph>
        정보주체는 개인정보침해로 인한 구제를 받기 위하여 아래 기관에
        분쟁해결이나 상담 등을 신청할 수 있습니다.
      </Paragraph>
      <ul className="mb-4 list-disc space-y-1 pl-6 text-gray-700">
        <li className="leading-7">
          개인정보 분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)
        </li>
        <li className="leading-7">
          개인정보침해 신고센터: (국번없이) 118 (privacy.kisa.or.kr)
        </li>
        <li className="leading-7">대검찰청: (국번없이) 1301 (www.spo.go.kr)</li>
        <li className="leading-7">
          경찰청: (국번없이) 182 (ecrm.police.go.kr)
        </li>
      </ul>

      <SectionTitle>10. 개인정보 처리방침의 변경</SectionTitle>
      <Paragraph>
        본 방침의 변경 사항은 시행일 최소 7일 전에 서비스 내에서 공지합니다.
      </Paragraph>

      <p className="mt-10 text-sm text-gray-500">시행일: {EFFECTIVE_DATE}</p>
    </article>
  );
}
