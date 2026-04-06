export default function TruncateWords(text, wordLimit) {
  if (!text || typeof text !== "string") return "";
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
}
