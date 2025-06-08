<template>
	<view class="container">
		<!-- 顶部标题栏 -->
		<view class="header">
			<text class="title">全能单位转换器</text>
			<text class="subtitle">支持30+种单位的精确转换</text>
		</view>

		<!-- 单位类型选择 -->
		<view class="unit-type-selector">
			<scroll-view scroll-x class="scroll-view">
				<view v-for="(type, index) in unitTypes" :key="index"
					:class="['type-item', { active: activeType === type.value }]" @click="changeUnitType(type.value)">
					{{ type.label }}
				</view>
			</scroll-view>
		</view>

		<!-- 转换区域 -->
		<view class="conversion-area">
			<!-- 输入区域 -->
			<view class="input-group">
				<input class="input-field" type="number" placeholder="输入数值" v-model="inputValue"
					@input="convertUnits('from')" />
				<picker class="unit-picker" :range="currentUnits" range-key="label" @change="changeFromUnit">
					<view class="picker-text">{{ fromUnit.label }}</view>
				</picker>
			</view>

			<!-- 转换箭头 -->
			<view class="conversion-arrow" @click="swapUnits">
				<cl-icon class="swap-icon" type="icon-tongbu" size="30" color="#3498db"></cl-icon>
			</view>

			<!-- 输出区域 -->
			<view class="input-group">
				<input class="input-field result-field" type="number" placeholder="结果" v-model="outputValue" disabled />
				<picker class="unit-picker" :range="currentUnits" range-key="label" @change="changeToUnit">
					<view class="picker-text">{{ toUnit.label }}</view>
				</picker>
			</view>

			<!-- 新增：复制结果按钮 -->
			<view class="copy-btn-container">
				<button class="copy-result-btn" @click="copyResult">
					<cl-icon type="icon-fuzhi" size="36rpx" color="#fff"></cl-icon>
					复制结果
				</button>
			</view>

		</view>

		<!-- 常用单位快捷转换 -->
		<view class="quick-conversions" v-if="quickConversions.length">
			<view class="section-title">常用转换</view>
			<view class="quick-list">
				<view v-for="(item, index) in quickConversions" :key="index" class="quick-item"
					@click="applyQuickConversion(item)">
					<text>{{ inputValue || 0 }} {{ fromUnit.label }} = </text>
					<text class="result"
						v-if="activeType === 'temperature'">{{ convertTemperature(inputValue || 0, fromUnit.value, item.value) }}</text>
					<text class="result" v-else>{{ calculateConversion(inputValue || 0, fromUnit, item) }}</text>
					<text> {{ item.label }}</text>
				</view>
			</view>
		</view>

		<!-- 历史记录 -->
		<view class="history-section" v-if="conversionHistory.length">
			<view class="section-title">历史记录</view>
			<view class="history-list">
				<view v-for="(record, index) in conversionHistory" :key="index" class="history-item">
					<!-- <text>{{ record.value }} {{ record.fromUnit.label }} → </text>
          <text class="result">{{ record.result }}</text>
          <text> {{ record.toUnit.label }}</text>
          <text class="time">{{ record.time }}</text> -->

					<view class="history-content">
						<text>{{ record.value }} {{ record.fromUnit.label }} → </text>
						<text class="result">{{ record.result }}</text>
						<text> {{ record.toUnit.label }}</text>
					</view>
					<view class="history-meta">
						<text class="time">{{ record.time }}</text>
						<view class="copy-icon" @click="copyHistory(record)">
							<cl-icon type="icon-fuzhi" size="32rpx" color="#95a5a6"></cl-icon>
						</view>
					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	// 导入数据文件
	import { allUnits } from '@/data/unitData.js';
	
	export default {
		data() {
			return {
				activeType: 'length', // 当前选中的单位类型
				inputValue: '', // 输入值
				outputValue: '', // 输出值
				fromUnit: {}, // 源单位
				toUnit: {}, // 目标单位
				conversionHistory: [], // 转换历史
				// 所有支持的单位类型[1,2](@ref)
				unitTypes: [{
						label: '长度',
						value: 'length'
					},
					{
						label: '面积',
						value: 'area'
					},
					{
						label: '体积',
						value: 'volume'
					},
					{
						label: '质量',
						value: 'mass'
					},
					{
						label: '温度',
						value: 'temperature'
					},
					{
						label: '时间',
						value: 'time'
					},
					{
						label: '速度',
						value: 'speed'
					},
					{
						label: '压力',
						value: 'pressure'
					},
					{
						label: '角度',
						value: 'angle'
					},
					{
						label: '浓度',
						value: 'concentration'
					},
					{
						label: '能量',
						value: 'energy'
					},
					{
						label: '功率',
						value: 'power'
					},
					{
						label: '数据',
						value: 'data'
					},
					{
						label: '电流',
						value: 'current'
					},
					{
						label: '电压',
						value: 'voltage'
					},
					{
						label: '亮度',
						value: 'brightness'
					},
					{
						label: '力',
						value: 'force'
					},
					{
						label: '频率',
						value: 'frequency'
					},
					{
						label: '流量',
						value: 'flow'
					},
					{
						label: '电阻',
						value: 'resistance'
					},
					{
						label: '小数',
						value: 'decimal'
					},
					{
						label: '阻尼',
						value: 'damping'
					},
				],

				// 所有单位定义[1,2,5](@ref)
				allUnits: allUnits,

				// 常用快捷转换
				quickConversions: []
			};
		},

		computed: {
			// 当前单位类型的单位列表
			currentUnits() {
				return this.allUnits[this.activeType] || [];
			}
		},

		watch: {
			// 当单位类型变化时重置单位
			activeType(newVal) {
				if (this.currentUnits.length >= 2) {
					this.fromUnit = this.currentUnits[0];
					this.toUnit = this.currentUnits[1];
					this.updateQuickConversions();
				}
				this.inputValue = '';
				this.outputValue = '';
			}
		},

		mounted() {
			// 初始化单位
			this.fromUnit = this.currentUnits[0] || {};
			this.toUnit = this.currentUnits[1] || {};
			this.updateQuickConversions();
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
					"「救命！再也不用跪求百度了！」",
					"写论文被单位搞疯？教授安利的隐藏工具！",
					"「@闺蜜 赌一杯奶茶！你绝对不知道1英尺=__厘米」",
					"「一英尺为什么是12英寸？答案惊掉下巴！」"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/unit/unit',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			// 切换单位类型
			changeUnitType(type) {
				this.activeType = type;
			},

			// 更改源单位
			changeFromUnit(e) {
				const index = e.detail.value;
				this.fromUnit = this.currentUnits[index];
				this.convertUnits('from');
			},

			// 更改目标单位
			changeToUnit(e) {
				const index = e.detail.value;
				this.toUnit = this.currentUnits[index];
				this.convertUnits('from');
				this.updateQuickConversions();
			},

			// 交换单位
			swapUnits() {
				[this.fromUnit, this.toUnit] = [this.toUnit, this.fromUnit];
				this.convertUnits('from');
			},

			// 执行单位转换[1,2](@ref)
			convertUnits(direction) {
				if (!this.inputValue) {
					this.outputValue = '';
					return;
				}

				const value = parseFloat(this.inputValue);

				// 特殊处理温度单位[1,5](@ref)
				if (this.activeType === 'temperature') {
					this.outputValue = this.convertTemperature(value, this.fromUnit.value, this.toUnit.value);
				} else {
					// 普通单位转换
					this.outputValue = this.calculateConversion(value, this.fromUnit, this.toUnit);
				}

				// 保存历史记录
				this.saveToHistory(value, this.outputValue);
			},

			// 计算普通单位转换
			calculateConversion(value, fromUnit, toUnit) {
				if (!fromUnit || !toUnit) return '';

				// 通过基准单位转换
				const baseValue = value * fromUnit.factor;
				const result = baseValue / toUnit.factor;

				// 格式化结果（最多保留8位小数）
				return result.toFixed(8).replace(/\.?0+$/, '');
			},

			convertTemperature(value, fromUnit, toUnit) {
				// 首先将所有单位统一转换为摄氏度作为中间值
				let celsius;

				// 转换为摄氏度的计算
				switch (fromUnit) {
					case 'c': // 摄氏度
						celsius = value;
						break;
					case 'f': // 华氏度
						celsius = (value - 32) * 5 / 9;
						break;
					case 'k': // 开尔文
						celsius = value - 273.15;
						break;
					case 'r': // 兰氏度
						celsius = (value - 491.67) * 5 / 9;
						break;
					case 're': // 列氏度
						celsius = value * 5 / 4;
						break;
					case 'd': // 德莱尔度
						celsius = 100 - value * 2 / 3;
						break;
					case 'n': // 牛顿温标
						celsius = value * 100 / 33;
						break;
					case 'ro': // 罗默度
						celsius = (value - 7.5) * 40 / 21;
						break;
					default:
						return ''; // 不支持的单位
				}

				// 确保数值类型
				celsius = Number(celsius);

				// 从摄氏度转换到目标单位
				switch (toUnit) {
					case 'c': // 摄氏度
						return celsius.toFixed(4);
					case 'f': // 华氏度
						return (celsius * 9 / 5 + 32).toFixed(4);
					case 'k': // 开尔文
						return (celsius + 273.15).toFixed(4);
					case 'r': // 兰氏度
						return (celsius * 9 / 5 + 491.67).toFixed(4);
					case 're': // 列氏度
						return (celsius * 4 / 5).toFixed(4);
					case 'd': // 德莱尔度
						return ((100 - celsius) * 3 / 2).toFixed(4);
					case 'n': // 牛顿温标
						return (celsius * 33 / 100).toFixed(4);
					case 'ro': // 罗默度
						return (celsius * 21 / 40 + 7.5).toFixed(4);
					default:
						return ''; // 不支持的单位
				}
			},

			// 更新常用转换列表
			updateQuickConversions() {
				if (!this.currentUnits.length) return;

				// 获取当前单位类型的热门转换单位（排除已选单位）
				const popularUnits = {
					length: ['km', 'cm', 'in', 'li'],
					area: ['m2', 'ha', 'ac'],
					temperature: ['c', 'f', 'r', 'n'],
					mass: ['g', 'kg', 'jin'],
					time: ['s', 'min', 'h', 'd'],
					speed: ['kmps', 'lih', 'mach', 'mps'],
					angle: ['deg', 'rad', 'gon'],
					current: ['mA', 'kA', 'A', 'abA'],
					data: ['MB', 'GB', 'KB', 'B'],
					voltage: ['V', 'kV', 'mV', 'abV'],
					power: ['W', 'kW', 'MW'],
					volume: ['m3', 'L', 'shi']
					// 其他类型的常用单位...
				};

				// 优先选择当前类型的常用单位
				const popularForType = popularUnits[this.activeType] || [];
				this.quickConversions = this.currentUnits
					.filter(unit =>
						unit.value !== this.fromUnit.value &&
						unit.value !== this.toUnit.value &&
						(popularForType.includes(unit.value) || this.currentUnits.length < 4)
					)
					.slice(0, 3);
			},

			// 应用快捷转换
			applyQuickConversion(item) {
				this.toUnit = item.unit;
				this.convertUnits('from');
			},

			// 保存到历史记录
			saveToHistory(inputValue, outputValue) {
				const now = new Date();
				const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

				this.conversionHistory.unshift({
					value: inputValue,
					result: outputValue,
					fromUnit: this.fromUnit,
					toUnit: this.toUnit,
					time: timeStr
				});

				// 最多保留10条记录
				if (this.conversionHistory.length > 10) {
					this.conversionHistory.pop();
				}
			},
			// 复制结果方法
			copyResult() {
				// const result = `${this.inputValue || 0} ${this.fromUnit.label} = ${this.outputValue} ${this.toUnit.label}`;
				const result = `${this.outputValue}`;
				uni.setClipboardData({
					data: result,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						});
					}
				});
			},

			// 复制历史记录方法
			copyHistory(record) {
				const text = `${record.value} ${record.fromUnit.label} → ${record.result} ${record.toUnit.label}`;
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						});
					}
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	/* 全局样式 */
	page {
		background-color: #f5f7fa;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
		padding: 0;
		color: #333;
	}

	.container {
		padding: 20rpx 30rpx 60rpx;
		max-width: 750rpx;
		margin: 0 auto;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);
	}

	/* 头部样式 */
	.header {
		text-align: center;
		padding: 40rpx 0 30rpx;
	}

	.title {
		font-size: 44rpx;
		font-weight: bold;
		color: #2c3e50;
		display: block;
	}

	.subtitle {
		font-size: 26rpx;
		color: #7f8c8d;
		display: block;
		margin-top: 10rpx;
	}

	/* 单位类型选择 */
	.unit-type-selector {
		background: white;
		border-radius: 16rpx;
		padding: 20rpx 0;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.scroll-view {
		white-space: nowrap;
		width: 100%;
	}

	.type-item {
		display: inline-block;
		padding: 12rpx 28rpx;
		margin: 0 10rpx;
		border-radius: 30rpx;
		font-size: 28rpx;
		background-color: #f1f2f6;
		color: #7f8c8d;
	}

	.type-item.active {
		background-color: #3498db;
		color: white;
		font-weight: 500;
	}

	/* 转换区域 */
	.conversion-area {
		background: white;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		margin-bottom: 30rpx;
	}

	.input-group {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		border: 1rpx solid #e0e0e0;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.input-field {
		flex: 1;
		height: 90rpx;
		padding: 0 30rpx;
		font-size: 36rpx;
	}

	.unit-picker {
		width: 220rpx;
		height: 90rpx;
		background-color: #f8f9fa;
		display: flex;
		align-items: center;
		justify-content: center;
		border-left: 1rpx solid #e0e0e0;
	}

	.picker-text {
		font-size: 32rpx;
		color: #3498db;
		padding: 0 20rpx;
	}

	.conversion-arrow {
		display: flex;
		justify-content: center;
		margin: 20rpx 0;
	}

	.swap-icon {
		width: 50rpx;
		height: 50rpx;
	}

	/* 快速转换和历史记录 */
	.section-title {
		font-size: 30rpx;
		font-weight: 500;
		color: #2c3e50;
		margin-bottom: 20rpx;
		padding-left: 10rpx;
		border-left: 6rpx solid #3498db;
	}

	.quick-conversions,
	.history-section {
		background: white;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		margin-bottom: 30rpx;
	}

	.quick-list,
	.history-list {
		border-radius: 12rpx;
		overflow: hidden;
	}

	.quick-item,
	.history-item {
		padding: 24rpx 30rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 30rpx;
	}

	.quick-item:last-child,
	.history-item:last-child {
		border-bottom: none;
	}

	.quick-item .result {
		font-weight: bold;
		color: #e74c3c;
		margin: 0 6rpx;
	}

	.history-item .result {
		font-weight: bold;
		color: #27ae60;
		margin: 0 6rpx;
	}

	.history-item .time {
		float: right;
		color: #95a5a6;
		font-size: 26rpx;
	}


	/* 结果字段增加背景色 */
	.result-field {
		background-color: #f8fafd;
	}

	/* 复制按钮容器 */
	.copy-btn-container {
		display: flex;
		justify-content: center;
		margin-top: 40rpx;
	}

	.copy-result-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 300rpx;
		height: 85rpx;
		font-size: 32rpx;
		font-weight: 500;
		background: linear-gradient(135deg, #3498db, #2a80b9);
		color: white;
		border-radius: 50rpx;
		box-shadow: 0 8rpx 20rpx rgba(52, 152, 219, 0.3);
		transition: all 0.2s ease;

		&:active {
			transform: translateY(4rpx);
			box-shadow: 0 4rpx 10rpx rgba(52, 152, 219, 0.3);
		}

		.cl-icon {
			margin-right: 15rpx;
		}
	}

	/* 历史记录布局优化 */
	.history-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.history-content {
		flex: 1;
	}

	.history-meta {
		display: flex;
		align-items: center;
	}

	.copy-icon {
		width: 66rpx;
		height: 66rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 20rpx;
		border-radius: 50%;
		background-color: #f5f7fa;
		transition: all 0.3s ease;

		&:active {
			background-color: #e5f0fa;
			transform: scale(0.95);
		}
	}

	/* 结果高亮色 */
	.result {
		font-weight: bold;
		color: #e74c3c !important;
		/* 更显眼的红色 */
	}

	/* 转换区域增加边框轮廓 */
	.conversion-area {
		border: 1rpx solid rgba(52, 152, 219, 0.1);
	}
</style>