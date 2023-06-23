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

<script lang="ts">
import LivePlayer from "@/components/LivePlayer.vue";
import request from "@/utils/request";
import {decodeBase64} from "@/utils/base64";
import {defineComponent} from "vue";

export default defineComponent({
  name: "MainPage",
  components: {LivePlayer},
  data: () => ({
    streamChannels: [],
    selectedStreamName: "_test"
  }),
  computed: {
    selectedStreamNameReadable() {
      if (this.selectedStreamName.startsWith("_")) {
        return this.selectedStreamName;
      }

      return decodeBase64(this.selectedStreamName);
    }
  },
  mounted() {
    // select first
    this.fetchStreamList();
  },
  methods: {
    handleSelect(select: any) {
      console.log(select)

      this.selectedStreamName = select.id
    },
    fetchViewCount() {

    },
    async fetchStreamList() {
      const response = await request("/api/v1/streams/?count=50")
      const streamList = response.data['streams']
      this.streamChannels = streamList
        .filter(stream =>
          stream['video'] && !stream['name'].startsWith("_")
        )
        .map(stream => ({
          title: decodeBase64(stream['name']),
          streamName: stream['name']
        }))

      if (this.streamChannels.length > 0) {
        this.$refs.liveListBox.select(this.streamChannels[0].streamName, true)
      }

      console.log(`[fetchStreamList] fetch streams: ${this.streamChannels.length}`)
    }
  }
})
</script>

<style scoped>

</style>
