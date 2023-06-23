import FlvJs from "flv.js";
import flvjs from "flv.js";
import Hls from "hls.js";

interface MsePlayerInfo {
  player: any;
  typeStr: string;
  extension: string;
  title: string;

  render(video: HTMLVideoElement): void
}

interface MsePlayerCollection {
  flvJs: MsePlayerInfo;
  hlsJs: MsePlayerInfo;
  // dashJs: MsePlayerInfo;
  // dashShaka: MsePlayerInfo;
}

const msePlayers: MsePlayerCollection = {
  flvJs: {
    player: {} as FlvJs.Player,
    typeStr: "flvJs",
    extension: "flv",
    title: "HTTP-FLV(flv.js)",
    render(video: HTMLVideoElement) {
      const streamUrl = video.src;

      if (this.player) {
        console.log(`[videoEngine,flvJs] destroy old player: ${video.src}`)
        const oldPlayer = this.player;

        oldPlayer.pause();
        oldPlayer.detachMediaElement();
        oldPlayer.unload();
        oldPlayer.destroy();
      }

      console.log(`[videoEngine,flvJs] try load video: ${streamUrl}`)
      this.player = flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        url: streamUrl,
      });
      this.player.attachMediaElement(video);
      this.player.load();
    },
  },
  hlsJs: {
    player: null,
    typeStr: "hlsJs",
    extension: "m3u8",
    title: "HLS(hls.js)",
    render(video: HTMLVideoElement) {
      if (this.player) {
        console.log(`[videoEngine,hlsJs] destroy old player: ${video.src}`)
        const oldPlayer = this.player;
        oldPlayer.detachMedia()
        oldPlayer.destroy()
      }

      console.log(`[videoEngine,hlsJs] try load video: ${video.src}`)
      const hls = new Hls();
      hls.loadSource(video.src);
      hls.attachMedia(video);
      this.player = hls;
    },
  },
  // dashJs: {
  //   player: null,
  //   typeStr: "dashJs",
  //   extension: "mpd",
  //   title: "MPEG DASH(dash.js)",
  //   render(video: HTMLVideoElement) {
  //     if (this.player) {
  //       console.log(`[videoEngine,dashJs] destroy old player: ${video.src}`)
  //       const oldPlayer = this.player;
  //       oldPlayer.reset();
  //       oldPlayer.destroy();
  //     }
  //
  //     this.player = dashjs.MediaPlayer()
  //       .create()
  //     this.player.initialize(video, video.src, false);
  //     this.player.updateSettings({streaming: {delay: {liveDelay: 4}}});
  //   },
  // },
  // dashShaka: {
  //   player: null,
  //   typeStr: "dashShaka",
  //   extension: "mpd",
  //   title: "MPEG DASH(shaka)",
  //   render(video: HTMLVideoElement) {
  //     const playerShaka = new shaka.Player(video); // 将会修改 video.src
  //     playerShaka.load(video.src);
  //     this.player = playerShaka;
  //   },
  // },
}

export default function createVideo(config: (list: MsePlayerCollection) => MsePlayerInfo, srsAddress: string, streamName: string) {
  const playerInfo = config(msePlayers);
  const streamUrl = `//${srsAddress}:8080/live/${streamName}.${playerInfo.extension}`;
  console.log(streamUrl)

  const customTypeItem = {
    [playerInfo.typeStr]: playerInfo.render
  }

  const video = {
    url: streamUrl,
    type: playerInfo.typeStr,
    pic: "./PM5644.webp",
    customType: customTypeItem
  }

  return video
}
