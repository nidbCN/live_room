<template>
  <div ref="playerContainer"></div>
</template>

<script>
import flvjs from 'flv.js';
import Hls from "hls.js";
import dashjs from "dashjs";
import shaka from "shaka-player";

import DPlayer from 'dplayer';

export default {
  name: 'LivePlayer',
  data: () => ({
    player: {},
    mesPlayers: {
      flvJs: {
        player: null,
        typeStr: "flvJs",
        extension: "flv",
        title: "HTTP-FLV(flv.js)"
      },
      hlsJs: {
        player: null,
        typeStr: "hlsJs",
        extension: "m3u8",
        title: "HLS(hls.js)"
      },
      dashJs: {
        player: null,
        typeStr: "dashJs",
        extension: "mpd",
        title: "MPEG DASH(dash.js)"
      },
      dashShaka: {
        player: null,
        typeStr: "dashShaka",
        extension: "mpd",
        title: "MPEG DASH(shaka)"
      },
    },
    srsAddress: "SRS_NOT_SET",
    selectLiveType: "flvJs"
  }),
  props: {
    streamName: {
      type: String,
      required: true
    }
  },
  computed: {
    streamUrl() {
      const extension = this.mesPlayers[this.selectLiveType].extension

      return `//${this.srsAddress}:8080/live/${this.streamName}.${extension}`;
    },
    video() {
      const videoType = this.mesPlayers.flvJs;

      console.log(`computed video url: ${this.streamUrl}`);

      return {
        url: this.streamUrl,
        type: videoType.typeStr,
        customType: {
          // HTTP-FLV flv.js
          flvJs: (video, player) => {
            console.log(`flv.js: url before distroy: ${video.src}`)

            const selfPlayer = this.mesPlayers["flvJs"].player
            console.log(flvjs.name)

            if (this.mesPlayers.flvJs.player) {
              console.log("flv.js: destroy old player")
              this.mesPlayers.flvJs.player.pause();
              this.mesPlayers.flvJs.player.detachMediaElement();
              this.mesPlayers.flvJs.player.unload();
              this.mesPlayers.flvJs.player.destroy();
            }

            console.log(`flv.js: try load video ${this.streamUrl}`)
            this.mesPlayers.flvJs.player = flvjs.createPlayer({
              type: 'flv',
              isLive: true,
              url: this.streamUrl,
            });
            this.mesPlayers.flvJs.player.attachMediaElement(video);
            this.mesPlayers.flvJs.player.load();
          },
          // HLS hls.js
          hlsJs: (video, player) => {
            const hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
          },
          // MPEG-DASH dash.js
          dashJs: (video, player) => {
            dashjs.MediaPlayer()
              .create().initialize(video, videoUrl, false);
          },
          // MPEG-DASH shaka-player
          dashShaka: (video, player) => {
            const playerShaka = new shaka.Player(video); // 将会修改 video.src
            playerShaka.load(videoUrl);
          },
        },
      }
    }
  },
  created() {
    this.srsAddress = process.env.VUE_APP_SRS_ADDRESS;
  },
  mounted() {
    this.player = new DPlayer({
      container: this.$refs.playerContainer,
      live: true,
      autoplay: true,
      theme: "#F19EC2",
      video: this.video
    })

    this.$nextTick(() => {
      this.player.play();
    })
  },
  updated() {
    this.player.pause();

    this.player.switchVideo(this.video);

    this.player.play();
  }
}
</script>
