<template>
  <div ref="playerContainer"></div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUpdated, ref} from "vue";
import createVideo from "@/utils/videoEngine";
import DPlayer, {DPlayerDanmaku} from "dplayer";
import {options} from "@/utils/request";

const props = defineProps<{
  streamName: string
}>();

const player = ref({} as DPlayer);
const srsAddress = ref(options.serverAddress);
const playerContainer = ref();

const videoItem = computed(() =>
  createVideo(liveType => liveType.flvJs,
    srsAddress.value,
    props.streamName)
);

onMounted(() => {
  player.value = new DPlayer({
    container: playerContainer.value as HTMLElement,
    live: true,
    autoplay: true,
    theme: "#F19EC2",
    video: videoItem.value
  });

  player.value?.play();
});

onUpdated(() => {
  player.value?.pause();
  player.value?.switchVideo(videoItem.value, {} as DPlayerDanmaku);
  player.value?.play();
});

</script>
