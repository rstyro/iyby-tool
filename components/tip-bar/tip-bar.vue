<template>
	<view class="tip-bar">
		<text>{{ tipText }}</text>
	</view>
</template>

<script>
	export default {
		name: "TipBar",
		props: {
			tipText: {
				type: String,
				default: "仅供文化娱乐，探索传统魅力，请勿当真。",
			},
		},
	};
</script>

<style scoped>
	.tip-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;

		padding: 10px;
		text-align: center;
		font-size: 14px;
		color: #666;
		z-index: 999;
		background-color: #f0f0f0;
		color: #d2691e;
		border-bottom: 1px solid #f5deb3;
	}
</style>