<template>
	<!-- 动态星空背景 -->
	<view class="star-background">
		<!-- 使用 props 传入的 starCount 参数 -->
		<view class="star" v-for="(star, index) in stars" :key="index" :style="[star.style]"></view>
	</view>
	</view>
</template>

<script>
	export default {
		name: "star-background",
		props: {
			// 定义 starCount 属性，默认值为 50
			starCount: {
				type: Number,
				default: 50
			}
		},
		data() {
			return {
				stars: []
			}
		},
		created() {
			this.generateStars();
		},
		methods: {
			generateStars() {
				const stars = [];
				for (let i = 0; i < this.starCount; i++) {
					stars.push({
						style: {
							left: Math.random() * 100 + '%',
							top: Math.random() * 100 + '%',
							animationDelay: Math.random() * 2 + 's', // 延长随机范围
						}
					});
				}
				this.stars = stars;
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
	}

	.star-background {
		position: fixed;
		width: 100%;
		height: 100%;

		.star {
			position: absolute;
			width: 3rpx;
			height: 3rpx;
			background: rgba(255, 255, 255, 0.8);
			animation: twinkle 2s infinite;
		}
	}

	@keyframes twinkle {
		0% {
			opacity: 0.2;
		}

		50% {
			opacity: 1;
		}

		100% {
			opacity: 0.2;
		}
	}
</style>