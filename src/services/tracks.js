
export const validateTrack = (track) => String(track.url).slice(0, 4) === 'http' && track.title && track.artist
