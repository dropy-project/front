const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_MONTH = 30 * ONE_DAY;

export const createDropTimeString = (dropLifeTime) => {
  if (dropLifeTime < ONE_MINUTE) {
    return `${Math.floor(dropLifeTime / ONE_SECOND)}s`;
  } else if (dropLifeTime < ONE_HOUR) {
    return `${Math.floor(dropLifeTime / ONE_MINUTE)}m`;
  } else if (dropLifeTime < ONE_DAY) {
    return `${Math.floor(dropLifeTime / ONE_HOUR)}h`;
  } else if (dropLifeTime < ONE_MONTH) {
    return `${Math.floor(dropLifeTime / ONE_DAY)}d`;
  } else {
    return `${Math.floor(dropLifeTime / ONE_MONTH)}y`;
  }
};

export const messageTimeString = (_date) => {
  if(_date == null) return '';
  const date = new Date(_date);

  const nowNormalized = new Date().setHours(0, 0, 0, 0);
  const dateNormalized = new Date(date).setHours(0, 0, 0, 0);
  const dayDiff = Math.floor((nowNormalized - dateNormalized) / ONE_DAY);

  if(dayDiff < 1) {
    const hours = formatTwoDigits(date.getHours());
    const minutes = formatTwoDigits(date.getMinutes());
    return `${hours}:${minutes}`;
  } else {
    return `${dayDiff}d`;
  }
};

export const chunckHeaderTimeString = (_date) => {
  if(_date == null) return '';
  const date = new Date(_date);

  const nowNormalized = new Date().setHours(0, 0, 0, 0);
  const dateNormalized = new Date(date).setHours(0, 0, 0, 0);
  const dayDiff = Math.floor((nowNormalized - dateNormalized) / ONE_DAY);
  const hours = formatTwoDigits(date.getHours());
  const minutes = formatTwoDigits(date.getMinutes());

  if (dayDiff < 1) {
    return `Today at ${hours}:${minutes}`;
  }
  if (dayDiff === 1) {
    return `Yesterday at ${hours}:${minutes}`;
  }
  return `${dayDiff} days ago at ${hours}:${minutes}`;
};

const formatTwoDigits = (n) => {
  return n < 10 ? `0${n}` : n;
};
