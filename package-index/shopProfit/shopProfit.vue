<template>
	<view class="container">
		<view class="header">
			<view class="title-group">
				<cl-icon type="icon-jisuanqi" size="32" color="#fff" />
				<text class="title">开店盈利计算器</text>
			</view>
			<view class="subtitle">精准计算开店成本、盈利能力和关键经营指标</view>
		</view>

		<view scroll-y="true" class="content">
			<view class="card">
				<view class="card-title">
					<cl-icon type="moneybag" size="24" color="#3498db" />
					<text>成本与收入参数</text>
				</view>

				<view class="input-grid">
					<view class="input-group" v-for="input in inputs" :key="input.field">
						<text class="input-label">
							<!-- <cl-icon :type="input.icon" size="18" color="#3498db" /> -->
							<text>{{ input.label }}</text>
						</text>
						<view class="input-box">
							<input type="number" v-model="inputData[input.field]" :placeholder="input.placeholder"
								class="uni-input" />
							<text class="unit">{{ input.unit }}</text>
						</view>
					</view>
				</view>

				<button class="calculate-btn" @click="calculate">
					<cl-icon type="icon-jisuanqi" size="22" color="#fff" />
					<text>计算盈利情况</text>
				</button>
			</view>

			<view class="results-section">
				<view class="result-card">
					<text class="result-title">盈利能力分析</text>
					<view class="result-item">
						<view class="result-label">
							<text>每月总收入</text>
						</view>
						<text class="result-value">¥{{ results.monthlyRevenue | formatPrice }}</text>
					</view>
					<view class="result-item">
						<view class="result-label">
							<text>每月总成本</text>
						</view>
						<text class="result-value">¥{{ results.monthlyTotalCost | formatPrice }}</text>
					</view>
					<view class="result-item">
						<view class="result-label">
							<text>毛利率</text>
						</view>
						<text class="result-value">{{ results.grossMargin }}%</text>
					</view>
					<view class="result-item">
						<view class="result-label">
							<text>每月净利润</text>
						</view>
						<text class="result-value" :class="{
              'profit-positive': results.monthlyProfit > 0,
              'profit-negative': results.monthlyProfit < 0
            }">
							{{ results.monthlyProfit | formatProfit }}
						</text>
					</view>
				</view>

				<view class="result-card">
					<text class="result-title">经营关键指标</text>
					<view class="result-item">
						<view class="result-label">
							<text>盈亏平衡点</text>
						</view>
						<text class="result-value">{{ results.breakEvenPoint | formatNumber }} 单/月</text>
					</view>
					<view class="result-item">
						<view class="result-label">
							<text>净利率</text>
						</view>
						<text class="result-value">{{ results.netMargin }}%</text>
					</view>
					<view class="result-item">
						<view class="result-label">
							<text>转化率</text>
						</view>
						<text class="result-value">{{ results.conversionRate }}%</text>
					</view>
					<view class="result-item">
						<view class="result-label">
							<text>每单毛利润</text>
						</view>
						<text class="result-value">¥{{ results.grossProfitPerItem | formatPrice }}</text>
					</view>
				</view>
			</view>

			<view class="highlight-box">
				<view class="highlight-label">回本所需时间</view>
				<view class="highlight-value" v-if="results.monthlyProfit > 0">
					{{ monthsToRecover }} 个月
				</view>
				<view class="highlight-value" v-else-if="results.monthlyProfit === 0">
					收支平衡
				</view>
				<view class="highlight-value" v-else>
					无法回本
				</view>
				<view class="highlight-sub">
					初始投资 ¥{{ inputData.initialInvestment | formatPrice }} |
					月利润 ¥{{ results.monthlyProfit | formatPrice }}
				</view>
			</view>

			<view class="explanation">
				<view class="explanation-title">
					<cl-icon type="icon-dengpao" size="24" color="#3498db" />
					<text>计算说明与指标解释</text>
				</view>
				<view class="explanation-list">
					<view v-for="(item, index) in explanations" :key="index" class="explanation-item">
						<text class="explanation-key">{{ item.key }}</text>
						<text class="explanation-value">{{ item.value }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="footer">
			<text>创业助手 · 计算结果仅供参考 · 实际经营受多种因素影响</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputData: {
					initialInvestment: 150000,
					monthlyFixedCost: 25000,
					pricePerItem: 85,
					costPerItem: 35,
					monthlyOrders: 1200,
					dailyCustomers: 70
				},
				inputs: [{
						icon: 'icon-jisuanqi',
						label: '初始投资成本',
						field: 'initialInvestment',
						unit: '元',
						placeholder: '装修、设备等投入'
					},
					{
						icon: 'icon-jisuanqi',
						label: '每月固定成本',
						field: 'monthlyFixedCost',
						unit: '元/月',
						placeholder: '租金、水电、工资等'
					},
					{
						icon: 'icon-jisuanqi',
						label: '客单价',
						field: 'pricePerItem',
						unit: '元',
						placeholder: '每单平均消费金额'
					},
					{
						icon: 'icon-jisuanqi',
						label: '每单成本',
						field: 'costPerItem',
						unit: '元',
						placeholder: '每单平均成本'
					},
					{
						icon: 'icon-jisuanqi',
						label: '预计月订单量',
						field: 'monthlyOrders',
						unit: '单/月',
						placeholder: '每月订单数量'
					},
					{
						icon: 'icon-jisuanqi',
						label: '日均客流量',
						field: 'dailyCustomers',
						unit: '人/天',
						placeholder: '每天顾客数量'
					}
				],
				results: {
					monthlyRevenue: 0,
					monthlyTotalCost: 0,
					grossMargin: 0,
					monthlyProfit: 0,
					breakEvenPoint: 0,
					netMargin: 0,
					conversionRate: 0,
					grossProfitPerItem: 0
				},
				monthsToRecover: 0,
				explanations: [{
						key: '每月总收入',
						value: '= 客单价 × 月订单量'
					},
					{
						key: '每单成本',
						value: '= 商品/服务成本 + 可变成本'
					},
					{
						key: '毛利率',
						value: '= (客单价 - 每单成本) / 客单价 × 100%'
					},
					{
						key: '每月总成本',
						value: '= 每月固定成本 + (每单成本 × 月订单量)'
					},
					{
						key: '每月净利润',
						value: '= 每月总收入 - 每月总成本'
					},
					{
						key: '盈亏平衡点',
						value: '= 每月固定成本 / (客单价 - 每单成本) - 达到收支平衡的月订单量'
					},
					{
						key: '转化率',
						value: '= (月订单量 / (日均客流量 × 30)) × 100% - 进店顾客转化为订单的比例'
					},
					{
						key: '回本所需时间',
						value: '= 初始投资成本 ÷ 每月净利润（向上取整）'
					}
				]
			}
		},
		filters: {
			formatPrice(value) {
				return value.toLocaleString()
			},
			formatProfit(value) {
				if (value >= 0) {
					return `¥${value.toLocaleString()}`
				} else {
					return `-¥${Math.abs(value).toLocaleString()}`
				}
			},
			formatNumber(value) {
				return value.toLocaleString()
			}
		},
		mounted() {
			this.calculate()
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
					"🔥开店必算！3分钟精准预测回本周期,创业避坑神器，点击马上测算！",
					"💰算不清账就别开店！亲测超准的盈利计算器",
					"原来我的店一直在亏钱...直到用了这个工具❗"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/shopProfit/shopProfit',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			parseInput(value) {
				// 安全转换为数字
				const num = parseFloat(value);
				return isNaN(num) ? 0 : num;
			},
			calculate() {
				// 安全转换所有输入值为数字
				const sanitizedInputs = {};
				Object.keys(this.inputData).forEach(key => {
					sanitizedInputs[key] = this.parseInput(this.inputData[key]);
				});

				// 执行计算
				this.results = this.calculateProfit(sanitizedInputs);

				// 计算回本所需时间（添加防止除以0的保护）
				const monthlyProfit = this.results.monthlyProfit;
				if (monthlyProfit > 0) {
					this.monthsToRecover = Math.ceil(
						this.parseInput(this.inputData.initialInvestment) / monthlyProfit
					);
				} else {
					this.monthsToRecover = monthlyProfit === 0 ? 0 : -1;
				}
			},
			calculateProfit(input) {
				// 核心计算逻辑优化（添加单位注释以便理解）
				// 客单价
				const pricePerItem = this.parseInput(input.pricePerItem);
				// 成本价
				const costPerItem = this.parseInput(input.costPerItem);
				//每月订单数量
				const monthlyOrders = this.parseInput(input.monthlyOrders);
				//每月固定成本
				const monthlyFixedCost = this.parseInput(input.monthlyFixedCost);
				//日均客流量
				const dailyCustomers = this.parseInput(input.dailyCustomers);

				// 1. 计算每单毛利润（核心指标）
				const grossProfitPerItem = pricePerItem - costPerItem;

				// 月总收入
				const monthlyRevenue = pricePerItem * monthlyOrders;
				// 月总成本
				const monthlyTotalCost = monthlyFixedCost + (costPerItem * monthlyOrders);

				// 月总利润
				const monthlyProfit = monthlyRevenue - monthlyTotalCost;

				// 4. 计算盈亏平衡点（保护除以0）
				let breakEvenPoint = 0;
				if (grossProfitPerItem > 0) {
					breakEvenPoint = Math.ceil(monthlyFixedCost / grossProfitPerItem);
				} else if (monthlyFixedCost === 0) {
					breakEvenPoint = 0;
				} // 否则保持为0（表示无法计算）

				// 5. 计算转化率
				const monthlyCustomers = dailyCustomers * 30;
				let conversionRate = "0.0";
				if (monthlyCustomers > 0) {
					conversionRate = ((monthlyOrders / monthlyCustomers) * 100).toFixed(1);
				}

				// 6. 计算毛利率和净利率（保护除以0）
				const grossMargin = pricePerItem > 0 ?
					((grossProfitPerItem / pricePerItem) * 100).toFixed(1) : "0.0";

				const netMargin = monthlyRevenue > 0 ?
					((monthlyProfit / monthlyRevenue) * 100).toFixed(1) : "0.0";

				return {
					monthlyRevenue,
					monthlyTotalCost,
					grossMargin,
					monthlyProfit,
					breakEvenPoint,
					netMargin,
					conversionRate,
					grossProfitPerItem
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background: #f8fafc;
		box-sizing: border-box;
		padding: 10rpx;
	}

	.header {
		background: linear-gradient(135deg, #1a5d9f 0%, #2c3e50 100%);
		color: #fff;
		padding: 20rpx 30rpx 15rpx;
		border-radius: 0 0 20rpx 20rpx;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
	}

	.title-group {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 10rpx;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		margin-left: 12rpx;
		color: #fff;
	}

	.subtitle {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.8);
		text-align: center;
		line-height: 1.5;
		padding: 0 20rpx;
	}

	.content {
		margin: 30rpx 0px;
	}

	.card {
		background: #fff;
		border-radius: 16rpx;
		padding: 25rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		border: 1rpx solid #eef2f6;
	}

	.card-title {
		display: flex;
		align-items: center;
		margin-bottom: 25rpx;
		font-size: 30rpx;
		font-weight: 600;
		color: #2c3e50;
		padding-bottom: 15rpx;
		border-bottom: 1rpx solid #eef2f6;
	}

	.input-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
	}

	.input-group {
		margin-bottom: 15rpx;
	}

	.input-label {
		display: flex;
		align-items: center;
		margin-bottom: 8rpx;
		font-weight: 500;
		color: #4a5568;
		font-size: 26rpx;
	}

	.input-box {
		position: relative;

		input {
			width: 100%;
			height: 80rpx;
			border: 1rpx solid #e0e6ed;
			border-radius: 12rpx;
			padding: 0 100rpx 0 20rpx;
			font-size: 28rpx;
			color: #2c3e50;
			background: #fff;
			box-sizing: border-box;
			transition: all 0.3s ease;

			&::placeholder {
				color: #a0aec0;
				font-size: 26rpx;
			}

			&:focus {
				border-color: #3498db;
				box-shadow: 0 0 0 2rpx rgba(52, 152, 219, 0.2);
			}
		}

		.unit {
			position: absolute;
			right: 20rpx;
			top: 50%;
			transform: translateY(-50%);
			color: #718096;
			font-size: 26rpx;
		}
	}

	.calculate-btn {
		background: linear-gradient(135deg, #3498db 0%, #1a5d9f 100%);
		color: white;
		border: none;
		border-radius: 12rpx;
		height: 85rpx;
		width: 100%;
		font-size: 30rpx;
		font-weight: 600;
		margin-top: 15rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 4rpx 15rpx rgba(52, 152, 219, 0.3);
		transition: all 0.2s ease;

		&:active {
			transform: translateY(2rpx);
			box-shadow: 0 2rpx 8rpx rgba(52, 152, 219, 0.4);
		}
	}

	.results-section {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20rpx;
		margin-top: 25rpx;
	}

	@media (min-width: 700rpx) {
		.results-section {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.result-card {
		background: white;
		border-radius: 16rpx;
		padding: 25rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		border: 1rpx solid #eef2f6;
	}

	.result-title {
		display: block;
		text-align: center;
		margin-bottom: 25rpx;
		color: #2c3e50;
		font-size: 30rpx;
		font-weight: 600;
		padding-bottom: 15rpx;
		border-bottom: 1rpx solid #f0f4f8;
	}

	.result-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		padding-bottom: 15rpx;
		border-bottom: 1rpx dashed #eef2f6;

		&:last-child {
			border-bottom: none;
			margin-bottom: 0;
			padding-bottom: 0;
		}
	}

	.result-label {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #4a5568;
	}

	.result-value {
		font-size: 30rpx;
		font-weight: 700;
		color: #2c3e50;
	}

	.profit-positive {
		color: #27ae60;
	}

	.profit-negative {
		color: #e74c3c;
	}

	.highlight-box {
		background: linear-gradient(135deg, #2c5282 0%, #1a5d9f 100%);
		border-radius: 16rpx;
		padding: 25rpx;
		text-align: center;
		color: white;
		margin-top: 25rpx;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
	}

	.highlight-label {
		font-size: 26rpx;
		margin-bottom: 10rpx;
		color: rgba(255, 255, 255, 0.85);
	}

	.highlight-value {
		font-size: 44rpx;
		font-weight: 800;
		color: #ffd166;
		line-height: 1.3;
	}

	.highlight-sub {
		display: block;
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.7);
		margin-top: 8rpx;
	}

	.explanation {
		margin-top: 25rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 25rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		border: 1rpx solid #eef2f6;
	}

	.explanation-title {
		display: flex;
		align-items: center;
		color: #2c3e50;
		margin-bottom: 20rpx;
		font-size: 30rpx;
		font-weight: 600;
	}

	.explanation-list {
		padding-left: 10rpx;
	}

	.explanation-item {
		margin-bottom: 20rpx;
		line-height: 1.6;
		color: #4a5568;
		font-size: 24rpx;
		display: flex;
		flex-wrap: wrap;

		&::before {
			content: "";
			display: inline-block;
			width: 8rpx;
			height: 8rpx;
			background-color: #3498db;
			border-radius: 50%;
			margin-right: 15rpx;
			margin-top: 18rpx;
		}

		.explanation-key {
			font-weight: bold;
			color: #2c3e50;
			margin-right: 10rpx;
			width: 200rpx;
		}

		.explanation-value {
			flex: 1;
			min-width: 60%;
		}
	}

	.footer {
		text-align: center;
		padding: 20rpx;
		color: #718096;
		font-size: 22rpx;
		background: #f8fafc;
		border-top: 1rpx solid #eef2f6;
		flex-shrink: 0;
		margin-top: 20rpx;
	}
</style>