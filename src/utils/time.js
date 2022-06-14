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
