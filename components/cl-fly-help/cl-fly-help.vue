<template>
	<view>
		<!-- 游戏玩法弹窗 -->
		<view class="modal" :class="{show}">
			
			<view class="modal-content">
				<view class="close-btn" @click="closeHelp">
					<cl-icon type="icon-guanbi" size="36" color="#aaa" />
				</view>
				<view class="modal-title">游戏玩法介绍</view>
				
				<view class="rules-container">
					<view class="rule-item">
						<cl-icon class="icon" type="icon-touzi" size="25" color="#ff7eb3" />
						<text class="strong">游戏目标：</text> 率先到达终点的玩家获胜
					</view>
					<view class="rule-item">
						<cl-icon class="icon" type="icon-yonghu" size="25" color="#ff7eb3" />
						<text class="strong">玩家角色：</text> 男生（蓝色棋子）和女生（粉色棋子）
					</view>
					<view class="rule-item">
						<cl-icon class="icon" type="icon-shuaxin" size="25" color="#ff7eb3" />
						<text class="strong">回合机制：</text> 轮流掷骰子，根据点数移动棋子
					</view>
					<view class="rule-item">
						<cl-icon type="icon-star" size="25" color="#ff7eb3" />
						<text class="strong">特殊格子：</text>
						<view class="ul">
							<view><text style="color:#ff7eb3;">起点</text>：游戏开始位置</view>
							<view><text style="color:#ff7eb3;">终点</text>：游戏结束位置</view>
							<view><text style="color:#ff7eb3;">任务格</text>：需完成指定情侣任务</view>
							<!-- <view><text style="color:#ff7eb3;">奖励格</text>：获得额外移动机会</view> -->
						</view>
					</view>
					<view class="rule-item">
						<cl-icon class="icon" type="icon-qinglv" size="25" color="#ff7eb3" />
						<text class="strong">情侣任务：</text> 落在任务格时，需完成随机分配的情侣互动任务
					</view>
					<view class="rule-item">
						<cl-icon class="icon" type="icon-fenshudiyi" size="25" color="#ff7eb3" />
						<text class="strong">胜利条件：</text> 精确到达终点格时获胜
					</view>
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
			}
		},
		data() {
			return {

			};
		},
		methods: {
			closeHelp() {
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 弹窗样式 */
	.modal {
		position: fixed;
		top: 10px;
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
		overflow: auto;
	}

	.modal.show {
		opacity: 1;
		pointer-events: all;
	}

	.modal-content {
		background: white;
		border-radius: 25px;
		width: 90%;
		max-height: 80vh;
		overflow-y: auto;
		padding: 40px 30px;
		text-align: center;
		position: relative;
		transform: translateY(30px);
		transition: transform 0.4s;
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
	}

	.modal.show .modal-content {
		transform: translateY(0);
	}

	.modal-title {
		font-size: 28px;
		padding: 12px;
		margin: 20px auto;
		border-radius: 15px;
		color: white;
		font-weight: bold;
		background: linear-gradient(to right, #ff7eb3, #ff758c);
		position: relative;
	}

	.close-btn {
		position: absolute;
		padding: 20rpx;
		top: 10rpx;
		right: 15px;
		border: none;
		font-size: 24px;
		color: #666;
		cursor: pointer;
		transition: all 0.3s;
		z-index: 9;
	}

	.close-btn:hover {
		color: #ff758c;
		transform: rotate(90deg);
	}

	/* 玩法介绍样式 */
	.rules-container {
		text-align: left;
		margin: 20px 0;
		line-height: 1.8;
		color: #555;
	}

	.rule-item {
		margin-bottom: 15px;
		padding-left: 25px;
		position: relative;
	}

	.strong {
		font-weight: bold;
	}

	.icon {
		margin-right: 10rpx;
		display: inline-block;
	}

	.ul {
		margin-top: 20rpx;
		padding-left: 40rpx;
	}
</style>