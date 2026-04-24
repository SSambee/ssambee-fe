import { axiosClient } from "@/services/axiosClient";
import { KAKAO_MESSAGE_LIMITS, trimKakaoMessage } from "@/constants/kakao";

type KakaoMemoRequest = {
  title: string;
  description: string;
  imageUrl?: string;
  webUrl: string;
  buttonTitle?: string;
};

const normalizeKakaoPayload = (
  payload: KakaoMemoRequest
): KakaoMemoRequest => ({
  ...payload,
  title: trimKakaoMessage(payload.title, KAKAO_MESSAGE_LIMITS.TITLE),
  description: trimKakaoMessage(
    payload.description,
    KAKAO_MESSAGE_LIMITS.DESCRIPTION
  ),
  buttonTitle: payload.buttonTitle
    ? trimKakaoMessage(payload.buttonTitle, KAKAO_MESSAGE_LIMITS.TITLE)
    : undefined,
});

/** BE /api/kakao/memo — 카카오 나에게 보내기 */
export const sendKakaoMemo = async (
  payload: KakaoMemoRequest
): Promise<void> => {
  await axiosClient.post("/kakao/memo", normalizeKakaoPayload(payload));
};
