<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import 'uview-ui/index.scss';
	@import 'common/global.scss';
	/* 图标 */
	// 采用脚手架方式可以直接在index.html中直接引入icon,但是微信小程序不行
	// 这里引用
	@import 'static/font/icon.css';
	// @font-face {
	//   font-family: 'iconfont';  /* project id 1838613 */
	//   src: url('https://at.alicdn.com/t/font_1838613_7gh580l248g.eot');
	//   src: url('https://at.alicdn.com/t/font_1838613_7gh580l248g.eot?#iefix') format('embedded-opentype'),
	//   url('https://at.alicdn.com/t/font_1838613_7gh580l248g.woff2') format('woff2'),
	//   url('https://at.alicdn.com/t/font_1838613_7gh580l248g.woff') format('woff'),
	//   url('https://at.alicdn.com/t/font_1838613_7gh580l248g.ttf') format('truetype'),
	//   url('https://at.alicdn.com/t/font_1838613_7gh580l248g.svg#iconfont') format('svg');
	// }
	// .iconfont {
	// 	font-family: "iconfont" !important;
	// 	font-size: 36rpx;font-style:normal;
	// 	-webkit-font-smoothing: antialiased;
	// 	-webkit-text-stroke-width: 0.2px;
	// 	-moz-osx-font-smoothing: grayscale;
	// }
</style>
