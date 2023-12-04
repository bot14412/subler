import { mkdir, stat } from 'fs/promises';
import { execFile as nodeExecFile, spawn } from 'child_process';
import { createCache, createTaskQueue } from '$lib/helpers/factory';
import { getOutputFilename } from '$lib/helpers/ffmpeg';
import { getSettings } from './settings';
import { addSchedulerTask } from './scheduler';

const EXCLUDED_CODECS = ['mjpeg', 'png'];

const cache = createCache({
  load: loadMediaDetails,
  ttl: 300,
});

const queue = createTaskQueue({
  start: startConvertionTask,
  parallel: 2,
  ttl: 600,
});

addSchedulerTask(() => {
  cache.cleanup();
  queue.cleanup();
});

/**
 * @param {string} file
 * @param  {Array<string>} args
 * @returns {Promise<string>}
 */
async function execFile(file, args) {
  return new Promise((resolve, reject) => {
    nodeExecFile(file, args, (err, stdout) => {
      err ? reject(err) : resolve(stdout);
    });
  });
}

/**
 * @param {import('@cyann/subler').ConvertionTask} task
 * @param {string} error
 */
function cleanupConvertionTask(task, error) {
  if (error) {
    console.log(`Failed to complete task ${task.id}: ${error}`.trim());
    task.status = 'error';
  } else {
    console.log(`Finished task ${task.id}`);
    task.status = 'finished';
    task.progress = 100;
  }

  task.process = undefined;
}

/**
 * @param {string} file
 * @returns {Promise<import('@cyann/subler').MediaDetails>}
 */
async function loadMediaDetails(file) {
  const settings = await getSettings();
  const path = `${settings.downloadFolder}/${file}`;
  const args = ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', path];
  const content = await execFile('ffprobe', args);
  const json = JSON.parse(content);
  const duration = parseInt(json.format.duration);

  /** @type {Array<import('@cyann/subler').MediaStream>} */
  let streams = json.streams.map((/** @type {Record<string, any>} */ data) => {
    const { index, codec_name, codec_type, channels, disposition, tags = {} } = data;
    const { language, title } = tags;

    /** @type {import('@cyann/subler').MediaStream} */
    const stream = { index, codec: codec_name, type: codec_type };

    if (codec_type === 'audio' || codec_type === 'subtitle') {
      stream.lang = (language !== 'und' && language) || undefined;
      stream.name = title || undefined;
    }

    if (codec_type === 'audio') {
      const bitrate = data.bit_rate || tags.BPS || tags['BPS-eng'];
      stream.bitrate = bitrate ? Math.round(parseInt(bitrate) / 1024) : undefined;
      stream.channels = channels;
    }

    if (codec_type === 'subtitle') {
      stream.forced = !!disposition.forced;
    }

    return stream;
  });

  streams = streams.filter(({ type, codec }) => {
    return type !== 'video' || !EXCLUDED_CODECS.includes(codec);
  });

  streams.sort((a, b) => {
    const { type: atype, lang: alang = '' } = a;
    const { type: btype, lang: blang = '' } = b;
    const types = ['video', 'audio', 'subtitle'];
    const langs = ['eng', 'fre'];

    if (atype !== btype) {
      return types.indexOf(atype) - types.indexOf(btype);
    } else if (atype === 'audio') {
      return langs.indexOf(alang) - langs.indexOf(blang);
    } else if (atype === 'subtitle') {
      if (alang === blang) {
        const aforced = a.forced ? 1 : 0;
        const bforced = b.forced ? 1 : 0;
        return aforced - bforced;
      } else {
        return langs.indexOf(blang) - langs.indexOf(alang);
      }
    } else {
      return 0;
    }
  });

  return {
    duration,
    streams,
  };
}

/**
 * @param {import('@cyann/subler').ConvertionTask} task
 * @returns {Promise<void>}
 */
async function startConvertionTask(task) {
  return new Promise(async (resolve) => {
    const { downloadFolder, convertFolder, maxChannels, maxBitrate } = await getSettings();
    const { file, mapping } = task.params;
    const path = `${downloadFolder}/${file}`;
    const output = getOutputFilename(convertFolder, file);
    const { duration, streams } = await getMediaDetails(file);
    const selectedStreams = mapping.map((index) => streams[index]);
    const args = ['-y', '-v', 'error', '-stats', '-i', path];
    const sargs = ['-map_metadata', '-1', '-map_chapters', '-1', '-default_mode', 'infer'];

    console.log(`Starting task ${task.id}: ${path}`);

    for (let index in selectedStreams) {
      const stream = selectedStreams[index];

      args.push('-map', `0:${stream.index}`);

      if (stream.type === 'video') {
        sargs.push(`-c:${index}`, 'copy');
        sargs.push(`-map_metadata:s:${index}`, '-1');
      } else if (stream.type === 'audio' && stream.channels) {
        let { bitrate, channels } = stream;
        let bpc = maxBitrate;

        if (bitrate) {
          bpc = bitrate / channels;
        } else {
          console.log(`Warning: unknown bitrate: ${JSON.stringify(stream)}`);
        }

        if (stream.codec === 'aac' && channels <= maxChannels && bpc <= maxBitrate) {
          sargs.push(`-c:${index}`, 'copy');
        } else {
          bpc = Math.min(bpc, maxBitrate);
          channels = Math.min(channels, maxChannels);
          bitrate = Math.round(channels * bpc);

          sargs.push(`-c:${index}`, 'aac', `-b:${index}`, `${bitrate}k`, `-ac:${index}`, `${channels}`);

          if (bpc >= 64) {
            sargs.push(`-aac_coder:${index}`, 'fast');
          }
        }

        sargs.push(`-disposition:${index}`, '0');
        sargs.push(`-map_metadata:s:${index}`, '-1');

        if (stream.lang) {
          sargs.push(`-metadata:s:${index}`, `language=${stream.lang}`);
        }
      } else if (stream.type === 'subtitle') {
        const disposition = stream.forced ? 'forced' : '0';
        const codec = stream.codec === 'mov_text' ? 'srt' : 'copy';

        sargs.push(`-c:${index}`, codec);
        sargs.push(`-disposition:${index}`, disposition);
        sargs.push(`-map_metadata:s:${index}`, '-1');

        if (stream.lang) {
          sargs.push(`-metadata:s:${index}`, `language=${stream.lang}`);
        }
      }
    }

    await mkdir(convertFolder, { recursive: true });
    args.push(...sargs, output);
    task.process = spawn('ffmpeg', args);
    console.log(`Spawning task ${task.id}: ${task.process.spawnargs.join(' ')}`);

    let buffer = '';
    let stderr = '';

    task.process.stderr?.on('data', (data) => {
      buffer += data.toString();

      for (let index; (index = buffer.indexOf('\r')) >= 0; ) {
        const line = buffer.substring(0, index);
        const match = line.match(/time=-?([0-9]+):([0-9]+):([0-9]+)/);

        if (match) {
          const hours = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          const seconds = parseInt(match[3]);
          task.progress = Math.ceil(((hours * 3600 + minutes * 60 + seconds) * 100) / duration);
        }

        stderr = line;
        buffer = buffer.substring(index + 1);
      }
    });

    task.process.on('close', (code) => {
      const args = [output, '--add-track-statistics-tags'];

      if (code) {
        cleanupConvertionTask(task, buffer || stderr);
        resolve();
        return;
      }

      stderr = '';
      task.process = spawn('mkvpropedit', args);
      console.log(`Spawning task ${task.id}: ${task.process.spawnargs.join(' ')}`);

      task.process.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      task.process.on('close', () => {
        cleanupConvertionTask(task, stderr);
        resolve();
      });
    });
  });
}

/** @param {string} file */
export async function getMediaDetails(file) {
  return await cache.get(file);
}

/**
 * @param {string} file
 * @param {number} index
 */
export async function getSubtitlePreview(file, index) {
  const settings = await getSettings();
  const path = `${settings.downloadFolder}/${file}`;
  const args = ['-ss', '0', '-i', path, '-to', '300', '-map', `0:${index}`, '-f', 'srt', '-'];
  const content = await execFile('ffmpeg', args).catch(() => {});
  const subtitles = [];

  if (content) {
    const lines = content.split('\n');

    /** @type {import('@cyann/subler').Subtitle | undefined} */
    let current = undefined;

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];

      if (current && line === '') {
        subtitles.push(current);
        current = undefined;
      } else if (current && line) {
        current.content.push(line);
      } else if (!current && line.match(/^\d{2}:\d{2}:\d{2}/)) {
        current = { timestamp: line, content: [] };
      }
    }
  }

  return subtitles;
}

/** @param {string} file  */
export async function hasConvertionFile(file) {
  const settings = await getSettings();
  const output = getOutputFilename(settings.convertFolder, file);
  return !!(await stat(output).catch(() => {}));
}

/**
 * @param {string} file
 * @param {Array<number>} mapping
 */
export function addConvertionTask(file, mapping) {
  const task = queue.tasks.find(({ params }) => params.file === file);
  if (task) {
    queue.remove(task.id);
  }
  queue.add({ file, mapping });
}

/** @param {string} file */
export function getConvertionProgress(file) {
  const task = queue.tasks.find((task) => task.params.file === file);
  return task ? { status: task.status, progress: task.progress } : undefined;
}
