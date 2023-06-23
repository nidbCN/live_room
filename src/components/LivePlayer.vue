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
      return {
        url: this.streamUrl,
        type: this.mesPlayers[this.selectLiveType].typeStr,
        customType: {
          // HTTP-FLV flv.js
          flvJs: (video) => {
            if (this.mesPlayers.flvJs.player) {
              console.log(`[flvJs] destroy old player: ${video.src}`)
              const oldPlayer = this.mesPlayers.flvJs.player;

              oldPlayer.pause();
              oldPlayer.detachMediaElement();
              oldPlayer.unload();
              oldPlayer.destroy();
            }

            console.log(`[flvJs] try load video: ${this.streamUrl}`)
            this.mesPlayers.flvJs.player = flvjs.createPlayer({
              type: 'flv',
              isLive: true,
              url: this.streamUrl,
            });
            this.mesPlayers.flvJs.player.attachMediaElement(video);
            this.mesPlayers.flvJs.player.load();
          },
          // HLS hls.js
          hlsJs: (video) => {
            if (this.mesPlayers.hlsJs.player) {
              console.log(`[hlsJs] destroy old player: ${video.src}`)
              const oldPlayer = this.mesPlayers.hlsJs.player;
              oldPlayer.detachMedia()
              oldPlayer.destroy()
            }

            console.log(`[hlsJs] try load video: ${this.streamUrl}`)
            const hls = new Hls();
            hls.loadSource(this.streamUrl);
            hls.attachMedia(video);
          },
          // MPEG-DASH dash.js
          dashJs: (video) => {
            dashjs.MediaPlayer()
              .create().initialize(video, videoUrl, false);
          },
          // MPEG-DASH shaka-player
          dashShaka: (video) => {
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
