<template>
  <v-container fluid>
    <v-col cols="12">
      <v-row>
        <v-col md="8" sm="12">
          <live-player :stream-name="liveChannel"/>
        </v-col>
        <v-col md="4" sm="12">
          <v-card class="my-8">
            <v-card-title>
              公告板
            </v-card-title>
            <v-card-text>
              欢迎来到 Gaein nidb 的直播间！
              <hr/>
              最近在播放 《瑞克和莫蒂》第一到第三季。无人值守但是随缘开播。P.S.服务器在美国纽约，卡的话就卡一卡就好了罢。
            </v-card-text>
          </v-card>
          <v-card class="my-8">
            <v-card-title>
              频道选择
            </v-card-title>
            <v-card-text>
              <v-list
                ref="liveListBox"
                :items="streamChannel"
                item-title="title"
                item-value="name"
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
import {Axios} from "axios";

export default {
  name: "MainPage",
  components: {LivePlayer},
  data: () => ({
    streamChannel: [{
      title: "瑞克和莫蒂",
      name: "rick_and_morty"
    }, {
      title: "中国出了个毛泽东",
      name: "5Lit5Zu95Ye65LqG5Liq5q+b5rO95LicCg"
    }],
    selectedStream: {}
  }),
  mounted() {
    this.$refs.liveListBox.select(this.streamChannel[0].name, true)
  },
  methods: {
    handleSelect(select) {
      this.selectedStream = {
        name: select.id
      }
    },
    fetchViewCount() {

    },
    fetchStreamList() {

    }
  },
  computed: {
    liveChannel() {
      let channel = ""

      if (this.selectedStream.name) {
        channel = this.selectedStream.name
      } else {
        channel = this.streamChannel[0].name
      }

      console.log(`Compute liveChannel: ${channel}`)

      return channel
    }
  }
}
</script>
