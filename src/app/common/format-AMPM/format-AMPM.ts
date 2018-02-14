
export function formatAMPM(date) {
  if (!date || !(date instanceof Date)) {
    return null;
  }
  const ampm = date.getHours() >= 12 ? 'pm' : 'am';
  return `${getHoursIn12HourFormat(date)}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)} ${ampm}`;
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
