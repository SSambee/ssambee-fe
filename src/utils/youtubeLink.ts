export const YOUTUBE_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s?]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;

export const getYoutubeVideoId = (url: string) => {
  if (!url) return "";
  const match = url.match(YOUTUBE_REGEX);
  return match ? match[1] : "";
};
