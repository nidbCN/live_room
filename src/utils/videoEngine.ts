import mpegts from "mpegts.js";
import Mpegts from "mpegts.js";
import FlvJs from "flv.js";
import flvjs from "flv.js";
import Hls from "hls.js";
import dashjs, {MediaPlayerClass} from "dashjs";

enum MesPlayerName {
  HttpFlvByMpegTsJs = "mpegTsJs",
  HttpFlvByFlvJs = "flvJs",
  HLSByHlsJs = "hlsJs",
  DASHByDashJs = "dashJs",
  DASHByShaka = "dashShaka"
}

interface IMsePlayerInfo {
  name: MesPlayerName;
  player: any;
  extension: string;
  title: string;

  // 创建播放器
  createPlayer(video: HTMLVideoElement): void

  // 加载直播流
  loadPlayer(video: HTMLVideoElement): void

  hasStream(): boolean

  // 卸载直播流
  unloadPlayer(): void
}

const _mesPlayerList: Array<IMsePlayerInfo> = [
  {
    name: MesPlayerName.HttpFlvByMpegTsJs,
    player: null as Mpegts.Player,
    extension: "flv",
    title: "HTTP-FLV(mpegts.js)",
    createPlayer(video: HTMLVideoElement) {
      const streamUrl = video.src;

      this.player = mpegts.createPlayer({
        type: 'flv',
        isLive: true,
        url: streamUrl,
      });
    },
    loadPlayer(video: HTMLVideoElement) {
      console.log(`[videoEngine,flvJs,unloadPlayer]detach and unload mpegts.js player.`)

      this.player.attachMediaElement(video);
      this.player.load();

      this.player.on(mpegts.Events.LOADING_COMPLETE, () => {
        this.player.play();
      });
    },
    unloadPlayer() {
      console.log(`[videoEngine,flvJs,unloadPlayer]detach and unload mpegts.js player.`)

      this.player.detachMediaElement();
      this.player.unload();
    }, hasStream() {
      return this.player.isPlaying();
    }
  },
  {
    name: MesPlayerName.HttpFlvByFlvJs,
    player: null as FlvJs.Player,
    extension: "flv",
    title: "HTTP-FLV(flv.js)",
    createPlayer(video: HTMLVideoElement) {
      const streamUrl = video.src;

      this.player = flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        url: streamUrl,
      });
    },
    loadPlayer(video: HTMLVideoElement) {
      console.log(`[videoEngine,flvJs,unloadPlayer]detach and unload flv.js player.`)

      this.player.attachMediaElement(video);
      this.player.load();
    },
    unloadPlayer() {
      console.log(`[videoEngine,flvJs,unloadPlayer]detach and unload flv.js player.`)

      this.player.detachMediaElement();
      this.player.unload();
    }, hasStream() {
      return this.player.isPlaying();
    }
  },
  {
    name: MesPlayerName.HLSByHlsJs,
    player: null as Hls,
    extension: "m3u8",
    title: "HLS(hls.js)",
    createPlayer(video: HTMLVideoElement): any {
      this.player = new Hls();
    },
    loadPlayer(video: HTMLVideoElement) {
      const streamLink = video.src

      this.player.loadSource(streamLink);
      this.player.attachMedia(video);
    },
    unloadPlayer() {
      console.log(`[videoEngine,hlsJs,unloadPlayer]nothing todo with hls.js player.`)
    },
    hasStream() {
      return this.player.isLevelLoaded(0);
    }
  },
  {
    name: MesPlayerName.DASHByDashJs,
    player: null as MediaPlayerClass,
    extension: "mpd",
    title: "MPEG DASH(dash.js)",
    createPlayer(video: HTMLVideoElement): any {
      this.player = dashjs.MediaPlayer()
        .create()
    },
    loadPlayer(video: HTMLVideoElement) {
      const streamLink = video.src

      this.player.initialize(video, streamLink, false);
      this.player.updateSettings({streaming: {delay: {liveDelay: 10}}});
    },
    unloadPlayer() {
      this.player.reset();
      console.log(`[videoEngine,hlsJs,unloadPlayer]nothing todo with hls.js player.`)
    },
    hasStream() {
      return true;
    }
  }
]

export function getPlayerInfo(playerName: MesPlayerName): IMsePlayerInfo | undefined {
  const playerInfo = _mesPlayerList.find(player => player.name == playerName);
  if (!playerInfo) {
    console.log(`[videoEngine,getPlayerInfo]can not find player named ${playerName}.`);
  }

  return playerInfo;
}

export default function createVideo(playerName: MesPlayerName, srsAddress: string, streamName: string) {
  const playerInfo = _mesPlayerList.find((player) => player.name == playerName);
  if (!playerInfo) {
    console.log(`[videoEngine,createVideo]can not find player${playerName}.`);
    return;
  }

  const streamUrl = `//${srsAddress}:8080/live/${streamName}.${playerInfo.extension}`;

  return {
    url: streamUrl,
    type: "streamPlayer",
    pic: "./PM5644.webp",
    customType: {
      streamPlayer: (video: HTMLVideoElement) => {
        if (!playerInfo.player) {
          playerInfo.createPlayer(video);
        } else if (playerInfo.hasStream()) {
          playerInfo.unloadPlayer();
        }

        playerInfo.loadPlayer(video);
      }
    }
  }
}
