<template>
	<view class="container">
		<!-- 历史介绍模块 -->
		<view class="section">
			<view class="section-header">大写数字</view>
			<view class="section-content history-text">
				大写数字是中国特有的数字书写方式，利用与数字同音的汉字取代数字以防止涂改。
				据考证始于武则天时期，经朱元璋完善并沿用至今。
			</view>
		</view>

		<!-- 数字对照表 -->
		<view class="section">
			<view class="section-header">标准对照表</view>
			<view class="section-content">
				<view class="table-container">
					<view v-for="(item, index) in numList" :key="index" class="table-cell">
						<text class="digit-digit">{{ item.digit }}</text>
						<text class="digit-cn">{{ item.cn }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 转换器界面 -->
		<view class="section">
			<view class="section-header">金额转换器</view>
			<view class="section-content">
				<textarea class="text-box" :value="content" @input="handleInput" 
					:placeholder="placeholderText" auto-height />
				<text class="input-tip" v-if="showWarning">提示：最大支持15位整数，4位小数</text>
				<view class="action-group">
					<button class="primary-btn" type="primary" @click="convert">立即转换</button>
					<button class="btn-warning" type="default" @click="clear">清空输入</button>
				</view>
			</view>
		</view>

		<!-- 结果展示 -->
		<view class="section">
			<view class="section-header">转换结果</view>
			<view class="section-content">
				<textarea class="text-box" :value="result" readonly placeholder="大写金额将显示在此处" />
				<view class="action-bar">
					<button class="btn-secondary" type="primary" size="mini" @click="copy">复制结果</button>
					<button class="btn-info" open-type="share" type="default" size="mini" @click="share">分享结果</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
				result: '',
				showWarning: false, // 显示长度警告
				placeholderText: '请输入阿拉伯数字（如：1234.56）',
				// 标准数字对照表
				numList: [
					{ digit: '0', cn: '零' }, { digit: '1', cn: '壹' }, { digit: '2', cn: '贰' },
					{ digit: '3', cn: '叁' }, { digit: '4', cn: '肆' }, { digit: '5', cn: '伍' },
					{ digit: '6', cn: '陆' }, { digit: '7', cn: '柒' }, { digit: '8', cn: '捌' },
					{ digit: '9', cn: '玖' }, { digit: '10', cn: '拾' }, { digit: '100', cn: '佰' },
					{ digit: '1000', cn: '仟' }, { digit: '万', cn: '万' }, { digit: '亿', cn: '亿' }
				]
			};
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
					"🧾「还在手写发票大写金额？「肆佰贰拾捌元整」写错一行重来？",
					"报销单：自动生成「（大写）叁仟捌佰元整」"
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
			
			// 输入处理（带格式和长度验证）
			handleInput(e) {
				let value = e.detail.value;
				this.showWarning = false;
				
				// 验证并规范化输入
				const validated = this.validateAmountInput(value);
				
				// 处理超出范围情况
				if (validated !== value) {
					this.showWarning = true;
					this.content = validated;
					uni.showToast({
						title: '超出最大范围，已自动截断',
						icon: 'none',
						duration: 2000
					});
				} else {
					this.content = value;
				}
				
				// 只有有效数字才尝试转换
				if (/^-?\d*\.?\d*$/.test(this.content)) {
					this.result = this.convertToCnMoney(this.content);
				}
			},
			
			// 验证金额输入格式和长度
			validateAmountInput(input) {
				// 移除非法字符（只保留数字和小数点）
				let newValue = input.replace(/[^\d\.]/g, '');
				
				// 处理多个小数点的情况
				if ((newValue.match(/\./g) || []).length > 1) {
					const parts = newValue.split('.');
					newValue = parts[0] + '.' + parts.slice(1).join('');
				}
				
				// 处理整数部分和小数部分
				const parts = newValue.split('.');
				const integerPart = parts[0].replace(/^0+(\d)/, '$1').substr(0, 15); // 限制15位整数
				let decimalPart = parts[1] ? parts[1].substr(0, 4) : ''; // 限制4位小数
				
				// 重新组合值
				return integerPart + (decimalPart ? '.' + decimalPart : '');
			},
			
			// 执行转换
			convert() {
				if (!this.content) {
					uni.showToast({
						title: '请输入数字内容',
						icon: 'none'
					});
					return;
				}
				
				this.result = this.convertToCnMoney(this.content);
				
				if (this.result && !this.result.includes('超出最大处理范围')) {
					uni.showToast({
						title: '转换成功',
						icon: 'success'
					});
				}
			},
			
			convertToCnMoney(money){
				// 空值处理
				if (money === '' || money === '.') return '';
				
				// 汉字的数字
				var cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
				// 基本单位
				var cnIntRadice = ['', '拾', '佰', '仟'];
				// 对应整数部分扩展单位
				var cnIntUnits = ['', '万', '亿', '兆'];
				// 对应小数部分单位
				var cnDecUnits = ['角', '分', '毫', '厘'];
				// 整数金额时后面跟的字符
				var cnInteger = '整';
				// 整型完以后的单位
				var cnIntLast = '圆';
				// 最大处理的数字
				var maxNum = 999999999999999.9999; // 15位整数 + 4位小数
				
				let parsedMoney = parseFloat(money);
				
				// 处理数值过大情况
				if (Math.abs(parsedMoney) > maxNum) {
					return '超出最大处理范围';
				}
				
				// 归零处理
				if (parsedMoney === 0) {
					return cnNums[0] + cnIntLast + cnInteger;
				}
				
				// 转换为字符串
				money = Math.abs(parsedMoney).toString();
				let integerNum = '';
				let decimalNum = '';
				let parts;
				
				// 分离整数和小数部分
				if (money.indexOf('.') === -1) {
					integerNum = money;
				} else {
					parts = money.split('.');
					integerNum = parts[0];
					decimalNum = parts[1].substr(0, 4); // 只取前4位小数
				}
				
				let chineseStr = '';
				let zeroCount = 0;
				
				// 处理整数部分
				if (integerNum && parseInt(integerNum, 10) > 0) {
					for (let i = 0; i < integerNum.length; i++) {
						const n = integerNum[i];
						const p = integerNum.length - i - 1;
						const q = Math.floor(p / 4);
						const m = p % 4;
						
						if (n === '0') {
							zeroCount++;
						} else {
							if (zeroCount > 0) {
								chineseStr += cnNums[0];
								zeroCount = 0;
							}
							chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
						}
						
						if (m === 0 && zeroCount < 4) {
							chineseStr += cnIntUnits[q];
						}
					}
					chineseStr += cnIntLast;
				}
				
				// 处理小数部分
				if (decimalNum) {
					for (let i = 0; i < decimalNum.length; i++) {
						const n = decimalNum[i];
						if (n !== '0') {
							chineseStr += cnNums[parseInt(n)] + cnDecUnits[i];
						}
					}
				} else if (chineseStr === '') {
					// 处理0.XXX的情况
					if (parsedMoney > 0) {
						chineseStr = cnNums[0] + cnIntLast + cnNums[0] + cnDecUnits[0]; // 零元零角
					}
				}
				
				// 添加"整"的尾注
				if (!decimalNum || decimalNum.length === 0 || decimalNum.match(/^0+$/)) {
					chineseStr += cnInteger;
				}
				
				// 处理负数
				if (parsedMoney < 0) {
					chineseStr = '负' + chineseStr;
				}
				
				return chineseStr;
			},
			
			// 复制结果
			copy() {
				if (!this.result) return;
				uni.setClipboardData({
					data: this.result,
					success: () => {
						uni.showToast({
							title: '已复制到剪贴板',
							icon: 'success'
						});
					}
				});
			},
			
			// 清空内容
			clear() {
				this.content = '';
				this.result = '';
				this.showWarning = false;
			},
			
			// 分享功能
			share() {
				if (!this.result) {
					uni.showToast({
						title: '请先转换金额',
						icon: 'none'
					});
					return;
				}
				
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 0,
					title: "金额大写转换结果",
					summary: `转换结果：${this.result}`,
					success: () => uni.showToast({
						title: "分享成功"
					}),
					fail: () => uni.showToast({
						title: "分享失败",
						icon: "none"
					})
				});
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

	.section-header {
		padding: 20rpx 30rpx;
		background: #f5f5f5;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		border-bottom: 1px solid #eee;
	}

	.section-content {
		padding: 30rpx;
	}

	.history-text {
		font-size: 28rpx;
		line-height: 48rpx;
		color: #555;
	}

	.table-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20rpx;
	}

	.table-cell {
		border: 1px solid #eee;
		border-radius: $border-radius;
		padding: 20rpx;
		text-align: center;
		background: #f9f9f9;
	}

	.digit-digit {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.digit-cn {
		display: block;
		margin-top: 10rpx;
		font-size: 28rpx;
		color: $primary-color;
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

	.action-group {
		display: flex;
		justify-content: space-between;

		button {
			flex: 1;
			margin-right: 15rpx;

			&:last-child {
				margin-right: 0;
			}
		}
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

	/* 新增输入提示样式 */
	.input-tip {
		display: block;
		font-size: 24rpx;
		color: #e74c3c;
		margin-top: -20rpx;
		margin-bottom: 20rpx;
		text-align: right;
	}
</style>