const MEDIA_TYPES = {
  PICTURE: 'PICTURE',
  VIDEO: 'VIDEO',
  MUSIC: 'MUSIC',
  TEXT: 'TEXT',
};

export const mediaIsFile = (mediaType) => {
  return mediaType === MEDIA_TYPES.PICTURE || mediaType === MEDIA_TYPES.VIDEO;
};

export default MEDIA_TYPES;
