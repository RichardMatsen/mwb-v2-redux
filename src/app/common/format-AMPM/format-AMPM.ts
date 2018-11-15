
export function formatAMPM(dateTime): string | null {
  if (!dateTime) {
    return null;
  }
  if (!(dateTime instanceof Date)) {
    return dateTime;
  }
  const ampm = dateTime.getHours() >= 12 ? 'pm' : 'am';
  return `${getHoursIn12HourFormat(dateTime)}:${pad(dateTime.getMinutes(), 2)}:${pad(dateTime.getSeconds(), 2)} ${ampm}`;
}

function getHoursIn12HourFormat(date): number {
  let hours = date.getHours();
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return hours;
}

function pad(num, size) {
  return ('000000000' + num).substr(-size);
}
