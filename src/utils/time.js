const ONE_DAY = 24 * 60 * 60 * 1000;

export const createDropTimeString = (dropLifeTime) => {
  if (dropLifeTime < 60000) {
    return `${Math.floor(dropLifeTime / 1000)}s`;
  } else if (dropLifeTime < 3600000) {
    return `${Math.floor(dropLifeTime / 60000)}m`;
  } else if (dropLifeTime < 86400000) {
    return `${Math.floor(dropLifeTime / 3600000)}h`;
  } else if (dropLifeTime < 31536000000) {
    return `${Math.floor(dropLifeTime / 86400000)}d`;
  } else {
    return `${Math.floor(dropLifeTime / 31536000000)}y`;
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
