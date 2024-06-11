const MEDIA_EXTENSIONS = ['.mkv', '.mp4', '.avi'];

/** @param {Array<string>} files  */
export function filterMediaFiles(files) {
  return files.filter((file) => {
    const index = file.lastIndexOf('.');
    const ext = index >= 0 ? file.substring(index) : null;
    return ext && MEDIA_EXTENSIONS.includes(ext);
  });
}

/**
 * @param {string} folder
 * @param {string} file
 */
export function getOutputFilename(folder, file) {
  let basename = file;

  // basename
  const basenameIndex = basename.lastIndexOf('/');
  if (basenameIndex >= 0) {
    basename = basename.substring(basenameIndex + 1);
  }

  // extension
  const extentionMatch = basename.match(/\.[a-z0-9]*$/i);
  if (extentionMatch && extentionMatch.index !== undefined) {
    basename = basename.substring(0, extentionMatch.index);
  }

  let name = basename;

  // year
  const yearMatches = basename.matchAll(/\d{4}/g);
  let year = undefined;

  for (let match of yearMatches) {
    const { index } = match;

    if (index !== undefined && basename[index + 4] !== 'p') {
      year = match[0];
      if (index < name.length) {
        name = basename.substring(0, index);
      }
      break;
    }
  }

  // episode
  const episodeMatch = basename.match(/S\d+E\d+|Part \d+/i);
  let episode = undefined;

  if (episodeMatch && episodeMatch.index !== undefined) {
    episode = episodeMatch[0].toUpperCase();
    if (episodeMatch.index < name.length) {
      name = basename.substring(0, episodeMatch.index);
    }
  }

  // misc
  if (name.endsWith('(')) {
    name = name.substring(0, name.length - 1);
  }

  name = name.replaceAll('.', ' ');
  name = name.trim();

  // putting the pieces together
  if (year) {
    name += ` (${year})`;
  }

  if (episode) {
    name += ` ${episode}`;
  }

  return `${folder}/${name}.mp4`;
}

/** @param {import("@cyann/subler").MediaStream} stream  */
export function getStreamDetails(stream) {
  let details = `${stream.type} (${stream.codec})`;

  if (stream.lang) {
    details += ` - ${stream.lang}`;
  }

  if (stream.type === 'audio') {
    const bitrate = stream.bitrate ? `${stream.bitrate} kB/s` : 'unknown bitrate';
    details += ` - ${bitrate}`;
  }

  return details;
}
