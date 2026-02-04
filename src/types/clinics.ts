export type CompleteGradingPayload = {
  title?: string;
  deadline?: string;
  memo?: string;
};

export type CompleteGradingResponse = {
  count: number;
  message: string;
};
