<template>
	<view class="container">
		<!-- 说明模块 -->
		<view class="section">
			<view class="header">进制转换是什么</view>
			<view class="content">
				进制转换是人们利用符号来计数的方法。由一组数码符号和两个基本因素“基数”与“位权”构成。基数指进位计数制中所采用的数码个数，位权指固定位置对应的单位值 [[1]]。
			</view>
		</view>

		<!-- 转换器模块 -->
		<view class="section">
			<view class="header">进制转换器</view>
			<view class="content">
				<!-- 基础设置 -->
				<view class="form-group">
					<view class="label">初始进制</view>
					<picker mode="selector" range-key="text" :range="baseList" :value="params.baseIndex"
						@change="changeBase">
						<view class="picker">{{ baseList[params.baseIndex].text }}</view>
					</picker>
				</view>

				<!-- 输入区域 -->
				<textarea class="text-box" :value="content" @input="handleInput" placeholder="请输入数值（如：FF）" />

				<!-- 快速查看 -->
				<view class="quick-view">
					<view class="result-item">
						<text class="label">二进制:</text>
						<text class="value">{{ base.r2 }}</text>
					</view>
					<view class="result-item">
						<text class="label">八进制:</text>
						<text class="value">{{ base.r8 }}</text>
					</view>
					<view class="result-item">
						<text class="label">十进制:</text>
						<text class="value">{{ base.r10 }}</text>
					</view>
					<view class="result-item">
						<text class="label">十六进制:</text>
						<text class="value">{{ base.r16 }}</text>
					</view>
				</view>

				<!-- 目标进制 -->
				<view class="form-group">
					<view class="label">目标进制</view>
					<picker mode="selector" range-key="text" :range="baseList2" :value="params.toIndex"
						@change="changeTarget">
						<view class="picker">{{ baseList2[params.toIndex].text }}</view>
					</picker>
				</view>

				<!-- 操作按钮 -->
				<button class="primary-btn" type="primary" @click="convert">立即转换</button>
			</view>
		</view>

		<!-- 结果展示 -->
		<view class="section">
			<view class="header">转换结果</view>
			<view class="content">
				<textarea class="text-box" :value="result" readonly placeholder="转换结果将显示在此处" />
				<view class="action-bar">
					<button class="btn-secondary" type="primary" size="mini" @click="copyResult">复制结果</button>
					<button class="btn-warning" type="default" size="mini" @click="clearAll">清空</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 基础配置
				params: {
					baseIndex: 10, // 当前选择的基础进制索引
					toIndex: 1, // 目标进制索引
					base: 10, // 实际基础进制值
					to: 2 // 实际目标进制值
				},

				// 进制列表
				baseList: [],
				baseList2: [],

				// 输入数据
				content: '',
				result: '',

				// 快速结果
				base: {
					r2: '', // 二进制
					r8: '', // 八进制
					r10: '', // 十进制
					r16: '' // 十六进制
				}
			};
		},
		onLoad() {
			this.initBaseList();
		},
		onShareAppMessage(res) {
			return this.generateShareConfig();
		},
		onShareTimeline() {
			return this.generateShareConfig(true);
		},
		methods: {
			generateShareConfig(forTimeline = false) {
				const defaultTemplates = [
					"🎓 学生党狂喜！进制转换考试题直接甩答案？",
					"🔢 【黑科技效率工具】二进制转十六进制？十进制转八进制？"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/ancientMoney/ancientMoney',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			// 初始化进制列表
			initBaseList() {
				const bases = Array.from({
					length: 31
				}, (_, i) => i + 2);
				this.baseList = bases.map(n => ({
					text: `${n}进制`,
					value: n
				}));
				this.baseList2 = [...this.baseList];
			},

			// 输入处理
			handleInput(e) {
				const value = e.detail.value;
				this.content = value;

				// 非法字符检测
				if (this.params.base <= 10 && /[^0-9]/.test(value)) {
					uni.showToast({
						title: '仅允许输入数字',
						icon: 'none'
					});
					this.clearResults();
					return;
				}

				this.convertAll();
			},

			// 基础进制选择
			changeBase(e) {
				const index = e.detail.value;
				this.params.baseIndex = index;
				this.params.base = this.baseList[index].value;
				this.convertAll();
			},

			// 目标进制选择
			changeTarget(e) {
				const index = e.detail.value;
				this.params.toIndex = index;
				this.params.to = this.baseList2[index].value;
			},

			// 执行转换
			convert() {
				if (!this.content) {
					uni.showToast({
						title: '请输入数值',
						icon: 'none'
					});
					return;
				}

				this.result = this.baseConversion(this.content, this.params.base, this.params.to);
				uni.showToast({
					title: '转换完成',
					icon: 'success'
				});
			},

			// 批量转换
			convertAll() {
				const val = this.content;
				if (!val) return this.clearResults();

				this.base.r2 = this.baseConversion(val, this.params.base, 2);
				this.base.r8 = this.baseConversion(val, this.params.base, 8);
				this.base.r10 = this.baseConversion(val, this.params.base, 10);
				this.base.r16 = this.baseConversion(val, this.params.base, 16);
			},
			// 进制转换
			baseConversion(value, baseFrom, baseTo){
				let result = parseInt(value, baseFrom).toString(baseTo);
				if (baseTo == 10) {
					result = Number(result).toFixed(0);
				}
				return result;
			},

			// 清空结果
			clearResults() {
				this.base.r2 = '';
				this.base.r8 = '';
				this.base.r10 = '';
				this.base.r16 = '';
			},

			// 复制结果
			copyResult() {
				if (!this.result) return;
				this.$t.copyData(this.result);
				uni.showToast({
					title: '已复制到剪贴板'
				});
			},

			// 清空所有
			clearAll() {
				this.content = '';
				this.result = '';
				this.clearResults();
			}
		}
	};
</script>

<style lang="scss" scoped>
	$primary-color: #007AFF;
	$border-radius: 8rpx;

	.container {
		padding: 20rpx;
		font-family: 'Microsoft Yahei';
	}
	
	.section {
		margin-bottom: 40rpx;
		background: #fff;
		border-radius: $border-radius;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.05);
	}

	.header {
		padding: 20rpx 30rpx;
		background: #f5f5f5;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		border-bottom: 1px solid #eee;
	}

	.content {
		padding: 30rpx;
	}

	.form-group {
		margin-bottom: 20rpx;
	}

	.label {
		font-size: 28rpx;
		margin-bottom: 10rpx;
		color: #666;
	}

	.picker {
		padding: 20rpx;
		border: 1px solid #eee;
		border-radius: $border-radius;
		color: #333;
	}

	.input-area {
		min-height: 120rpx;
		padding: 20rpx;
		border: 1px solid #eee;
		border-radius: $border-radius;
		margin-bottom: 30rpx;
		font-size: 28rpx;
	}

	.quick-view {
		margin-bottom: 30rpx;
	}

	.result-item {
		display: flex;
		justify-content: space-between;
		padding: 10rpx 0;
		border-bottom: 1px dashed #eee;

		&:last-child {
			border-bottom: none;
		}
	}

	.label {
		width: 120rpx;
		color: #666;
	}

	.value {
		color: $primary-color;
		font-weight: bold;
	}

	.text-box {
		width: 93%;
		min-height: 150rpx;
		padding: 20rpx;
		border: 2rpx solid #e0e7ff;
		border-radius: 12rpx;
		font-size: 28rpx;
		margin-bottom: 30rpx;
		background: #fff;
	}


	.action-bar {
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
	}

	.primary-btn,
	.btn-secondary,
	.btn-info,
	.btn-warning {
		flex: 1;
		background: linear-gradient(to right, #3498db, #2980b9);
		color: white;
		border-radius: 10rpx;
		padding: 20rpx 0;
		font-size: 28rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}


	.btn-secondary {
		background: linear-gradient(to right, #2ecc71, #27ae60);
	}

	.btn-info {
		background: linear-gradient(to right, #9b59b6, #8e44ad);
	}

	.btn-warning {
		background: linear-gradient(to right, #e74c3c, #c0392b);
	}
</style>