export function JSTimeToReadable(millis: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const days = Math.floor(millis / (1000 * 60 * 60 * 24));
  const hour = Math.floor((millis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const min = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
  const sec = Math.floor((millis % (1000 * 60)) / 1000);
  return {
    days,
    hours: hour,
    minutes: min,
    seconds: sec,
  };
}

export function JSTimeToString(millis: number): string {
  const { days, hours, minutes, seconds } = JSTimeToReadable(millis);
  const res: string[] = [];
  if (days > 0) res.push(days + "d");
  if (hours > 0 || days > 0) res.push(`${hours}h`);
  if (minutes > 0 || hours > 0) res.push(`${minutes}m`);
  if (seconds > 0 || minutes > 0) res.push(`${seconds}s`);
  return res.join(" ");
}

export function JSTimeToStringRoughEstimate(millis: number): string {
  const { days, hours, minutes } = JSTimeToReadable(millis);
  const res: string[] = [];

  if (days > 0) res.push(days + "d");
  if (hours > 0 || days > 0) res.push(`${hours}h`);
  else if (minutes == 0 && hours == 0 && days == 0) res.push("<1m");
  else if (hours == 0 && days == 0) res.push(`<1h`);
  return res.join(" ");
}
