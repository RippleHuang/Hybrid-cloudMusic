<template>
  <view class="manage-list">
    <page-nav
      :title="'编辑歌单信息'"
      :background="'#dd001b'"
      defaultShow
			compile
			@compiled="goback"
    />
    <u-field
      v-model="name"
      maxlength="40"
      label="名称"
      clearable
    />
    <u-field
      v-model="message"
      autosize
      label="描述"
      type="textarea"
      placeholder="暂无描述"
      maxlength="1000"
      clearable
    />
  </view>
</template>
<script>
import PageNav from '@/components/PageNav'
import { playlistUpdata } from '@/api/apis'
export default {
  name: 'CompileSongList',
  onLoad (option) {
    this.albumId = option.id
    this.name = option.title
    this.title = option.title
    this.message = option.description
    this.description = option.description
  },
  data () {
    return {
      albumId: 0,
      name: '',
      title: '',
      description: '',
      message: ''
    }
  },
  methods: {
		toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    listUpdata () {
      playlistUpdata(this.albumId, this.name, this.message)
        .then(data => {
          this.$store.commit('REFRESH') // 刷新
          this.toast('修改成功')
        })
		},
		goback () {
			if (this.name === '') {
				this.toast('名称不能为空')
			} else if (this.name === this.title && this.message === this.description) {
				uni.navigateBack({
          delta: 1,
          animationType: 'pop-out',
          animationDuration: 200
        })
			} else {
				this.listUpdata()
				uni.navigateBack({
          delta: 1,
          animationType: 'pop-out',
          animationDuration: 200
        })
			}
		}
  },
  components: {
    PageNav
  }
}
</script>
<style lang='scss' scoped>
.manage-list {
  padding-top: $height;
}
</style>