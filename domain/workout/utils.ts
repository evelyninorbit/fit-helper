export const formatDuration = (startedAt: string, finishedAt: string) => {
    const ms = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
    if (ms < 0) return "";
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours} 小時 ${minutes} 分鐘`;
    if (totalMinutes > 0) return `${minutes} 分鐘`;
    return "未滿 1 分鐘";
  };