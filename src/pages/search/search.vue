<template>
  <view class="search-index">
		<search-input :searchPage="searchPage"/>
		<search-default />
  </view>
</template>
<script>
import SearchInput from '@/components/SearchInput'
import SearchDefault from './SearchDefault'
export default {
	name: 'SearchIndex',
	data () {
		return {
			searchPage: ''
		}
	},
	onLoad (option) {
		this.searchPage = option.search
	},
  components: {
    SearchInput,
    SearchDefault
  }
}
</script>
<style lang="scss" scoped>
.search-index {
	height: 100vh;
	overflow-y: scroll;
}
</style>