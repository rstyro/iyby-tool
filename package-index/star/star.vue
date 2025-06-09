<template>
	<view class="container">

		<!-- 动态星空背景 -->
		<cl-star-background></cl-star-background>

		<!-- 页面标题 -->
		<view class="header">
			<view class="logo">
				<text class="logo-icon">✨</text>
				<text class="title">星座探秘</text>
			</view>
			<text class="subtitle">探索十二星座的奥秘，了解你的星座特性</text>
		</view>

		<!-- 搜索框 -->
		<view class="search-container">
			<input v-model="searchQuery" class="search-box" placeholder="搜索星座..." placeholder-style="color:#b39ddb" />
		</view>

		<!-- 星座列表/详情切换 -->
		<scroll-view v-if="!selectedZodiac" scroll-y style="height: 100%">
			<view class="zodiac-grid">
				<view v-for="zodiac in filteredZodiacs" :key="zodiac.id" class="zodiac-card"
					:class="[zodiac.name.replace('座','').toLowerCase()]" @click="showDetail(zodiac)">
					<view class="card-header">
						<view class="zodiac-icon">
							<text>{{ zodiac.icon }}</text>
						</view>
						<view>
							<text class="zodiac-name">{{ zodiac.name }}</text>
							<text class="zodiac-dates">{{ zodiac.dates }}</text>
						</view>
					</view>
					<view class="card-content">
						<text class="zodiac-element">{{ zodiac.element }}星座</text>
						<view class="zodiac-traits">
							<text v-for="trait in zodiac.traits" :key="trait" class="trait">{{ trait }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 星座详情页 -->
		<view v-else class="detail-container">
			<view class="detail-header">
				<view class="detail-icon">
					<text>{{ selectedZodiac.icon }}</text>
				</view>
				<view class="detail-info">
					<text class="detail-title">{{ selectedZodiac.name }}</text>
					<text class="detail-dates">
						{{ selectedZodiac.dates }} | {{ selectedZodiac.element }}星座
					</text>
				</view>
				<button class="back-button" @click="hideDetail">
					<cl-icon type="icon-zuo" size="16" color="e0aaff" /> 返回列表
				</button>
			</view>

			<scroll-view scroll-y class="detail-content">
				<view class="detail-section">
					<view class="section-title"><cl-icon class="icon" type="icon-touxiang" color="#c77dff" /> 性格特点
					</view>
					<view class="section-text">{{ selectedZodiac.personality }}</view>
				</view>

				<view class="detail-section">
					<text class="section-title"><cl-icon class="icon" type="icon-peidui" color="#c77dff" />最佳配对</text>
					<text class="section-text">
						{{ selectedZodiac.name }}的最佳配对星座是：{{ selectedZodiac.compatibility }}
					</text>
				</view>

				<view class="detail-section">
					<text class="section-title"><cl-icon class="icon" type="icon-chenggong" color="#c77dff" />优点</text>
					<text class="section-text">{{ selectedZodiac.strengths }}</text>
				</view>

				<view class="detail-section">
					<text class="section-title"><cl-icon class="icon" type="icon-info" color="#c77dff" />缺点</text>
					<text class="section-text">{{ selectedZodiac.weaknesses }}</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import zodiacData from '@/data/starData.js';
	export default {
		data() {
			return {
				zodiacData,
				searchQuery: '',
				selectedZodiac: null,
			}
		},
		computed: {
			filteredZodiacs() {
				if (!this.searchQuery) return this.zodiacData

				const query = this.searchQuery.toLowerCase()
				return this.zodiacData.filter(zodiac =>
					zodiac.name.toLowerCase().includes(query) ||
					zodiac.dates.toLowerCase().includes(query) ||
					zodiac.traits.some(trait => trait.toLowerCase().includes(query))
				)
			}
		},
		methods: {
			showDetail(zodiac) {
				this.selectedZodiac = zodiac
				uni.pageScrollTo({
					scrollTop: 0
				})
			},
			hideDetail() {
				this.selectedZodiac = null
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: linear-gradient(135deg, #2c1a4a, #3d296d, #5c3ca0);
		color: #f7f3ff;
		padding: 20rpx;
		min-height: 100vh;
	}

	.header {
		text-align: center;
		padding: 60rpx 0 30rpx;
	}

	.logo {
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-bottom: 15px;

		.logo-icon {
			font-size: 72rpx;
			color: #b18bff;
			margin-right: 30rpx;
			text-shadow: 0 0 15px rgba(177, 139, 255, 0.6);
		}

		.title {
			font-size: 48rpx;
			background: linear-gradient(to right, #c77dff, #d9b2ff);
			-webkit-background-clip: text;
			color: transparent;
			font-weight: bold;
			text-shadow: 0 0 25rpx rgba(199, 125, 255, 0.4);
		}
	}

	.subtitle {
		font-size: 26rpx;
		color: #e5d7ff;
		margin-top: 20rpx;
		text-align: center;
	}

	.search-container {
		margin: 40rpx 0;

		.search-box {
			width: 86%;
			padding: 25rpx 40rpx;
			border-radius: 50px;
			background: rgba(255, 255, 255, 0.15);
			color: white;
			font-size: 28rpx;
			border: 1px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		}
	}

	.zodiac-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 30rpx;
		margin-top: 10px;
	}

	.zodiac-card {
		flex: 1 0 45%;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border-radius: 20rpx;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
		animation: float 3s ease-in-out infinite;
		transition: all 0.4s ease;

		@keyframes float {
			0% {
				transform: translateY(0);
			}

			50% {
				transform: translateY(-5px);
			}

			100% {
				transform: translateY(0);
			}
		}
	}

	.card-header {
		padding: 30rpx 10rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;

		.zodiac-icon {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 10rpx;
			background: linear-gradient(135deg, #8e6cd3, #b18bff);
			font-size: 46rpx;
			box-shadow: 0 5px 15px rgba(142, 108, 211, 0.4);
		}

		.zodiac-name {
			font-size: 40rpx;
			color: #f0e6ff;
			font-weight: 600;
			display: block;
			// text-shadow: 0 0 5px rgba(240, 230, 255, 0.5);
		}

		.zodiac-dates {
			font-size: 24rpx;
			color: #d8c8ff;
		}
	}

	.card-content {
		padding: 0 20px 25px;

		.zodiac-element {
			color: #d9b2ff;
			font-size: 26rpx;
			display: block;
			margin-top: 10rpx;
		}

		.zodiac-traits {
			display: flex;
			flex-wrap: wrap;
			gap: 8rpx;
			margin-top: 30rpx;
		}

		.trait {
			background: rgba(177, 139, 255, 0.25);
			padding: 5rpx 12rpx;
			border-radius: 20px;
			font-size: 0.85rem;
			color: #f7f3ff;
		}
	}

	.detail-container {
		background: rgba(255, 255, 255, 0.18);
		backdrop-filter: blur(15px);
		border-radius: 25rpx;
		padding: 40rpx;
		margin-top: 40rpx;
		box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
		border: 1px solid rgba(255, 255, 255, 0.25);
		animation: fadeIn 0.6s ease;

		.detail-header {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			margin-bottom: 40rpx;
		}

		.detail-icon {
			width: 80px;
			height: 80px;
			background: linear-gradient(135deg, #8e6cd3, #b18bff);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 36px;
			box-shadow: 0 8px 20px rgba(142, 108, 211, 0.5);
		}

		.detail-title {
			font-size: 60rpx;
			display: flex;
			color: #f0e6ff;
			align-items: center;
			justify-content: center;
			margin-bottom: 5px;
		}

		.detail-dates {
			font-size: 30rpx;
			color: #d8c8ff;
		}

		.back-button {
			background: rgba(177, 139, 255, 0.3);
			border: none;
			color: #f7f3ff;
			padding: 10px 20px;
			border-radius: 50px;
			font-size: 28rpx;
			cursor: pointer;
			display: flex;
			align-items: center;
			transition: all 0.3s ease;
			margin: 20rpx auto;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

			&:active {
				transform: scale(0.98);
			}
		}

		.detail-content {

			.detail-section {
				background: rgba(255, 255, 255, 0.12);
				border-radius: 20px;
				padding: 25rpx;
				box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
				margin-bottom: 40rpx;
				border: 1px solid rgba(255, 255, 255, 0.15);
			}

			.section-title {
				font-size: 32rpx;
				color: #d9b2ff;
				margin-bottom: 40rpx;
				display: flex;
				align-items: center;
				margin-top: 30rpx;

				.icon {
					margin-right: 10rpx;
				}
			}

			.section-text {
				line-height: 1.8;
				color: #f0e6ff;
				font-size: 28rpx;
			}
		}
	}

	/* 动画效果 */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>