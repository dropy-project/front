const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 365 * ONE_DAY;

export const createDropTimeString = (dropLifeTime) => {
  if (dropLifeTime < ONE_MINUTE)
    return `${Math.floor(dropLifeTime / ONE_SECOND)}s`;
  if (dropLifeTime < ONE_HOUR)
    return `${Math.floor(dropLifeTime / ONE_MINUTE)}m`;
  if (dropLifeTime <= ONE_DAY)
    return `${Math.floor(dropLifeTime / ONE_HOUR)}h`;
  if (dropLifeTime <= ONE_YEAR)
    return `${Math.floor(dropLifeTime / ONE_DAY)}j`;

  return `${Math.floor(dropLifeTime / ONE_YEAR)}a`;
};

export const messageTimeString = (_date) => {
  if (_date == null)
    return '';
  const date = new Date(_date);

  const nowNormalized = new Date().setHours(0, 0, 0, 0);
  const dateNormalized = new Date(date).setHours(0, 0, 0, 0);
  const dayDiff = Math.floor((nowNormalized - dateNormalized) / ONE_DAY);

  if (dayDiff < 1) {
    const hours = formatTwoDigits(date.getHours());
    const minutes = formatTwoDigits(date.getMinutes());
    return `${hours}:${minutes}`;
  }
  return `${dayDiff}d`;
};

export const chunckHeaderTimeString = (_date) => {
  if (_date == null)
    return '';
  const date = new Date(_date);

  const nowNormalized = new Date().setHours(0, 0, 0, 0);
  const dateNormalized = new Date(date).setHours(0, 0, 0, 0);
  const dayDiff = Math.floor((nowNormalized - dateNormalized) / ONE_DAY);
  const hours = formatTwoDigits(date.getHours());
  const minutes = formatTwoDigits(date.getMinutes());

  if (dayDiff < 1)
    return `Aujourd'hui à ${hours}:${minutes}`;

  if (dayDiff === 1)
    return `Hier à ${hours}:${minutes}`;

  return `Il y a ${dayDiff}j à ${hours}:${minutes}`;
};

export const sinceDayMonth = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diff = now - then;
  const diffDays = Math.floor(diff / ONE_DAY);
  const diffMonths = Math.floor(diff / ONE_MONTH);
  const diffYears = Math.floor(diff / ONE_YEAR);
  if (diffDays < 1)
    return 'aujourd\'hui';

  if (diffDays < 7)
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;

  if (diffDays < 31)
    return `${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;

  if (diffMonths < 12)
    return `${diffMonths} mois`;

  return `${diffYears} année${diffYears > 1 ? 's' : ''}`;
};

const formatTwoDigits = (n) => n < 10 ? `0${n}` : n;
