<!-- components/service-unavailable.vue -->
<template>
	<view class="service-unavailable">
		<!-- 图标区 -->
		<view class="status-icon">

			<view class="css-icon">
				<view class="gear">
					<view class="tooth"></view>
					<view class="tooth"></view>
					<view class="tooth"></view>
					<view class="center-circle"></view>
				</view>
			</view>
		</view>



		<!-- 文案区 -->
		<view class="text-container">
			<text class="title">功能维护中</text>
			<text class="tip">{{ selectedReason }}</text>
			<text class="tip">如有问题请联系客服支持</text>
		</view>

		<!-- 操作区 -->
		<button class="contact-btn" @click="handleContact" hover-class="btn-hover">
			联系客服
		</button>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 维护理由池
				maintenanceReasons: [
					'您好，该功能正在休眠中，正在为下次见面准备新面貌',
					'温馨提示：此功能暂别舞台，精彩内容请移步其他板块',
					'功能正在经历蜕变之旅，破茧成蝶指日可待'
				],
				// 当前显示的理由
				selectedReason: ''
			}
		},
		created() {
			this.selectedReason = this.getRandomReason()
		},
		methods: {
			// 获取随机理由
			getRandomReason() {
				const index = Math.floor(Math.random() * this.maintenanceReasons.length)
				return this.maintenanceReasons[index]
			},
			handleContact() {
				uni.showModal({
					title: '联系方式',
					content: '客服微信：shuai3-20 \n工作时间：9:00-18:00',
					confirmText: '复制号码',
					success: (res) => {
						if (res.confirm) {
							uni.setClipboardData({
								data: 'shuai3-20'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 重置默认样式 */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	page {
		height: 100%;
		width: 100%;
	}

	.service-unavailable {
		padding: 60rpx 40rpx;
		min-height: 100vh;
		background: #ffffff;
		display: flex;
		flex-direction: column;
		align-items: center;

		.status-icon {
			width: 320rpx;
			height: 320rpx;
			margin: 80rpx 0 60rpx;

			.icon-image {
				width: 100%;
				height: 100%;
			}
		}

		.text-container {
			text-align: center;
			margin-bottom: 80rpx;

			.title {
				display: block;
				font-size: 40rpx;
				color: #333;
				font-weight: 600;
				margin-bottom: 24rpx;
			}

			.tip {
				display: block;
				font-size: 28rpx;
				color: #666;
				line-height: 1.6;
			}
		}

		.contact-btn {
			width: 80%;
			height: 96rpx;
			line-height: 96rpx;
			border-radius: 48rpx;
			background: #07c160;
			color: #fff;
			font-size: 32rpx;
			margin: 0 auto;

			&::after {
				border: none;
			}

			&.btn-hover {
				opacity: 0.9;
				transform: scale(0.98);
			}
		}
	}


	.css-icon {
		width: 300rpx;
		height: 300rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.gear {
		width: 200rpx;
		height: 200rpx;
		border: 8rpx solid #1890ff;
		border-radius: 50%;
		position: relative;
		animation: rotate 6s linear infinite;
	}

	.tooth {
		position: absolute;
		width: 40rpx;
		height: 40rpx;
		background: #1890ff;
		top: -20rpx;
		left: 80rpx;
	}

	.tooth:nth-child(2) {
		transform: rotate(90deg);
	}

	.tooth:nth-child(3) {
		transform: rotate(180deg);
	}

	.center-circle {
		width: 60rpx;
		height: 60rpx;
		background: #fff;
		border-radius: 50%;
		position: absolute;
		top: 70rpx;
		left: 70rpx;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

</style>