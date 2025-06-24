<template>
	<view class="mortgage-calculator">
		<!-- 输入区域 - 原生组件实现 -->
		<view class="input-section">
			<view class="section-title">贷款信息</view>

			<view class="input-group">
				<text class="label">贷款金额(万元)</text>
				<input type="number" v-model="loanAmount" placeholder="请输入金额" @input="calculate" class="native-input" />
			</view>

			<view class="input-group">
				<text class="label">贷款年限(年)</text>
				<picker :value="yearIndex" :range="loanYearOptions" @change="onYearChange" class="native-picker">
					<view class="picker-text">{{ loanYearOptions[yearIndex] }}</view>
				</picker>
			</view>

			<view class="input-group">
				<text class="label">年利率(%)</text>
				<input type="number" v-model="interestRate" placeholder="输入年利率" @input="calculate"
					class="native-input" />
			</view>

			<view class="input-group">
				<text class="label">还款方式</text>
				<radio-group @change="onMethodChange" class="native-radio-group">
					<label v-for="(method, idx) in repaymentMethods" :key="idx" class="radio-label">
						<radio class="radio" :value="method.value" :checked="repaymentMethod === method.value" />
						<text class="text">{{ method.text }}</text>
					</label>
				</radio-group>
			</view>
		</view>

		<!-- 计算结果区域 -->
		<view class="result-section">
			<view class="section-title">计算结果</view>

			<view class="result-cards">
				<view class="result-card">
					<text class="card-title">月供</text>
					<text class="card-value">¥{{ monthlyPayment }}</text>
				</view>

				<view class="result-card">
					<text class="card-title">总利息</text>
					<text class="card-value">¥{{ totalInterest }}</text>
				</view>

				<view class="result-card">
					<text class="card-title">总还款额</text>
					<text class="card-value">¥{{ totalPayment }}</text>
				</view>
			</view>

			<!-- 还款计划表 -->
			<view class="repayment-plan">
				<view class="plan-header">
					<text class="plan-header-text">期数</text>
					<text class="plan-header-text">月供</text>
					<text class="plan-header-text">本金</text>
					<text class="plan-header-text">利息</text>
					<text class="plan-header-text">剩余本金</text>
				</view>

				<scroll-view scroll-y class="plan-body">
					<view v-for="(item, index) in repaymentSchedule" :key="index" class="plan-row">
						<text class="plan-row-text">{{ item.period }}</text>
						<text class="plan-row-text">¥{{ item.monthlyPayment }}</text>
						<text class="plan-row-text">¥{{ item.principal }}</text>
						<text class="plan-row-text">¥{{ item.interest }}</text>
						<text class="plan-row-text">¥{{ item.remainingPrincipal }}</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loanAmount: 100, // 贷款金额（万元）
				interestRate: 4.9, // 年利率（%）
				repaymentMethod: 'equal', // 还款方式
				yearIndex: 5, // 默认选择30年
				// 计算结果
				monthlyPayment: 0,
				totalInterest: 0,
				totalPayment: 0,
				repaymentSchedule: [],

				// 选项数据
				loanYearOptions: ['5年', '10年', '15年', '20年', '25年', '30年'],
				repaymentMethods: [{
						value: 'equal',
						text: "等额本息"
					},
					{
						value: 'principal',
						text: "等额本金"
					}
				]
			};
		},
		computed: {
			// 根据选择的索引转换为实际年数
			loanYears() {
				return [5, 10, 15, 20, 25, 30][this.yearIndex] || 30;
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
					"【专业】房贷怎么还最划算？精准计算助你决策📊",
					"少还10万利息？用这个神器算清房贷最优解！💡",
					"【省时】1秒算清月供！超准房贷计算器，买房必备🔥"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/houseLoan/houseLoan',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			// 年限选择变化
			onYearChange(e) {
				this.yearIndex = e.detail.value;
				this.calculate();
			},

			// 还款方式变化
			onMethodChange(e) {
				this.repaymentMethod = e.detail.value;
				this.calculate();
			},

			calculate() {
				const amount = this.loanAmount * 10000; // 转换为元
				const months = this.loanYears * 12; // 转换为月数
				const monthlyRate = this.interestRate / 100 / 12; // 月利率

				if (this.repaymentMethod === 'equal') {
					this.calculateEqual(amount, monthlyRate, months);
				} else {
					this.calculatePrincipal(amount, monthlyRate, months);
				}
			},

			// 等额本息计算
			calculateEqual(amount, monthlyRate, months) {
				// 每月还款额公式
				const temp = Math.pow(1 + monthlyRate, months);
				const monthlyPayment = amount * monthlyRate * temp / (temp - 1);

				this.monthlyPayment = monthlyPayment.toFixed(2);
				this.totalPayment = (monthlyPayment * months).toFixed(2);
				this.totalInterest = (this.totalPayment - amount).toFixed(2);

				// 生成还款计划
				this.generateEqualSchedule(amount, monthlyRate, months, monthlyPayment);
			},

			// 等额本金计算
			calculatePrincipal(amount, monthlyRate, months) {
				const principalPerMonth = amount / months; // 每月本金
				const firstMonthPayment = principalPerMonth + amount * monthlyRate; // 首月还款

				this.monthlyPayment = firstMonthPayment.toFixed(2);

				// 计算总利息
				const totalInterest = ((months + 1) * amount * monthlyRate) / 2;
				this.totalInterest = totalInterest.toFixed(2);
				this.totalPayment = (amount + totalInterest).toFixed(2);

				// 生成还款计划
				this.generatePrincipalSchedule(amount, monthlyRate, months, principalPerMonth);
			},

			// 生成等额本息还款计划
			generateEqualSchedule(amount, monthlyRate, months, monthlyPayment) {
				const schedule = [];
				let remainingPrincipal = amount;

				for (let i = 1; i <= months; i++) {
					const interest = remainingPrincipal * monthlyRate;
					const principal = monthlyPayment - interest;
					remainingPrincipal -= principal;

					schedule.push({
						period: i,
						monthlyPayment: monthlyPayment.toFixed(2),
						principal: principal.toFixed(2),
						interest: interest.toFixed(2),
						remainingPrincipal: Math.abs(remainingPrincipal.toFixed(2))
					});
				}

				this.repaymentSchedule = schedule;
			},

			// 生成等额本金还款计划
			generatePrincipalSchedule(amount, monthlyRate, months, principalPerMonth) {
				const schedule = [];
				let remainingPrincipal = amount;

				for (let i = 1; i <= months; i++) {
					const interest = remainingPrincipal * monthlyRate;
					const monthlyPayment = principalPerMonth + interest;
					remainingPrincipal -= principalPerMonth;

					schedule.push({
						period: i,
						monthlyPayment: monthlyPayment.toFixed(2),
						principal: principalPerMonth.toFixed(2),
						interest: interest.toFixed(2),
						remainingPrincipal: Math.abs(remainingPrincipal.toFixed(2))
					});
				}

				this.repaymentSchedule = schedule;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.mortgage-calculator {
		padding: 24rpx 16rpx 40rpx;
		background: #f8fafc;
		min-height: 100vh;

		.section-title {
			font-size: 36rpx;
			font-weight: 700;
			padding: 24rpx 0;
			margin-bottom: 24rpx;
			color: #1e293b;
			border-bottom: 1px solid #e2e8f0;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				left: 0;
				bottom: 0;
				width: 120rpx;
				height: 6rpx;
				background: #3b82f6;
				border-radius: 3rpx;
			}
		}

		.input-section {
			background: #ffffff;
			border-radius: 24rpx;
			padding: 0 32rpx 16rpx;
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
			margin-bottom: 40rpx;

			.input-group {
				display: flex;
				align-items: center;
				margin-bottom: 32rpx;
				padding: 16rpx 0;
				border-bottom: 1rpx solid #f1f5f9;

				.label {
					width: 240rpx;
					font-size: 30rpx;
					color: #334155;
					font-weight: 500;
				}
			}
		}

		/* 原生组件样式优化 */
		.native-input {
			flex: 1;
			height: 80rpx;
			padding: 0 24rpx;
			border: 1px solid #e2e8f0;
			border-radius: 12rpx;
			background: #ffffff;
			font-size: 30rpx;
			color: #1e293b;
			box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.03);

			&:focus {
				border-color: #3b82f6;
				box-shadow: 0 0 0 2rpx rgba(59, 130, 246, 0.2);
			}
		}

		.native-picker {
			flex: 1;

			.picker-text {
				height: 80rpx;
				line-height: 80rpx;
				padding: 0 24rpx;
				border: 1px solid #e2e8f0;
				border-radius: 12rpx;
				background: #fff;
				font-size: 30rpx;
				color: #1e293b;
			}
		}

		.native-radio-group {
			display: flex;
			flex: 1;
			gap: 40rpx;

			.radio-label {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: #475569;

				.radio {
					transform: scale(0.9);
				}

				.text {
					margin-left: 12rpx;
				}
			}
		}

		.result-section {
			background: #ffffff;
			border-radius: 24rpx;
			padding: 0 10rpx 32rpx;
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);

			.result-cards {
				display: flex;
				justify-content: space-between;
				margin-bottom: 40rpx;
				gap: 10rpx;

				.result-card {
					flex: 1;
					padding: 20rpx 12rpx;
					background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
					border-radius: 16rpx;
					text-align: center;
					box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
					border: 1px solid #dbeafe;

					.card-title {
						display: block;
						font-size: 28rpx;
						color: #3b82f6;
						font-weight: 500;
						margin-bottom: 12rpx;
					}

					.card-value {
						display: block;
						font-size: 36rpx;
						font-weight: 700;
						color: #1e40af;
					}
				}
			}

			.repayment-plan {
				border: 1rpx solid #e2e8f0;
				border-radius: 16rpx;
				overflow: hidden;
				box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.02);

				.plan-header {
					display: flex;
					text-align: center;
					background: linear-gradient(to right, #3b82f6, #60a5fa);
					color: white;

					.plan-header-text {
						flex: 1;
						padding: 24rpx 10rpx;
						font-size: 26rpx;
						font-weight: 500;
					}
				}

				.plan-body {
					max-height: 600rpx;
					background: #ffffff;

					.plan-row {
						display: flex;
						text-align: center;
						border-bottom: 1rpx solid #f1f5f9;

						.plan-row-text {
							flex: 1;
							padding: 22rpx 10rpx;
							font-size: 26rpx;
							color: #475569;
						}

						.plan-row-text:first-child {
							color: #64748b;
							font-weight: 500;
						}

						.plan-row-text:nth-child(2) {
							color: #ef4444;
							font-weight: 500;
						}

						&:nth-child(odd) {
							background: #f8fafc;
						}
					}
				}
			}
		}
	}
</style>