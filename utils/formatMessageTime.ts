function formatMessageTime(timeString?: string): string {
  if (!timeString) return "";

  const date = new Date(timeString);

  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
}
export default formatMessageTime;
