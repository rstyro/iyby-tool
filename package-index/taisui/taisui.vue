<template>
	<view class="tai-sui-container">
		<!-- 顶部标题区 -->
		<view class="header">
			<view class="header-bg"></view>
			<text class="header-title">太岁信息查询</text>
			<text class="header-subtitle">传统干支命理参考 · 民俗文化科普</text>
		</view>

		<!-- 查询区 -->
		<view class="query-card">
			<view class="input-group">
				<text class="label">查询年份</text>
				<view class="input-wrap" :class="{ 'input-focus': inputFocus }">
					<input v-model="inputYear" type="number" placeholder="请输入年份（如2025）" class="year-input"
						@focus="inputFocus = true" @blur="handleInputBlur" @confirm="queryTaiSui"
						@input="handleYearInput" />
				</view>
			</view>

			<!-- 快捷年份：当前年前后2年 -->
			<view class="shortcut-years">
				<text class="shortcut-btn" v-for="(year, index) in shortcutYears" :key="index"
					@click="selectShortcutYear(year)" :class="{ 'active': inputYear === year }">
					{{ year }}
				</text>
			</view>

			<button class="query-btn" @click="queryTaiSui" :disabled="isQuerying">
				<text class="btn-text">{{ isQuerying ? '查询中...' : '立即查询' }}</text>
			</button>
		</view>

		<!-- 优化后的结果展示区 -->
		<view class="result-card" v-if="taiSuiList.length > 0"
			:style="{ opacity: showResult ? 1 : 0, transform: showResult ? 'translateY(0)' : 'translateY(20rpx)' }">
			<view class="result-header">
				<text class="result-title">
					{{ yearText }}年
					<text class="zodiac-icon">{{ yearZodiac && yearZodiac.icon ? yearZodiac.icon : '🐾' }}</text>
					（{{ ganZhi ? ganZhi : '--' }}）太岁信息
				</text>
				<text class="tips-text">以下建议为传统民俗文化参考，非迷信哦~</text>
				<view class="divider"></view>
			</view>

			<!-- 年份生肖信息移到前面 -->
			<view class="year-summary">
				<view class="summary-card">
					<text class="summary-title">{{ yearText }}年</text>
					<view class="summary-content">
						<text class="summary-ganzhi">{{ ganZhi }}</text>
						<text class="summary-zodiac">{{ yearZodiac.name }}{{ yearZodiac.icon }}</text>
					</view>
					<text class="summary-tip">该年生肖为{{ yearZodiac.name }}，与太岁信息相关</text>
				</view>
			</view>

			<!-- 分组展示 -->
			<view class="result-groups">
				<!-- 凶煞类太岁 -->
				<view class="group-section negative-section">
					<view class="section-header">
						<cl-icon type="icon-info" color="#FF9F1C"/>
						<text class="section-title">需注意的太岁</text>
						<text class="section-subtitle">值、冲、害、刑、破</text>
					</view>
					
					<view class="vertical-columns">
						<view class="column-item negative-item" v-for="(item, index) in badTaiSuiList" :key="index">
							<view class="item-header">
								<!-- 统一圆形图标 -->
								<view class="item-type-icon" :style="{ backgroundColor: getTypeColor(item) }"></view>
								<!-- 类型名称和生肖同一行，左右布局 -->
								<view class="type-zodiac-row">
									<text class="item-type-name">{{ getTypeShortName(item) }}</text>
									<view class="zodiacs-list">
										<text class="zodiac-item" v-for="(zodiacStr, idx) in parseZodiacsFromDesc(item)" :key="idx">
											{{ zodiacStr }}
										</text>
									</view>
								</view>
							</view>
							
							<!-- 化解建议：每点一行 -->
							<view class="item-advice">
								<text class="advice-title">化解建议</text>
								<view class="advice-content">
									<text class="advice-point" v-for="(point, idx) in splitAdvice(getTaiSuiAdvice(item))" :key="idx">
										{{ point }}
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 吉象类太岁 -->
				<view class="group-section positive-section">
					<view class="section-header">
						<text class="section-icon">✨</text>
						<text class="section-title">吉象太岁</text>
						<text class="section-subtitle">六合、三合</text>
					</view>
					
					<view class="vertical-columns">
						<view class="column-item positive-item" v-for="(item, index) in goodTaiSuiList" :key="index">
							<view class="item-header">
								<!-- 统一圆形图标 -->
								<view class="item-type-icon" :style="{ backgroundColor: getTypeColor(item) }"></view>
								<!-- 类型名称和生肖同一行，左右布局 -->
								<view class="type-zodiac-row">
									<text class="item-type-name">{{ getTypeShortName(item) }}</text>
									<view class="zodiacs-list">
										<text class="zodiac-item" v-for="(zodiacStr, idx) in parseZodiacsFromDesc(item)" :key="idx">
											{{ zodiacStr }}
										</text>
									</view>
								</view>
							</view>
							
							<!-- 吉祥参考：每点一行 -->
							<view class="item-advice">
								<text class="advice-title">吉象锦囊</text>
								<view class="advice-content">
									<text class="advice-point" v-for="(point, idx) in splitAdvice(getTaiSuiAdvice(item))" :key="idx">
										{{ point }}
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态/错误提示 -->
		<view class="empty-tip" v-if="hasQuery && taiSuiList.length === 0">
			<text class="empty-icon">📅</text>
			<text class="empty-text">{{ errorMsg || CONSTS.TIPS.EMPTY_RESULT }}</text>
		</view>
	</view>
</template>

<script>
	import taiSuiUtils from '@/common/taiSuiUtils.js';

	// 常量定义
	const CONSTS = {
		// 太岁类型映射
		TAI_SUI_TYPE_MAP: {
			'值太岁（本命年）': { shortName: '值太岁', color: '#C41E3A', className: 'item-zhi' },
			'冲太岁': { shortName: '冲太岁', color: '#C41E3A', className: 'item-chong' },
			'害太岁': { shortName: '害太岁', color: '#C41E3A', className: 'item-hai' },
			'刑太岁': { shortName: '刑太岁', color: '#C41E3A', className: 'item-xing' },
			'破太岁': { shortName: '破太岁', color: '#C41E3A', className: 'item-po' },
			'六合太岁': { shortName: '六合', color: '#2E8B57', className: 'item-he' },
			'三合太岁': { shortName: '三合', color: '#2E8B57', className: 'item-he' }
		},
		// 提示文本
		TIPS: {
			EMPTY_RESULT: '暂无查询结果，请输入有效年份',
			QUERY_FAILED: '查询失败，请重试',
			DEFAULT_ADVICE: '保持平常心，万事顺意~'
		}
	};

	export default {
		name: 'TaiSuiQuery',
		data() {
			const currentYear = new Date().getFullYear();
			return {
				inputYear: currentYear,
				yearText: currentYear,
				maxYear: 1000000,
				taiSuiList: [],
				badTaiSuiList: [],
				goodTaiSuiList: [],
				ganZhi: '',
				inputFocus: false,
				showResult: false,
				hasQuery: false,
				errorMsg: '',
				shortcutYears: [
					currentYear - 2,
					currentYear - 1,
					currentYear,
					currentYear + 1,
					currentYear + 2
				],
				yearZodiac: null,
				isQuerying: false,
				queryTimer: null,
				CONSTS, // 导出常量
				taiSuiAdviceMap: {
					'值太岁（本命年）': '1. 可穿着红色系衣物（如红内衣、红袜子）讨个好彩头；2. 行事稳扎稳打，遇事别冲动，凡事多思虑；3. 年初可按民俗拜太岁祈福（仅作文化参考）',
					'冲太岁': '1. 遇事多换位思考、主动沟通，避免与人起争执；2. 出行多注意安全，非必要减少长途远行；3. 保持心态平和，为人处世留有余地',
					'害太岁': '1. 交友多留心，远离是非圈，避免口舌纷争；2. 理财以稳健保守为主，不盲目跟风投资；3. 日常多做力所能及的善事，积善积德',
					'刑太岁': '1. 谨言慎行，避免与人发生纠纷，凡事遵纪守法；2. 健康上多关注肠胃、关节等部位，规律作息饮食；3. 维系好家庭和睦，少计较个人得失',
					'破太岁': '1. 减少非必要大额消费，投资需谨慎，谨防破财；2. 感情里多包容理解，及时化解小矛盾；3. 定期做健康体检，日常多注意安全，防范意外',
					'六合太岁': '1. 把握好贵人运，多主动与人合作共赢；2. 适合拓展事业版图或学习新技能，提升自己；3. 做事顺势而为，能起到事半功倍的效果',
					'三合太岁': '1. 多和与自己生肖三合的人相处，借势增运；2. 适合出行拓展视野或尝试轻创业，整体运势向好；3. 保持积极乐观的心态，能让好运加倍'
				}
			};
		},
		methods: {
			/**
			 * 拆分建议文本为多行（按数字序号分割）
			 */
			splitAdvice(adviceText) {
				if (!adviceText || adviceText === CONSTS.TIPS.DEFAULT_ADVICE) {
					return [adviceText];
				}
				// 按数字序号分割，如 "1. xxx；2. yyy；3. zzz"
				return adviceText.split(/；\s*(?=\d+\.)/).filter(item => item.trim()).map(item => item.trim());
			},
			
			/**
			 * 从desc中解析出生肖列表（处理多个生肖情况）
			 */
			parseZodiacsFromDesc(item) {
				if (!item || !item.desc) return [];
				
				try {
					// 找到desc中冒号后的内容
					const colonIndex = item.desc.indexOf('：');
					if (colonIndex === -1) return [];
					
					const zodiacsPart = item.desc.substring(colonIndex + 1);
					
					// 按顿号分割多个生肖
					return zodiacsPart.split('、').filter(z => z.trim()).map(z => z.trim());
				} catch (e) {
					console.error('解析生肖出错:', e);
					return [item.desc];
				}
			},
			
			/**
			 * 获取太岁化解建议
			 */
			getTaiSuiAdvice(item) {
				if (!item || !item.type || !item.type.desc) return CONSTS.TIPS.DEFAULT_ADVICE;
				return this.taiSuiAdviceMap[item.type.desc] || CONSTS.TIPS.DEFAULT_ADVICE;
			},
			
			/**
			 * 获取太岁类型简称
			 */
			getTypeShortName(item) {
				if (!item || !item.type || !item.type.desc) return '太岁';
				const typeInfo = CONSTS.TAI_SUI_TYPE_MAP[item.type.desc];
				return typeInfo ? typeInfo.shortName : '太岁';
			},
			
			/**
			 * 获取太岁类型颜色
			 */
			getTypeColor(item) {
				if (!item || !item.type || !item.type.desc) return '#C41E3A';
				const typeInfo = CONSTS.TAI_SUI_TYPE_MAP[item.type.desc];
				return typeInfo ? typeInfo.color : '#C41E3A';
			},
			
			/**
			 * 年份输入处理
			 */
			handleYearInput(e) {
				try {
					const val = e.detail.value ? e.detail.value.toString().trim() : '';
					const numVal = val.replace(/\D/g, '');
					this.inputYear = Number(numVal);
					const currentYear = new Date().getFullYear();
					
					if (this.inputYear > this.maxYear && currentYear < this.maxYear) {
						this.errorMsg = '请输入有效的年份数字如:' + currentYear;
						uni.showToast({
							title: this.errorMsg,
							icon: 'none',
							duration: 2000
						});
						this.inputYear = currentYear;
						return;
					}
				} catch (err) {
					console.error('年份输入处理异常：', err);
				}
			},

			/**
			 * 输入框失焦处理
			 */
			handleInputBlur() {
				this.inputFocus = false;
				const currentYear = new Date().getFullYear();
				if (!this.inputYear || isNaN(Number(this.inputYear))) {
					this.inputYear = currentYear;
				}
			},

			/**
			 * 选择快捷年份
			 */
			selectShortcutYear(year) {
				if (this.isQuerying) return;
				this.inputYear = year;
				this.queryTaiSui();
			},

			/**
			 * 核心查询方法
			 */
			queryTaiSui() {
				if (this.queryTimer) clearTimeout(this.queryTimer);

				this.queryTimer = setTimeout(() => {
					if (!this.inputYear || isNaN(Number(this.inputYear))) {
						this.errorMsg = '请输入有效的年份数字（如2025）';
						uni.showToast({
							title: this.errorMsg,
							icon: 'none',
							duration: 2000
						});
						return;
					}

					this.isQuerying = true;
					this.hasQuery = true;
					this.taiSuiList = [];
					this.badTaiSuiList = [];
					this.goodTaiSuiList = [];
					this.ganZhi = '';
					this.yearZodiac = null;
					this.errorMsg = '';
					this.showResult = false;

					try {
						const yearNum = Number(this.inputYear);
						this.yearText = yearNum;
						this.yearZodiac = taiSuiUtils.getZodiacByYear ? taiSuiUtils.getZodiacByYear(yearNum) : null;
						this.ganZhi = taiSuiUtils.getYearGanZhi ? taiSuiUtils.getYearGanZhi(yearNum) : '';
						this.taiSuiList = taiSuiUtils.getTaiSuiInfoByYear ? taiSuiUtils.getTaiSuiInfoByYear(yearNum) : [];
						
						// 将太岁结果分为凶煞类和吉象类
						this.badTaiSuiList = this.taiSuiList.filter(item => {
							const desc = item.type.desc;
							return desc === '值太岁（本命年）' || desc === '冲太岁' || 
								   desc === '害太岁' || desc === '刑太岁' || desc === '破太岁';
						});
						
						this.goodTaiSuiList = this.taiSuiList.filter(item => {
							const desc = item.type.desc;
							return desc === '六合太岁' || desc === '三合太岁';
						});

						setTimeout(() => {
							this.showResult = true;
						}, 100);

					} catch (err) {
						console.error('查询太岁信息异常：', err);
						this.errorMsg = CONSTS.TIPS.QUERY_FAILED;
						uni.showToast({
							title: this.errorMsg,
							icon: 'none',
							duration: 2000
						});
					} finally {
						this.isQuerying = false;
					}
				}, 200);
			}
		},
		onLoad() {
			this.queryTaiSui();
		},
		onUnload() {
			if (this.queryTimer) clearTimeout(this.queryTimer);
		}
	};
</script>

<style scoped lang="scss">
	// 全局容器
	.tai-sui-container {
		min-height: 100vh;
		background: linear-gradient(to bottom, #faf8f5, #f5f0eb);
		padding: 30rpx 24rpx;
		box-sizing: border-box;
	}

	// 顶部标题区保持不变
	.header {
		position: relative;
		padding: 60rpx 32rpx 40rpx;
		text-align: center;
		overflow: hidden;
		margin: -30rpx -24rpx 40rpx -24rpx;

		.header-bg {
			position: absolute;
			top: -175rpx;
			left: -50rpx;
			right: -50rpx;
			height: 400rpx;
			background: linear-gradient(135deg, #C41E3A 0%, #E63946 100%);
			border-radius: 0 0 50% 50%;
			opacity: 0.9;
		}

		.header-title {
			position: relative;
			font-size: 52rpx;
			font-weight: 700;
			color: #fff;
			text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
			letter-spacing: 2rpx;
			display: block;
			margin-bottom: 16rpx;
		}

		.header-subtitle {
			position: relative;
			font-size: 26rpx;
			color: rgba(255, 255, 255, 0.9);
			letter-spacing: 1rpx;
			font-weight: 300;
		}
	}

	// 查询卡片保持不变
	.query-card {
		background: #fff;
		border-radius: 20rpx;
		padding: 40rpx 32rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
		margin-bottom: 30rpx;
		transition: all 0.3s ease;

		.input-group {
			margin-bottom: 30rpx;

			.label {
				font-size: 28rpx;
				color: #333;
				font-weight: 600;
				display: block;
				margin-bottom: 12rpx;
			}

			.input-wrap {
				border: 2rpx solid #eee;
				border-radius: 12rpx;
				transition: all 0.3s ease;

				&.input-focus {
					border-color: #C41E3A;
					box-shadow: 0 0 0 4rpx rgba(196, 30, 58, 0.1);
				}

				.year-input {
					width: 100%;
					height: 88rpx;
					padding: 0 24rpx;
					font-size: 32rpx;
					color: #333;
					box-sizing: border-box;
					background: transparent;
					border: none;
					outline: none;
				}
			}
		}

		.shortcut-years {
			display: flex;
			gap: 16rpx;
			margin-bottom: 36rpx;
			flex-wrap: wrap;

			.shortcut-btn {
				padding: 16rpx 24rpx;
				background: #f5f5f5;
				border-radius: 10rpx;
				font-size: 26rpx;
				color: #666;
				transition: all 0.2s ease;

				&.active {
					background: #C41E3A;
					color: #fff;
				}

				&:active:not(.active) {
					background: #C41E3A;
					color: #fff;
					transform: scale(0.95);
				}
			}
		}

		.query-btn {
			width: 100%;
			height: 96rpx;
			line-height: 96rpx;
			background: linear-gradient(to right, #C41E3A, #E63946);
			border-radius: 12rpx;
			border: none;
			box-shadow: 0 8rpx 16rpx rgba(196, 30, 58, 0.2);
			transition: all 0.3s ease;
			opacity: 1;

			&:disabled {
				opacity: 0.7;
				background: #ccc;
				box-shadow: none;
			}

			.btn-text {
				font-size: 32rpx;
				color: #fff;
				font-weight: 600;
				letter-spacing: 4rpx;
			}

			&:active:not(:disabled) {
				transform: translateY(4rpx);
				box-shadow: 0 4rpx 8rpx rgba(196, 30, 58, 0.2);
			}
		}
	}

	// 优化后的结果卡片
	.result-card {
		background: #fff;
		border-radius: 20rpx;
		padding: 40rpx 32rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
		transition: all 0.5s ease;
		opacity: 0;
		transform: translateY(20rpx);

		.result-header {
			margin-bottom: 40rpx;

			.result-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
				display: block;
				margin-bottom: 8rpx;

				.zodiac-icon {
					font-size: 36rpx;
					margin: 0 8rpx;
					vertical-align: middle;
				}
			}

			.tips-text {
				font-size: 22rpx;
				color: #999;
				display: block;
				margin-bottom: 16rpx;
				line-height: 1.4;
			}

			.divider {
				height: 2rpx;
				background: linear-gradient(to right, transparent, #C41E3A, transparent);
				width: 100%;
			}
		}

		// 年份生肖信息移到前面
		.year-summary {
			margin-bottom: 40rpx;

			.summary-card {
				background: linear-gradient(135deg, #f8f9fa, #e9ecef);
				border-radius: 16rpx;
				padding: 32rpx;
				text-align: center;
				border: 2rpx solid rgba(196, 30, 58, 0.1);

				.summary-title {
					font-size: 28rpx;
					font-weight: 700;
					color: #C41E3A;
					display: block;
					margin-bottom: 16rpx;
				}

				.summary-content {
					display: flex;
					justify-content: center;
					align-items: center;
					gap: 24rpx;
					margin-bottom: 16rpx;

					.summary-ganzhi {
						font-size: 32rpx;
						font-weight: 700;
						color: #333;
					}

					.summary-zodiac {
						font-size: 32rpx;
						font-weight: 700;
						color: #2E8B57;
					}
				}

				.summary-tip {
					font-size: 24rpx;
					color: #999;
					display: block;
				}
			}
		}

		// 分组容器
		.result-groups {
			display: flex;
			flex-direction: column;
			gap: 40rpx;

			// 分组区域
			.group-section {
				.section-header {
					display: flex;
					align-items: center;
					gap: 12rpx;
					margin-bottom: 24rpx;
					padding: 20rpx 24rpx;
					border-radius: 16rpx;
					background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));

					.section-icon {
						font-size: 36rpx;
					}

					.section-title {
						font-size: 28rpx;
						font-weight: 700;
						color: #333;
					}

					.section-subtitle {
						font-size: 24rpx;
						color: #999;
						margin-left: auto;
					}
				}

				// 竖行柱状布局
				.vertical-columns {
					display: flex;
					flex-direction: column;
					gap: 20rpx;

					.column-item {
						border-radius: 16rpx;
						padding: 24rpx;
						transition: all 0.3s ease;
						position: relative;
						overflow: hidden;

						// 共通样式
						.item-header {
							display: flex;
							align-items: flex-start;
							gap: 16rpx;
							margin-bottom: 20rpx;

							// 统一圆形图标
							.item-type-icon {
								width: 40rpx;
								height: 40rpx;
								border-radius: 50%;
								flex-shrink: 0;
								margin-top: 4rpx;
							}

							// 类型名称和生肖同一行布局
							.type-zodiac-row {
								flex: 1;
								display: flex;
								justify-content: space-between;
								align-items: center;
								gap: 16rpx;
								
								.item-type-name {
									font-size: 28rpx;
									font-weight: 700;
									color: #333;
									flex-shrink: 0;
								}

								// 生肖列表样式（支持多个生肖）
								.zodiacs-list {
									display: flex;
									flex-wrap: wrap;
									justify-content: flex-end;
									gap: 12rpx;
									flex: 1;
									
									.zodiac-item {
										font-size: 24rpx;
										color: #666;
										padding: 4rpx 10rpx;
										background: rgba(255, 255, 255, 0.9);
										border-radius: 6rpx;
										border: 1rpx solid rgba(0, 0, 0, 0.1);
										white-space: nowrap;
									}
								}
							}
						}

						.item-advice {
							.advice-title {
								display: block;
								font-size: 24rpx;
								color: #999;
								margin-bottom: 12rpx;
								font-weight: 500;
							}

							.advice-content {
								background: rgba(255, 255, 255, 0.7);
								border-radius: 12rpx;
								padding: 20rpx;
							}

							// 化解建议点：每点一行（去掉伪元素）
							.advice-point {
								font-size: 26rpx;
								color: #333;
								line-height: 1.6;
								display: block;
								margin-bottom: 10rpx;
								
								&:last-child {
									margin-bottom: 0;
								}
							}
						}
					}
				}
			}

			// 凶煞类样式（统一红色系）
			.negative-section {
				.section-header {
					background: linear-gradient(135deg, rgba(255, 245, 245, 0.9), rgba(255, 240, 240, 0.7));
					border-left: 8rpx solid #C41E3A;
				}

				.column-item.negative-item {
					background: linear-gradient(135deg, rgba(255, 250, 250, 0.9), rgba(255, 245, 245, 0.7));
					border: 2rpx solid rgba(196, 30, 58, 0.2);

					.item-type-name {
						color: #C41E3A !important;
					}
					
					.advice-point {
						color: #333;
					}
					
					.zodiacs-list .zodiac-item {
						border-color: rgba(196, 30, 58, 0.2);
						background: rgba(196, 30, 58, 0.05);
					}
				}
			}

			// 吉象类样式（统一绿色系）
			.positive-section {
				.section-header {
					background: linear-gradient(135deg, rgba(240, 255, 245, 0.9), rgba(235, 255, 240, 0.7));
					border-left: 8rpx solid #2E8B57;
				}

				.column-item.positive-item {
					background: linear-gradient(135deg, rgba(245, 255, 250, 0.9), rgba(240, 255, 245, 0.7));
					border: 2rpx solid rgba(46, 139, 87, 0.2);

					.item-type-name {
						color: #2E8B57 !important;
					}
					
					.advice-point {
						color: #333;
					}
					
					.zodiacs-list .zodiac-item {
						border-color: rgba(46, 139, 87, 0.2);
						background: rgba(46, 139, 87, 0.05);
					}
				}
			}
		}
	}

	// 空状态提示
	.empty-tip {
		text-align: center;
		padding: 60rpx 0;
		color: #999;
		font-size: 28rpx;

		.empty-icon {
			font-size: 60rpx;
			display: block;
			margin-bottom: 20rpx;
			opacity: 0.6;
		}

		.empty-text {
			opacity: 0.8;
		}
	}

	// 输入框聚焦样式
	.input-focus {
		border-color: #C41E3A !important;
		box-shadow: 0 0 0 4rpx rgba(196, 30, 58, 0.1);
	}
</style>