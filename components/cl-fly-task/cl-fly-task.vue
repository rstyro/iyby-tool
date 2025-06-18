<template>
	<view class="task-popup" :class="{show}">
		<view class="task-content">
			<view class="task-title " :class="{woman:!isMan,man:isMan}">
				<text v-if="isMan">男生做任务</text>
				<text v-else>女生做任务</text>
			</view>
			<view class="task-text">{{ taskContent }}</view>
			<button class="complete-btn" :class="{ woman: !isMan, man: isMan, disabled: !isButtonEnabled }"
				:disabled="!isButtonEnabled" @click="closeTask">
				<text v-if="!isButtonEnabled">请等待{{ countdown }}秒</text>
				<text v-else>已完成</text>
			</button>
		</view>
	</view>
	</view>
	</view>

</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				required: true,
				default: false
			},
			isMan: {
				type: Boolean,
				required: true,
				default: false
			},
			taskContent: {
				type: String,
				required: true,
				default: '未知任务'
			}
		},
		data() {
			return {
				isButtonEnabled: false,
				countdown: 1,
				timer: null
			}
		},
		watch: {
			show(newVal) {
				if (newVal) {
					this.isButtonEnabled = false;
					this.countdown = 2;
					this.timer = setInterval(() => {
						if (this.countdown > 0) {
							this.countdown--;
						} else {
							clearInterval(this.timer);
							this.isButtonEnabled = true;
						}
					}, 1000);
				} else {
					if (this.timer) {
						clearInterval(this.timer);
						this.timer = null;
					}
				}
			}
		},
		methods: {
			closeTask() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 弹窗样式 */
	.task-popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 100;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s;
	}

	.task-popup.show {
		opacity: 1;
		pointer-events: all;
	}

	.task-content {
		background: white;
		border-radius: 25px;
		width: 85%;
		padding: 40rpx;
		text-align: center;
		position: relative;
		transform: translateY(30px);
		transition: transform 0.4s;
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
	}

	.task-popup.show .task-content {
		transform: translateY(0);
	}

	.task-title {
		font-size: 50rpx;
		margin-bottom: 20px;
		padding: 12px;
		border-radius: 15px;
		color: white;
		font-weight: bold;
		position: relative;
	}

	.man {
		background: linear-gradient(to right, #6a93cb, #a4bfef);
	}

	.woman {
		background: linear-gradient(to right, #ff9a9e, #fad0c4);
	}

	.task-text {
		font-size: 22px;
		margin: 30px 0;
		color: #ff6b9c;
		line-height: 1.5;
		min-height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff9fc;
		border-radius: 15px;
		padding: 20px;
		border: 2px dashed #ffd6e7;
	}

	.complete-btn {
		// background: linear-gradient(to right, #ff7eb3, #ff758c);
		color: white;
		border: none;
		padding: 15px 40px;
		font-size: 20px;
		border-radius: 30px;
		cursor: pointer;
		transition: all 0.3s;
		font-weight: bold;
		box-shadow: 0 8px 20px rgba(255, 117, 140, 0.4);
	}

	.complete-btn:hover {
		transform: translateY(-3px);
		box-shadow: 0 12px 25px rgba(255, 117, 140, 0.5);
	}

	.complete-btn.disabled {
		background: #ccc;
		color: #999;
		box-shadow: none;
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>