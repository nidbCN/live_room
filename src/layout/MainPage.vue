<template>
  <v-container :fluid="true">
    <v-col cols="12">
      <v-row>
        <v-col md="8" sm="12">
          <v-container>
            <v-card>
              <v-card-title>正在播放：{{ selectedStreamNameReadable }}
              </v-card-title>
              <v-card-text>
                <v-responsive :aspect-ratio="16 / 9">
                  <live-player fill-height :stream-name="selectedStreamName"/>
                </v-responsive>
              </v-card-text>
              <v-card-actions>
                <span>Viewer: {{ streamClients.length }}</span>
                <v-select
                  label="Select"
                  :items="Object.keys(MesPlayersList)"
                ></v-select>
              </v-card-actions>
            </v-card>
          </v-container>
        </v-col>
        <v-col md="4" sm="12">
          <v-container>
            <v-card>
              <v-card-title>
                公告板
              </v-card-title>
              <v-card-text>
                <h3>欢迎来到 Gaein nidb 的直播间！</h3>
                <p>服务器在美国纽约，卡的话就卡一卡就好了罢。</p>
                <p>最近在播放 《瑞克和莫蒂》第一到第三季。无人值守但是随缘开播。当然本直播间也支持选择频道。</p>
              </v-card-text>
            </v-card>
          </v-container>
          <v-container>
            <v-card>
              <v-card-title>
                频道选择
              </v-card-title>
              <v-card-text>
                <v-list
                  ref="liveListBox"
                  :items="streamChannels"
                  item-title="title"
                  item-value="streamName"
                  @click:select="handleSelect"
                />
              </v-card-text>
            </v-card>
          </v-container>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import request from "@/utils/request";
import {decodeBase64} from "@/utils/base64";
import LivePlayer from "@/components/LivePlayer.vue";
import {MesPlayersList} from "@/utils/videoEngine";

const streamChannels = ref([])
const streamClients = ref([])
const selectedStreamName = ref("_test")
const liveListBox = ref()
const selectedStreamNameReadable = computed(() => {
  if (selectedStreamName.value.startsWith("_")) {
    return selectedStreamName.value;
  }

  return decodeBase64(selectedStreamName.value);
})

onMounted(async () => {
  streamChannels.value = await fetchStreamList()
  streamClients.value = await fetchClientList()

  const channelCount = streamChannels.value.length
  if (channelCount > 0) {
    liveListBox.value.select(streamChannels.value[0].streamName, true)
  }

  console.log(`[onMounted] init with streams: ${channelCount}`)
})

function handleSelect(select: any) {
  console.log(typeof select)

  selectedStreamName.value = select.id
}

async function fetchClientList() {
  const response = await request("/api/v1/clients/?count=100")
  return response.data.clients ?? []
}

async function fetchStreamList() {
  const response = await request("/api/v1/streams/?count=50")
  const streamList = response.data['streams']
  return streamList
    .filter((stream: any) =>
      stream['video'] && !stream['name'].startsWith("_")
    )
    .map((stream: any) => ({
      title: decodeBase64(stream['name']),
      streamName: stream['name']
    }))
}
</script>
