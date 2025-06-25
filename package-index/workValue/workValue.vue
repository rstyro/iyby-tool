<template>
	<view class="app-container">
		<view class="header">
			<view class="title">工作性价比计算器</view>
			<view class="subtitle">科学评估你的工作价值</view>
		</view>

		<view class="result-card">
			<view class="evaluation">{{ evaluationText }}</view>
			<view :class="['value-display', valueClass]">{{ workValue.toFixed(2) }}</view>
			<view class="label">工作性价比指数</view>
		</view>

		<view class="form-section">
			<view class="tabs">
				<view :class="['tab', {active: activeTab === 'basic'}]" @click="activeTab = 'basic'">
					基本信息
				</view>
				<view :class="['tab', {active: activeTab === 'coefficient'}]" @click="activeTab = 'coefficient'">
					环境系数
				</view>
			</view>

			<view v-show="activeTab === 'basic'">
				<view class="section-title">工作时间与薪酬</view>
				<view class="input-group">
					<view class="form-item">
						<view class="form-label">平均日薪酬</view>
						<view class="input-container">
							<input type="number" v-model.number="averageDailySalary" placeholder="月薪/出勤天数"
								class="form-input" @input="calculate" />
							<text class="unit">元</text>
						</view>
					</view>
					<view class="form-item">
						<view class="form-label">工作时长</view>
						<view class="input-container">
							<input type="number" v-model.number="workingHours" placeholder="下班时间-上班时间" class="form-input"
								@input="calculate" />
							<text class="unit">小时/天</text>
						</view>
					</view>
					<view class="form-item">
						<view class="form-label">通勤时长</view>
						<view class="input-container">
							<input type="number" v-model.number="commuteTime" placeholder="小时" class="form-input"
								@input="calculate" />
							<text class="unit">小时/天</text>
						</view>
					</view>
					<view class="form-item">
						<view class="form-label">摸鱼时长</view>
						<view class="input-container">
							<input type="number" v-model.number="slackTime" placeholder="不干活+吃饭+午休" class="form-input"
								@input="calculate" />
							<text class="unit">小时/天</text>
						</view>
					</view>
				</view>

				<view class="section-title">工作属性</view>
				<view class="input-group">
					<view class="form-item">
						<view class="form-label">工作难度</view>
						<picker :range="workDifficultyOptions" range-key="label" :value="workDifficultyIndex"
							@change="workDifficultyChange">
							<view class="selector">
								{{ workDifficultyOptions[workDifficultyIndex].label }}
							</view>
						</picker>
					</view>
					<view class="form-item">
						<view class="form-label">是否8:30前上班</view>
						<picker :range="earlyWorkOptions" range-key="label" :value="earlyWorkIndex"
							@change="earlyWorkChange">
							<view class="selector">
								{{ earlyWorkOptions[earlyWorkIndex].label }}
							</view>
						</picker>
					</view>
				</view>
			</view>

			<view v-show="activeTab === 'coefficient'">
				<view class="section-title">个人系数</view>
				<view class="input-group">
					<view class="form-item">
						<view class="form-label">学历系数</view>
						<picker :range="educationOptions" range-key="label" :value="educationIndex"
							@change="educationChange">
							<view class="selector">
								{{ educationOptions[educationIndex].label }}
							</view>
						</picker>
					</view>
				</view>

				<view class="section-title">环境系数</view>
				<view class="input-group">
					<view class="form-item">
						<view class="form-label">工作环境系数</view>
						<picker :range="workEnvironmentOptions" range-key="label" :value="workEnvironmentIndex"
							@change="workEnvironmentChange">
							<view class="selector">
								{{ workEnvironmentOptions[workEnvironmentIndex].label }}
							</view>
						</picker>
					</view>
					<view class="form-item">
						<view class="form-label">异性环境系数</view>
						<picker :range="oppositeSexOptions" range-key="label" :value="oppositeSexIndex"
							@change="oppositeSexChange">
							<view class="selector">
								{{ oppositeSexOptions[oppositeSexIndex].label }}
							</view>
						</picker>
					</view>
					<view class="form-item">
						<view class="form-label">同事环境系数</view>
						<picker :range="colleagueOptions" range-key="label" :value="colleagueIndex"
							@change="colleagueChange">
							<view class="selector">
								{{ colleagueOptions[colleagueIndex].label }}
							</view>
						</picker>
					</view>
				</view>
			</view>

			<button class="calc-btn" @click="calculate">计算工作性价比</button>

			<view class="explanation">
				<view class="title">计算说明：</view>
				<view class="formula">
					工作性价比 = [日薪 × 综合环境系数] ÷ [35 × (工作时长 + 通勤时长 - 0.5 × 摸鱼时长) × 学历系数 × 工作难度] × 是否早班系数
				</view>
				<view class="evaluation-standard">
					<view>评价标准：</view>
					<ul>
						<li>
							<view class="indicator low"></view>低于 0.8：很惨
						</li>
						<li>
							<view class="indicator medium"></view>0.8 - 1.5：一般
						</li>
						<li>
							<view class="indicator high"></view>1.5 - 2.0：很爽
						</li>
						<li>
							<view class="indicator very-high"></view>高于 2.0：爽到爆炸
						</li>
					</ul>
				</view>
				<view class="note">
					综合环境系数 = 工作环境 × 异性环境 × 同事环境
				</view>
			</view>
		</view>

		<view class="footer-note">
			本计算器根据工作性价比模型设计，计算结果仅供参考
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeTab: 'basic',

				// 输入字段
				averageDailySalary: 500,
				workingHours: 9,
				commuteTime: 1,
				slackTime: 1.5,

				// 选择器索引
				educationIndex: 1,
				workEnvironmentIndex: 2,
				oppositeSexIndex: 1,
				colleagueIndex: 1,
				workDifficultyIndex: 1,
				earlyWorkIndex: 1,

				// 计算结果
				workValue: 0,
				evaluationText: '请填写信息并计算',

				// 选项配置
				educationOptions: [{
						label: '专科及以下 (0.8)',
						value: 0.8
					},
					{
						label: '普通本科 (1.0)',
						value: 1
					},
					{
						label: '高级本科 (1.2)',
						value: 1.2
					},
					{
						label: '普通硕士 (1.4)',
						value: 1.4
					},
					{
						label: '高级硕士 (1.6)',
						value: 1.6
					},
					{
						label: '普通博士 (1.8)',
						value: 1.8
					},
					{
						label: '高级博士 (2.0)',
						value: 2
					}
				],
				workEnvironmentOptions: [{
						label: '产线 (0.5)',
						value: 0.5
					},
					{
						label: '嘈杂办公室 (0.8)',
						value: 0.8
					},
					{
						label: '普通大办公室 (1.0)',
						value: 1
					},
					{
						label: '独立办公室 (1.2)',
						value: 1.2
					},
					{
						label: '豪华办公区 (1.5)',
						value: 1.5
					}
				],
				oppositeSexOptions: [{
						label: '没有异性 (0.8)',
						value: 0.8
					},
					{
						label: '异性适中 (1.0)',
						value: 1
					},
					{
						label: '很多异性 (1.2)',
						value: 1.2
					},
					{
						label: '美女/帅哥如云 (1.5)',
						value: 1.5
					}
				],
				colleagueOptions: [{
						label: 'SB很多 (0.7)',
						value: 0.7
					},
					{
						label: '有些SB (0.9)',
						value: 0.9
					},
					{
						label: '普通同事 (1.0)',
						value: 1
					},
					{
						label: '氛围融洽 (1.2)',
						value: 1.2
					},
					{
						label: '非常和谐 (1.5)',
						value: 1.5
					}
				],
				workDifficultyOptions: [{
						label: '轻松无压力 (0.9)',
						value: 0.9
					},
					{
						label: '无要求 (1.0)',
						value: 1
					},
					{
						label: '不紧不慢 (1.2)',
						value: 1.2
					},
					{
						label: '经常被催 (1.4)',
						value: 1.4
					},
					{
						label: '天天挨叼 (1.8)',
						value: 1.8
					},
					{
						label: '地狱模式 (2.0)',
						value: 2
					}
				],
				earlyWorkOptions: [{
						label: '是 (0.9)',
						value: 0.9
					},
					{
						label: '否 (1.0)',
						value: 1
					}
				]
			};
		},
		computed: {
			// 当前选择的系数值
			educationCoefficient() {
				return this.educationOptions[this.educationIndex].value;
			},
			workEnvironmentCoefficient() {
				return this.workEnvironmentOptions[this.workEnvironmentIndex].value;
			},
			oppositeSexCoefficient() {
				return this.oppositeSexOptions[this.oppositeSexIndex].value;
			},
			colleagueCoefficient() {
				return this.colleagueOptions[this.colleagueIndex].value;
			},
			workDifficulty() {
				return this.workDifficultyOptions[this.workDifficultyIndex].value;
			},
			earlyWorkCoefficient() {
				return this.earlyWorkOptions[this.earlyWorkIndex].value;
			},

			// 计算综合环境系数
			comprehensiveEnvironmentCoefficient() {
				return this.workEnvironmentCoefficient *
					this.oppositeSexCoefficient *
					this.colleagueCoefficient;
			},

			// 结果分类样式
			valueClass() {
				if (this.workValue < 0.8) return 'low';
				if (this.workValue <= 1.5) return 'medium';
				if (this.workValue <= 2) return 'high';
				return 'very-high';
			}
		},
		mounted() {
			this.calculate();
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
					"「算完我哭了！月薪过万的工作性价比居然不如楼下煎饼摊...这个计算器太扎心了！」",
					"「原来我每天上班都在亏钱？这个神器算完直接emo了...」",
					"「同事测出'爽到爆炸'，我测出'很惨'...这破班是一天也上不下去了！」"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/workValue/workValue',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			// 处理选择器变化
			educationChange(e) {
				this.educationIndex = e.detail.value;
				this.calculate();
			},
			workEnvironmentChange(e) {
				this.workEnvironmentIndex = e.detail.value;
				this.calculate();
			},
			oppositeSexChange(e) {
				this.oppositeSexIndex = e.detail.value;
				this.calculate();
			},
			colleagueChange(e) {
				this.colleagueIndex = e.detail.value;
				this.calculate();
			},
			workDifficultyChange(e) {
				this.workDifficultyIndex = e.detail.value;
				this.calculate();
			},
			earlyWorkChange(e) {
				this.earlyWorkIndex = e.detail.value;
				this.calculate();
			},

			// 计算工作性价比
			calculate() {
				// 输入验证
				if (this.averageDailySalary <= 0) {
					this.workValue = 0;
					this.evaluationText = "请检查日薪输入";
					return;
				}

				const totalTime = this.workingHours + this.commuteTime - 0.5 * this.slackTime;

				// 防止除数为零
				if (totalTime <= 0) {
					this.workValue = 0;
					this.evaluationText = "时间设置不合理";
					return;
				}

				// 计算公式
				const baseValue = (this.averageDailySalary * this.comprehensiveEnvironmentCoefficient) /
					(35 * totalTime * this.educationCoefficient * this.workDifficulty);

				this.workValue = baseValue * this.earlyWorkCoefficient;

				// 评价文本
				if (this.workValue < 0.8) {
					this.evaluationText = "很惨 😭";
				} else if (this.workValue <= 1.5) {
					this.evaluationText = "一般 😐";
				} else if (this.workValue <= 2) {
					this.evaluationText = "很爽 😊";
				} else {
					this.evaluationText = "爽到爆炸 😍";
				}
			}
		}
	};
</script>

<style lang="scss" scoped >
	/* 基础样式重置 */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		-webkit-tap-highlight-color: transparent;
	}

	page {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: #f5f7fa;
		color: #333;
		height: 100%;
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* 容器样式 */
	.app-container {
		width: 100%;
		max-width: 480px;
		margin: 0 auto;
		background: white;
		min-height: 100vh;
		position: relative;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
	}

	/* 头部样式 */
	.header {
		background: linear-gradient(135deg, #3498db, #1a5276);
		color: white;
		padding: 80rpx 30rpx;
		text-align: center;
		position: relative;
		overflow: hidden;
		padding-top: calc(36rpx + env(safe-area-inset-top));
	}

	.header:before {
		content: "";
		position: absolute;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
		transform: rotate(30deg);
	}

	.header .title {
		font-size: 50rpx;
		font-weight: 600;
		position: relative;
		z-index: 2;
		margin: 0;
	}

	.header .subtitle {
		opacity: 0.9;
		font-size: 26rpx;
		position: relative;
		z-index: 2;
		letter-spacing: 0.5px;
		margin-top: 10rpx;
	}

	/* 结果卡片 */
	.result-card {
		background: white;
		margin: -50rpx 30rpx 30rpx;
		border-radius: 24rpx;
		box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.12);
		padding: 40rpx;
		position: relative;
		z-index: 10;
		text-align: center;
		border: 1px solid rgba(52, 152, 219, 0.15);
	}

	.value-display {
		font-size: 80rpx;
		font-weight: 800;
		margin: 20rpx 0 16rpx;
		transition: all 0.3s ease;
		font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif;
	}

	.value-display.low {
		color: #e74c3c;
		text-shadow: 0 4rpx 8rpx rgba(231, 76, 60, 0.2);
	}

	.value-display.medium {
		color: #f39c12;
		text-shadow: 0 4rpx 8rpx rgba(243, 156, 18, 0.2);
	}

	.value-display.high {
		color: #2ecc71;
		text-shadow: 0 4rpx 8rpx rgba(46, 204, 113, 0.2);
	}

	.value-display.very-high {
		color: #27ae60;
		text-shadow: 0 4rpx 8rpx rgba(39, 174, 96, 0.3);
		animation: pulse 1.5s infinite;
	}

	.evaluation {
		font-size: 36rpx;
		font-weight: 700;
		margin-bottom: 20rpx;
	}

	.result-card .label {
		color: #7f8c8d;
		font-size: 28rpx;
		margin-top: 10rpx;
	}

	/* 表单区域 */
	.form-section {
		padding: 0 30rpx 50rpx;
	}

	.section-title {
		display: flex;
		align-items: center;
		margin: 50rpx 0 32rpx;
		color: #2c3e50;
		font-weight: 600;
		font-size: 32rpx;
		position: relative;
	}

	.section-title:before {
		content: "";
		display: inline-block;
		width: 8rpx;
		height: 32rpx;
		background: linear-gradient(to bottom, #3498db, #2980b9);
		border-radius: 4rpx;
		margin-right: 16rpx;
	}

	.input-group {
		margin-bottom: 24rpx;
		background: white;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);
		border: 1px solid #eee;
	}

	.form-item {
		padding: 20rpx 36rpx;
		border-bottom: 1px solid #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}

	.form-item:last-child {
		border-bottom: none;
	}

	.form-label {
		font-size: 30rpx;
		color: #34495e;
		flex: 1;
		font-weight: 500;
	}

	.input-container {
		display: flex;
		align-items: center;
	}

	.form-input {
		width: 290rpx;
		text-align: right;
		border: none;
		font-size: 30rpx;
		color: #2c3e50;
		background: transparent;
		outline: none;
		padding: 12rpx 16rpx;
		height: 90rpx;
		font-weight: 500;
		border-radius: 16rpx;
		background: #f9fbfd;
		border: 1px solid #e1e8f0;
	}

	.form-input:focus {
		border-color: #3498db;
		background: #ecf6fe;
	}

	.unit {
		color: #95a5a6;
		margin-left: 16rpx;
		font-size: 28rpx;
		min-width: 80rpx;
		text-align: right;
	}

	.selector {
		background: #f8f9fa;
		border-radius: 16rpx;
		padding: 20rpx 30rpx;
		font-size: 28rpx;
		color: #2c3e50;
		width: 360rpx;
		text-align: right;
		border: 1px solid #e1e8f0;
		font-weight: 500;
		padding-right: 70rpx;
		position: relative;
	}

	.selector:after {
		content: ">";
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%) rotate(90deg);
		font-size: 24rpx;
		color: #95a5a6;
	}

	/* 按钮样式 */
	.calc-btn {
		background: linear-gradient(135deg, #3498db, #2980b9);
		color: white;
		border: none;
		border-radius: 100rpx;
		padding: 30rpx 50rpx;
		font-size: 32rpx;
		font-weight: 600;
		display: block;
		width: 100%;
		margin: 60rpx 0;
		box-shadow: 0 12rpx 32rpx rgba(52, 152, 219, 0.35);
		transition: all 0.3s;
		position: relative;
		overflow: hidden;
	}

	.calc-btn:after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 100%;
		transform: translate(-50%, -50%);
		transition: width 0.6s ease, height 0.6s ease;
	}

	.calc-btn:active:after {
		width: 600rpx;
		height: 600rpx;
	}

	.calc-btn:active {
		transform: translateY(6rpx);
		box-shadow: 0 6rpx 16rpx rgba(52, 152, 219, 0.4);
	}

	/* 标签页样式 */
	.tabs {
		display: flex;
		background: #f1f5f9;
		border-radius: 24rpx;
		padding: 12rpx;
		margin: 32rpx 0;
	}

	.tab {
		flex: 1;
		text-align: center;
		padding: 24rpx 20rpx;
		border-radius: 20rpx;
		font-size: 30rpx;
		transition: all 0.3s;
		font-weight: 500;
		color: #7f8c8d;
	}

	.tab.active {
		background: white;
		box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08);
		font-weight: 600;
		color: #3498db;
	}

	/* 解释区域 */
	.explanation {
		background: #e8f4fd;
		border-radius: 32rpx;
		padding: 40rpx;
		margin-top: 40rpx;
		font-size: 28rpx;
		color: #2c3e50;
		line-height: 1.6;
		border: 1px solid #d4e9ff;
	}

	.explanation .title {
		color: #2980b9;
		font-size: 32rpx;
		margin-bottom: 24rpx;
		font-weight: 600;
	}

	.explanation .formula {
		background: rgba(255, 255, 255, 0.7);
		padding: 30rpx;
		border-radius: 20rpx;
		margin: 30rpx 0;
		font-family: monospace;
		font-size: 28rpx;
		text-align: center;
		border: 1px dashed #3498db;
	}

	.explanation .evaluation-standard {
		margin: 30rpx 0;
	}

	.explanation .evaluation-standard ul {
		padding-left: 44rpx;
		margin-top: 20rpx;
	}

	.explanation .evaluation-standard li {
		list-style: none;
		position: relative;
		margin-bottom: 24rpx;
		display: flex;
		align-items: center;
	}

	.explanation .evaluation-standard li:before {
		content: "•";
		position: absolute;
		left: -44rpx;
		font-size: 40rpx;
		color: #3498db;
	}

	.explanation .note {
		font-weight: 500;
		margin-top: 30rpx;
		text-align: center;
		color: #2980b9;
	}

	.indicator {
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		display: inline-block;
		margin-right: 16rpx;
	}

	.indicator.low {
		background-color: #e74c3c;
	}

	.indicator.medium {
		background-color: #f39c12;
	}

	.indicator.high {
		background-color: #2ecc71;
	}

	.indicator.very-high {
		background-color: #27ae60;
	}

	/* 页脚 */
	.footer-note {
		text-align: center;
		color: #95a5a6;
		font-size: 24rpx;
		padding: 50rpx 30rpx;
		line-height: 1.8;
		border-top: 1px solid #ecf0f1;
		margin-top: 20rpx;
	}

	/* 动画 */
	@keyframes pulse {
		0% {
			transform: scale(1);
			opacity: 1;
		}

		50% {
			transform: scale(1.05);
			opacity: 0.9;
		}

		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.value-display {
		animation: fadeIn 0.5s ease-out;
	}
</style>