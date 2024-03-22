declare module '@cyann/subler' {
  import { ChildProcess } from 'child_process';

  export type Session = {
    user: User;
    expire: number;
  };

  export type User = {
    email: string;
    password: string;
  };

  export type Settings = {
    email: string;
    password: string;
    transmissionURL: string;
    downloadFolder: string;
    convertFolder: string;
    languages: Array<string>;
    quicktime: boolean;
    maxBitrate: number;
    maxChannels: number;
  };

  export type Torrent = {
    id: number;
    name: string;
    size: number;
    status: string;
    speed: number;
    progress: number;
    files: Array<string>;
  };

  export type MediaDetails = {
    duration: number;
    streams: Array<MediaStream>;
  };

  export type MediaStream = {
    index: number;
    codec: string;
    type: string;
    lang?: string;
    name?: string;
    bitrate?: number;
    channels?: number;
    forced?: boolean;
  };

  export type Subtitle = {
    timestamp: string;
    content: Array<string>;
  };

  export type Task<T> = {
    id: number;
    status: string;
    progress: number;
    params: T;
    expire?: number;
    process?: ChildProcess;
  };

  export type ConvertionParams = {
    file: string;
    mapping: Array<number>;
  };

  export type ConvertionTask = Task<ConvertionParams>;

  export type TorrentStatistics = Array<{
    timestamp: number;
    progress: number;
  }>;

  export type Statistics = Record<string, TorrentStatistics>;
}
