<template>
  <v-container :fluid="true">
    <v-col cols="12">
      <v-row>
        <v-col md="8" sm="12">
          <live-player :stream-name="selectedStreamName"/>
        </v-col>
        <v-col md="4" sm="12">
          <v-card class="my-8">
            <v-card-title>
              公告板
            </v-card-title>
            <v-card-text>
              <h3>欢迎来到 Gaein nidb 的直播间！</h3>
              <p>服务器在美国纽约，卡的话就卡一卡就好了罢。</p>
              <p>最近在播放 《瑞克和莫蒂》第一到第三季。无人值守但是随缘开播。当然本直播间也支持选择频道。</p>
            </v-card-text>
          </v-card>
          <v-card class="my-8">
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
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import LivePlayer from "@/components/LivePlayer.vue";
import request from "@/utils/request";
import {decode} from 'js-base64';

export default {
  name: "MainPage",
  components: {LivePlayer},
  data: () => ({
    streamChannels: [],
    selectedStream: {},
    selectedStreamName: "_test"
  }),
  mounted() {
    // select first
    // this.$refs.liveListBox.select(this.streamChannels[0].name, true)
    this.fetchStreamList();
  },
  methods: {
    handleSelect(select) {
      this.selectedStream = {
        name: select.id
      }

      this.selectedStreamName = select.id
    },
    fetchViewCount() {

    },
    async fetchStreamList() {
      const response = await request("/api/v1/streams/?count=50")
      const streamList = response.data['streams']
      this.streamChannels = streamList
        .filter(stream => stream['video'] && !stream['name'].startsWith("_"))
        .map(stream => ({
          title: decode(stream['name']),
          streamName: stream['name']
        }))

      console.log(`[fetchStreamList] fetch streams: ${this.streamChannels.length}`)
    }
  },
  computed: {
    streamName() {
      let channel = "_test"

      if (this.selectedStream.name) {
        channel = this.selectedStream.name
      } else if (this.streamChannels.length > 0) {
        // default value comes from first
        channel = this.streamChannels[0].name
      }

      console.log(`[streamName] select streamName: ${channel}`)

      return channel
    }
  }
}
</script>
