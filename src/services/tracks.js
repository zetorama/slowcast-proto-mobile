
export const validateTrack = (track) => String(track.url).match(/^https:\/\//i) && track.title && track.artist
