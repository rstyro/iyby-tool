<template>
	<view class="container">
		<!-- 顶部标题区 -->
		<view class="header">
			<view class="header-bg"></view>
			<text class="header-title">天干地支 · 传统历法</text>
			<text class="header-subtitle">探索中华时间密码，解读岁月流转奥秘</text>
		</view>

		<view class="form-container">
			<!-- 日期时间选择 -->
			<view class="form-item">
				<text class="form-label">选择公历日期</text>
				<view class="datetime-picker-group">
					<picker mode="date" :value="selectedDate" @change="onDateChange" class="date-picker">
						<view class="picker-text">{{ formatDisplayDate(selectedDate) }}</view>
					</picker>
					<picker mode="time" :value="selectedTime" @change="onTimeChange" class="time-picker">
						<view class="picker-text">{{ formatDisplayTime(selectedTime) }}</view>
					</picker>
				</view>
				<text class="form-hint">请选择需要转换的公历日期和时间</text>
			</view>

			<!-- 转换按钮 -->
			<view class="button-group">
				<button type="primary" class="btn convert-btn" @tap="convertToGanZhi" :loading="isConverting">
					{{ isConverting ? '转换中...' : '开始转换' }}
				</button>
				<button type="default" class="btn reset-btn" @tap="resetSelection">重置</button>
			</view>

			<!-- 天干地支结果显示 -->
			<view class="result-section" v-if="showResult">
				<text class="result-title">转换结果</text>

				<!-- 主要结果卡片 -->
				<view class="result-card">
					<text class="ganzhi-text">{{ result.ganZhi || '--' }}</text>
					<text class="ganzhi-description">天干地支表示</text>
				</view>

				<!-- 生肖和星座展示 -->
				<view class="zodiac-constellation-section" v-if="result.zodiac || result.constellation">
					<view class="zodiac-constellation-row">
						<view class="zodiac-item" v-if="result.zodiac">
							<text class="zodiac-icon">{{ getZodiacIcon(result.zodiac) }}</text>
							<view class="zodiac-info">
								<text class="zodiac-label">生肖</text>
								<text class="zodiac-value">{{ result.zodiac }}</text>
							</view>
						</view>

						<view class="constellation-item" v-if="result.constellation">
							<text class="constellation-icon">{{ getConstellationIcon(result.constellation) }}</text>
							<view class="constellation-info">
								<text class="constellation-label">星座</text>
								<text class="constellation-value">{{ result.constellation }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 日期信息展示 -->
				<view class="date-info-section" v-if="result.lunarDate">
					<view class="date-info-row">
						<view class="date-info-item">
							<text class="date-info-label">公历日期</text>
							<text class="date-info-value">{{ formatDisplayDate(selectedDate) }}</text>
						</view>

						<view class="date-info-item">
							<text class="date-info-label">农历日期</text>
							<text class="date-info-value">{{ result.lunarDate }}</text>
						</view>
					</view>

					<view class="date-time-row">
						<text class="date-time-label">时间</text>
						<text class="date-time-value">{{ selectedTime }}</text>
					</view>
				</view>

				<!-- 四柱网格布局 - 只包含年、月、日、时 -->
				<view class="four-pillars-section">
					<text class="four-pillars-title">{{ isDevOrTrial ? '传统历法' : '四柱' }}</text>
					<view class="four-pillars-grid">
						<view class="pillar-item">
							<text class="pillar-label">{{ isDevOrTrial ? '纪年' : '年柱' }}</text>
							<text class="pillar-value">{{ result.yearGanZhi || '--' }}</text>
						</view>

						<view class="pillar-item">
							<text class="pillar-label">{{ isDevOrTrial ? '纪月' : '月柱' }}</text>
							<text class="pillar-value">{{ result.monthGanZhi || '--' }}</text>
						</view>

						<view class="pillar-item">
							<text class="pillar-label">{{ isDevOrTrial ? '纪日' : '日柱' }}</text>
							<text class="pillar-value">{{ result.dayGanZhi || '--' }}</text>
						</view>

						<view class="pillar-item">
							<text class="pillar-label">{{ isDevOrTrial ? '纪时' : '时柱' }}</text>
							<text class="pillar-value">{{ result.hourGanZhi || '--' }}</text>
						</view>
					</view>
				</view>

				<!-- 十神展示区域 -->
				<view class="ten-gods-section" v-if="!isDevOrTrial && hasTenGods">
					<text class="ten-gods-title">十神</text>
					<view class="ten-gods-grid">
						<view class="ten-god-item">
							<view class="ten-god-header">
								<text class="ten-god-label">{{ isDevOrTrial ? '纪年' : '年柱' }}</text>
								<text class="ten-god-zhi">{{ result.yearGanZhi || '--' }}</text>
							</view>
							<view class="ten-god-detail">
								<view class="ten-god-row">
									<text class="ten-god-type">天干</text>
									<view class="ten-god-value" :style="[getTenGodBgStyle(result.yearGod)]">
										{{ result.yearGod || '--' }}
									</view>
								</view>
								<view class="ten-god-row">
									<text class="ten-god-type">地支</text>
									<view class="ten-god-value" :style="[getTenGodBgStyle(result.yearDiZhiGod)]">
										{{ result.yearDiZhiGod || '--' }}
									</view>
								</view>
							</view>
						</view>

						<view class="ten-god-item">
							<view class="ten-god-header">
								<text class="ten-god-label">{{ isDevOrTrial ? '纪月' : '月柱' }}</text>
								<text class="ten-god-zhi">{{ result.monthGanZhi || '--' }}</text>
							</view>
							<view class="ten-god-detail">
								<view class="ten-god-row">
									<text class="ten-god-type">天干</text>
									<view class="ten-god-value" :style="[getTenGodBgStyle(result.monthGod)]">
										{{ result.monthGod || '--' }}
									</view>
								</view>
								<view class="ten-god-row">
									<text class="ten-god-type"> 地支</text>
									<view class="ten-god-value" :style="[getTenGodBgStyle(result.monthDiZhiGod)]">
										{{ result.monthDiZhiGod || '--' }}
									</view>
								</view>
							</view>
						</view>

						<view class="ten-god-item">
							<view class="ten-god-header">
								<text class="ten-god-label">{{ isDevOrTrial ? '纪日' : '日柱' }}</text>
								<text class="ten-god-zhi">{{ result.dayGanZhi || '--' }}</text>
							</view>
							<view class="ten-god-detail">
								<view class="ten-god-row">
									<text class="ten-god-type">天干</text>
									<view class="ten-god-value" :style="[getTenGodBgStyle(result.dayGod)]">
										{{ result.dayGod || '--' }}
									</view>
								</view>
								<view class="ten-god-row">
									<text class="ten-god-type">地支</text>
									<view class="ten-god-value" :style="[getTenGodBgStyle(result.dayDiZhiGod)]">
										{{ result.dayDiZhiGod || '--' }}
									</view>
								</view>
							</view>
						</view>

						<view class="ten-god-item">
							<view class="ten-god-header">
								<text class="ten-god-label">{{ isDevOrTrial ? '纪时' : '时柱' }}</text>
								<text class="ten-god-zhi">{{ result.hourGanZhi || '--' }}</text>
							</view>
							<view class="ten-god-detail">
								<view class="ten-god-row">
									<text class="ten-god-type">天干</text>
									<view class="ten-god-value" :style="[getTenGodBgStyle(result.hourGod)]">
										{{ result.hourGod || '--' }}
									</view>
								</view>
								<view class="ten-god-row">
									<text class="ten-god-type">地支</text>
									<view class="ten-god-value" :style="[getTenGodBgStyle(result.hourDiZhiGod)]">
										{{ result.hourDiZhiGod || '--' }}
									</view>
								</view>
							</view>
						</view>
					</view>


					<!-- 藏干十神展示区域 -->
					<view class="hide-gods-section" v-if="!isDevOrTrial && hasHideGods">
						<text class="hide-gods-title">地支藏干十神</text>
						<view class="hide-gods-grid">
							<!-- 年柱藏干 -->
							<view class="hide-god-item"
								v-if="result.yearHideDzGods && result.yearHideDzGods.length > 0">
								<view class="hide-god-header">
									<text class="hide-god-label">年支藏干</text>
									<text class="hide-god-pillar">{{ result.yearGanZhi || '--' }}</text>
								</view>
								<view class="hide-god-list">
									<view class="hide-god-row" v-for="(item, index) in result.yearHideDzGods"
										:key="index">
										<text class="hide-god-gan">{{ item.gan }}</text>
										<view class="hide-god-god" :style="[getTenGodBgStyle(item.god)]">{{ item.god }}</view>
										<view class="hide-god-type" :style="[getQiTypeBgStyle(item.qiType)]">{{ getQiTypeName(item.qiType) }}</view>
									</view>
								</view>
							</view>

							<!-- 月柱藏干 -->
							<view class="hide-god-item"
								v-if="result.monthHideDzGods && result.monthHideDzGods.length > 0">
								<view class="hide-god-header">
									<text class="hide-god-label">月支藏干</text>
									<text class="hide-god-pillar">{{ result.monthGanZhi || '--' }}</text>
								</view>
								<view class="hide-god-list">
									<view class="hide-god-row" v-for="(item, index) in result.monthHideDzGods"
										:key="index">
										<text class="hide-god-gan">{{ item.gan }}</text>
										<view class="hide-god-god" :style="[getTenGodBgStyle(item.god)]">{{ item.god }}</view>
										<view class="hide-god-type" :style="[getQiTypeBgStyle(item.qiType)]">{{ getQiTypeName(item.qiType) }}</view>
									</view>
								</view>
							</view>

							<!-- 日柱藏干 -->
							<view class="hide-god-item" v-if="result.dayHideDzGods && result.dayHideDzGods.length > 0">
								<view class="hide-god-header">
									<text class="hide-god-label">日支藏干</text>
									<text class="hide-god-pillar">{{ result.dayGanZhi || '--' }}</text>
								</view>
								<view class="hide-god-list">
									<view class="hide-god-row" v-for="(item, index) in result.dayHideDzGods"
										:key="index">
										<text class="hide-god-gan">{{ item.gan }}</text>
										<view class="hide-god-god" :style="[getTenGodBgStyle(item.god)]">{{ item.god }}</view>
										<view class="hide-god-type" :style="[getQiTypeBgStyle(item.qiType)]">{{ getQiTypeName(item.qiType) }}</view>
									</view>
								</view>
							</view>

							<!-- 时柱藏干 -->
							<view class="hide-god-item"
								v-if="result.hourHideDzGods && result.hourHideDzGods.length > 0">
								<view class="hide-god-header">
									<text class="hide-god-label">时支藏干</text>
									<text class="hide-god-pillar">{{ result.hourGanZhi || '--' }}</text>
								</view>
								<view class="hide-god-list">
									<view class="hide-god-row" v-for="(item, index) in result.hourHideDzGods"
										:key="index">
										<text class="hide-god-gan">{{ item.gan }}</text>
										<view class="hide-god-god" :style="[getTenGodBgStyle(item.god)]">{{ item.god }}</view>
										<view class="hide-god-type" :style="[getQiTypeBgStyle(item.qiType)]">{{ getQiTypeName(item.qiType) }}</view>
									</view>
								</view>
							</view>
						</view>

						<!-- 十神说明 -->
						<view class="ten-gods-explain" v-if="!isDevOrTrial && hasTenGods">
							<view class="explain-title">十神生克关系说明</view>
							<view class="explain-content">
								<view class="explain-row">
									<view class="explain-item">
										<view class="explain-color shengwo-color"></view>
										<view class="explain-text-group">
											<text class="explain-main">生我者为印枭</text>
											<text class="explain-detail">同性为偏印(枭)，异性为正印</text>
										</view>
									</view>

									<view class="explain-item">
										<view class="explain-color wosheng-color"></view>
										<view class="explain-text-group">
											<text class="explain-main">我生者为食伤</text>
											<text class="explain-detail">同性为食神，异性为伤官</text>
										</view>
									</view>

									<view class="explain-item">
										<view class="explain-color woke-color"></view>
										<view class="explain-text-group">
											<text class="explain-main">我克者为财才</text>
											<text class="explain-detail">同性为偏财，异性为正财</text>
										</view>
									</view>
								</view>

								<view class="explain-row">
									<view class="explain-item">
										<view class="explain-color kewo-color"></view>
										<view class="explain-text-group">
											<text class="explain-main">克我者为官杀</text>
											<text class="explain-detail">同性为七杀，异性为正官</text>
										</view>
									</view>

									<view class="explain-item">
										<view class="explain-color tongwo-color"></view>
										<view class="explain-text-group">
											<text class="explain-main">同我者为比劫</text>
											<text class="explain-detail">同性为比肩，异性为劫财</text>
										</view>
									</view>
								</view>
							</view>
						</view>

					</view>
				</view>

				<!-- 操作按钮 -->
				<view class="action-buttons">
					<button type="default" class="btn share-btn" @tap="shareResult">分享结果</button>
					<button type="primary" class="btn copy-btn" @tap="copyResult">复制结果</button>
				</view>
			</view>

			<!-- 占位结果（无数据时显示） -->
			<view class="placeholder-section" v-else>
				<view class="placeholder-icon">📅</view>
				<text class="placeholder-title">等待转换</text>
				<text class="placeholder-text">选择日期时间，点击转换即可</text>
				<text class="placeholder-hint">干支纪时，溯本求源，藏华夏千年时间智慧</text>
			</view>

			<!-- 天干地支简介 -->
			<view class="info-section">
				<text class="info-title">传统历法简介</text>
				<view class="info-content">
					<text class="info-text">• 天干地支：华夏传统纪时法，纪年纪月纪日纪时</text>
					<text class="info-text">• 生肖：十二地支对应的属相，十二年一个轮回周期</text>
					<text class="info-text">• 农历：又称阴历，依月相盈亏定月，结合二十四节气</text>
					<text v-if="!isDevOrTrial" class="info-text">• 十神：日干与其他干支的十种关系象征</text>
					<text v-if="!isDevOrTrial" class="info-text">• 藏干：地支中隐藏的天干，体现其内在力量构成</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import SolarTerm from '@/common/SolarTerm.js';

	export default {
		data() {
			// 获取当前日期时间
			const now = new Date();
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');

			return {
				isDevOrTrial: true,
				// 选择的日期时间
				selectedDate: `${year}-${month}-${day}`,
				selectedTime: `${hours}:${minutes}`,
				// 转换结果
				result: {},
				// 是否显示结果
				showResult: false,
				// 是否正在转换
				isConverting: false,
				// 生肖图标映射
				zodiacIcons: {
					'鼠': '🐭',
					'牛': '🐮',
					'虎': '🐯',
					'兔': '🐰',
					'龙': '🐲',
					'蛇': '🐍',
					'马': '🐎',
					'羊': '🐑',
					'猴': '🐒',
					'鸡': '🐔',
					'狗': '🐶',
					'猪': '🐷'
				},
				// 星座图标映射
				constellationIcons: {
					'白羊座': '♈',
					'金牛座': '♉',
					'双子座': '♊',
					'巨蟹座': '♋',
					'狮子座': '♌',
					'处女座': '♍',
					'天秤座': '♎',
					'天蝎座': '♏',
					'射手座': '♐',
					'摩羯座': '♑',
					'水瓶座': '♒',
					'双鱼座': '♓'
				},
				// 十神颜色映射
				tenGodColors: {
					'偏印': '#52c41a',
					'正印': '#52c41a',
					'食神': '#13c2c2',
					'伤官': '#13c2c2',
					'偏财': '#1890ff',
					'正财': '#1890ff',
					'七杀': '#f5222d',
					'正官': '#f5222d',
					'比肩': '#722ed1',
					'劫财': '#722ed1',
					'日元': '#ff9800'
				},
				// 藏干气类型颜色映射
				qiTypeColors: {
					'本气': '#f5222d',
					'中气': '#1890ff',
					'余气': '#52c41a'
				}
			}
		},
		computed: {
			// 获取完整的日期时间字符串
			fullDateTime() {
				return `${this.selectedDate} ${this.selectedTime}:00`;
			},
			// 判断是否有十神数据
			hasTenGods() {
				return this.result && (this.result.yearGod || this.result.monthGod || this.result.dayGod || this.result
					.hourGod);
			},
			// 判断是否有藏干十神数据
			hasHideGods() {
				return this.result && (
					(this.result.yearHideDzGods && this.result.yearHideDzGods.length > 0) ||
					(this.result.monthHideDzGods && this.result.monthHideDzGods.length > 0) ||
					(this.result.dayHideDzGods && this.result.dayHideDzGods.length > 0) ||
					(this.result.hourHideDzGods && this.result.hourHideDzGods.length > 0)
				);
			}
		},
		onLoad() {
			this.isDevOrTrial = this.$version.isDevOrTrialVersion();
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
					"不用记口诀，输入日期秒出天干地支🎋～",
					"甲子乙丑丙寅溯，六十轮回藏玄机！一键解锁你的生辰干支，解读专属十神命理，窥见华夏千年历法智慧。",
					"测测你的'干支人格'！甲子年出生的是开拓者，乙丑年的是守护者...快来看看你是哪种？",
					"天干地支不是玄学，是祖先的时间密码！用科技传承文明，分享给同样热爱传统文化的TA~"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/ganzhi/ganzhi',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			// 日期选择变化
			onDateChange(e) {
				this.selectedDate = e.detail.value;
				this.showResult = false;
			},

			// 时间选择变化
			onTimeChange(e) {
				this.selectedTime = e.detail.value;
				this.showResult = false;
			},

			// 格式化显示日期
			formatDisplayDate(dateStr) {
				if (!dateStr) return '请选择日期';
				const [year, month, day] = dateStr.split('-');
				return `${year}年${month}月${day}日`;
			},

			// 格式化显示时间
			formatDisplayTime(timeStr) {
				if (!timeStr) return '请选择时间';
				return timeStr;
			},

			// 获取生肖图标
			getZodiacIcon(zodiac) {
				return this.zodiacIcons[zodiac] || '❓';
			},

			// 获取星座图标
			getConstellationIcon(constellation) {
				return this.constellationIcons[constellation] || '⭐';
			},

			// 获取十神背景样式 - 修复：返回对象而不是字符串
			getTenGodBgStyle(tenGod) {
				if (!tenGod) {
					return {
						background: 'linear-gradient(135deg, #ffffff, #f5f5f5)',
						color: '#333'
					};
				}

				const color = this.tenGodColors[tenGod] || '#ffffff';
				const lightColor = this.lightenColor(color, 40);

				return {
					background: `linear-gradient(135deg, ${color}, ${lightColor})`,
					color: '#fff',
					padding: '2rpx 8rpx',
					borderRadius: '6rpx',
					fontSize: '22rpx',
					fontWeight: '600'
				};
			},

			// 获取气类型名称
			getQiTypeName(qiType) {
				return qiType || '';
			},

			// 获取气类型背景样式 - 修复：返回对象而不是字符串
			getQiTypeBgStyle(qiType) {
				if (!qiType) {
					return {
						background: 'linear-gradient(135deg, #ffffff, #f5f5f5)',
						color: '#333'
					};
				}

				const color = this.qiTypeColors[qiType] || '#ffffff';
				const lightColor = this.lightenColor(color, 40);

				return {
					background: `linear-gradient(135deg, ${color}, ${lightColor})`,
					color: '#fff',
					fontSize: '20rpx',
					padding: '4rpx 10rpx',
					borderRadius: '4rpx',
					minWidth: '60rpx',
					textAlign: 'center'
				};
			},

			// 颜色变浅函数
			lightenColor(hex, percent) {
				// 移除#号
				hex = hex.replace('#', '');

				// 解析RGB
				let r = parseInt(hex.substr(0, 2), 16);
				let g = parseInt(hex.substr(2, 2), 16);
				let b = parseInt(hex.substr(4, 2), 16);

				// 计算浅色
				r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
				g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
				b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

				// 返回十六进制
				return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
			},

			// 转换天干地支
			convertToGanZhi() {
				if (this.isConverting) return;

				this.isConverting = true;
				this.showResult = false;

				// 模拟转换过程
				setTimeout(() => {
					// 调用转换方法
					const conversionResult = this.convertDateTimeToGanZhi(this.fullDateTime);
					if (conversionResult) {
						this.result = conversionResult;
						this.showResult = true;
					} else {
						uni.showToast({
							title: '转换失败，请检查日期格式',
							icon: 'error'
						});
					}
					this.isConverting = false;
				}, 100);
			},

			// 日期时间转天干地支方法（由用户实现）
			convertDateTimeToGanZhi(dateTimeStr) {
				/*
				 * 输入: dateTimeStr - 格式如 "2024-02-20 15:30:00"
				 * 输出: 返回一个对象，格式如下：
				 * {
				 *   zodiac: "蛇",                    // 生肖
				 *   yearGanZhi: "乙巳",             // 年柱
				 *   monthGanZhi: "庚寅",            // 月柱
				 *   dayGanZhi: "丁巳",              // 日柱
				 *   hourGanZhi: "己酉",             // 时柱
				 *   ganZhi: "乙巳年庚寅月丁巳日己酉时", // 完整天干地支
				 *   constellation: "水瓶座",         // 星座（新增）
				 *   lunarDate: "二零二四年正月十一",  // 农历日期（新增）
				 *   yearGod: "食神",                // 年干十神
				 *   monthGod: "七杀",               // 月干十神
				 *   dayGod: "日元",                 // 日干十神
				 *   hourGod: "偏印",                // 时干十神
				 *   yearDiZhiGod: "偏财",           // 年支十神
				 *   monthDiZhiGod: "七杀",          // 月支十神
				 *   dayDiZhiGod: "偏财",            // 日支十神
				 *   hourDiZhiGod: "偏印",           // 时支十神
				 *   yearHideDzGods: [              // 年支藏干十神数组
				 *     {gan: "丙", god: "食神", qiType: "本气"},
				 *     {gan: "庚", god: "七杀", qiType: "中气"},
				 *     {gan: "戊", god: "偏财", qiType: "余气"}
				 *   ],
				 *   monthHideDzGods: [              // 月支藏干十神数组
				 *     {gan: "己", god: "正财", qiType: "本气"},
				 *     {gan: "癸", god: "正印", qiType: "中气"},
				 *     {gan: "辛", god: "正官", qiType: "余气"}
				 *   ],
				 *   dayHideDzGods: [               // 日支藏干十神数组
				 *     {gan: "丁", god: "伤官", qiType: "本气"},
				 *     {gan: "己", god: "正财", qiType: "中气"}
				 *   ],
				 *   hourHideDzGods: [              // 时支藏干十神数组
				 *     {gan: "丙", god: "食神", qiType: "本气"},
				 *     {gan: "庚", god: "七杀", qiType: "中气"},
				 *     {gan: "戊", god: "偏财", qiType: "余气"}
				 *   ]
				 * }
				 */
				const st = new SolarTerm();
				let ganZhiData = st.getGanZhiByGregorian(dateTimeStr);
				let lunarDate = st.solarToLunar(new Date(dateTimeStr)).getFullLunarDate();
				ganZhiData.lunarDate = lunarDate;
				return ganZhiData;
			},

			// 重置选择
			resetSelection() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');

				this.selectedDate = `${year}-${month}-${day}`;
				this.selectedTime = `${hours}:${minutes}`;
				this.showResult = false;
				this.result = {};
			},

			// 分享结果
			shareResult() {
				if (!this.showResult) {
					uni.showToast({
						title: '请先进行转换',
						icon: 'none'
					});
					return;
				}

				// 构建十神信息字符串
				let tenGodsInfo = '';
				if (this.hasTenGods) {
					tenGodsInfo = `
十神信息：
年柱十神：${this.result.yearGod || '--'}/${this.result.yearDiZhiGod || '--'}
月柱十神：${this.result.monthGod || '--'}/${this.result.monthDiZhiGod || '--'}
日柱十神：${this.result.dayGod || '--'}/${this.result.dayDiZhiGod || '--'}
时柱十神：${this.result.hourGod || '--'}/${this.result.hourDiZhiGod || '--'}`;
				}

				// 构建藏干十神信息字符串
				let hideGodsInfo = '';
				if (this.hasHideGods) {
					hideGodsInfo = '\n\n地支藏干十神：';
					if (this.result.yearHideDzGods && this.result.yearHideDzGods.length > 0) {
						hideGodsInfo +=
							`\n年支藏干：${this.result.yearHideDzGods.map(item => `${item.gan}(${item.god}·${item.qiType})`).join('、')}`;
					}
					if (this.result.monthHideDzGods && this.result.monthHideDzGods.length > 0) {
						hideGodsInfo +=
							`\n月支藏干：${this.result.monthHideDzGods.map(item => `${item.gan}(${item.god}·${item.qiType})`).join('、')}`;
					}
					if (this.result.dayHideDzGods && this.result.dayHideDzGods.length > 0) {
						hideGodsInfo +=
							`\n日支藏干：${this.result.dayHideDzGods.map(item => `${item.gan}(${item.god}·${item.qiType})`).join('、')}`;
					}
					if (this.result.hourHideDzGods && this.result.hourHideDzGods.length > 0) {
						hideGodsInfo +=
							`\n时支藏干：${this.result.hourHideDzGods.map(item => `${item.gan}(${item.god}·${item.qiType})`).join('、')}`;
					}
				}

				const shareText = `📅 传统历法转换结果
				
公历时间：${this.formatDisplayDate(this.selectedDate)} ${this.selectedTime}
天干地支：${this.result.ganZhi}
生肖：${this.result.zodiac}
星座：${this.result.constellation}
农历日期：${this.result.lunarDate}
年柱：${this.result.yearGanZhi}
月柱：${this.result.monthGanZhi}
日柱：${this.result.dayGanZhi}
时柱：${this.result.hourGanZhi}${tenGodsInfo}${hideGodsInfo}

探索传统历法，了解时间密码。`;

				uni.showActionSheet({
					itemList: ['复制结果', '分享给好友'],
					success: (res) => {
						if (res.tapIndex === 0) {
							this.copyResult();
						} else if (res.tapIndex === 1) {
							uni.showToast({
								title: '点击右上角分享',
								icon: 'none'
							});
						}
					}
				});
			},

			// 复制结果
			copyResult() {
				if (!this.showResult) {
					uni.showToast({
						title: '没有可复制的内容',
						icon: 'none'
					});
					return;
				}

				// 构建十神信息字符串
				let tenGodsInfo = '';
				if (this.hasTenGods) {
					tenGodsInfo = `
十神信息：
年柱十神：${this.result.yearGod || '--'}/${this.result.yearDiZhiGod || '--'}
月柱十神：${this.result.monthGod || '--'}/${this.result.monthDiZhiGod || '--'}
日柱十神：${this.result.dayGod || '--'}/${this.result.dayDiZhiGod || '--'}
时柱十神：${this.result.hourGod || '--'}/${this.result.hourDiZhiGod || '--'}`;
				}

				// 构建藏干十神信息字符串
				let hideGodsInfo = '';
				if (this.hasHideGods) {
					hideGodsInfo = '\n地支藏干十神：';
					if (this.result.yearHideDzGods && this.result.yearHideDzGods.length > 0) {
						hideGodsInfo +=
							`\n年支藏干：${this.result.yearHideDzGods.map(item => `${item.gan}(${item.god}·${item.qiType})`).join('、')}`;
					}
					if (this.result.monthHideDzGods && this.result.monthHideDzGods.length > 0) {
						hideGodsInfo +=
							`\n月支藏干：${this.result.monthHideDzGods.map(item => `${item.gan}(${item.god}·${item.qiType})`).join('、')}`;
					}
					if (this.result.dayHideDzGods && this.result.dayHideDzGods.length > 0) {
						hideGodsInfo +=
							`\n日支藏干：${this.result.dayHideDzGods.map(item => `${item.gan}(${item.god}·${item.qiType})`).join('、')}`;
					}
					if (this.result.hourHideDzGods && this.result.hourHideDzGods.length > 0) {
						hideGodsInfo +=
							`\n时支藏干：${this.result.hourHideDzGods.map(item => `${item.gan}(${item.god}·${item.qiType})`).join('、')}`;
					}
				}

				const resultStr = `传统历法转换结果：
公历时间：${this.formatDisplayDate(this.selectedDate)} ${this.selectedTime}
天干地支：${this.result.ganZhi}
生肖：${this.result.zodiac}
星座：${this.result.constellation}
农历日期：${this.result.lunarDate}
年柱：${this.result.yearGanZhi}
月柱：${this.result.monthGanZhi}
日柱：${this.result.dayGanZhi}
时柱：${this.result.hourGanZhi}${tenGodsInfo}${hideGodsInfo}`;

				uni.setClipboardData({
					data: resultStr,
					success: () => {
						uni.showToast({
							title: '结果已复制',
							icon: 'success'
						});
					},
					fail: (err) => {
						console.error('复制失败:', err);
						uni.showToast({
							title: '复制失败',
							icon: 'error'
						});
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		padding: 20rpx;
		background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
		min-height: 100vh;
	}

	/* 顶部标题区 */
	.header {
		position: relative;
		padding: 60rpx 32rpx 60rpx;
		text-align: center;
		overflow: hidden;
		margin: -30rpx -24rpx 40rpx -24rpx;
	}

	.header-bg {
		position: absolute;
		top: -175rpx;
		left: -50rpx;
		right: -50rpx;
		height: 420rpx;
		background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
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

	.form-container {
		background: rgba(255, 255, 255, 0.9);
		border-radius: 20rpx;
		padding: 30rpx;
		margin-top: 20rpx;
		box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.form-item {
		margin-bottom: 40rpx;
	}

	.form-label {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.form-hint {
		display: block;
		font-size: 24rpx;
		color: #888;
		margin-top: 10rpx;
	}

	.datetime-picker-group {
		display: flex;
		justify-content: space-between;
		gap: 20rpx;
	}

	.date-picker,
	.time-picker {
		flex: 1;
	}

	.picker-text {
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 28rpx;
		color: #333;
		text-align: center;
	}

	/* 按钮组 */
	.button-group {
		margin-top: 50rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 20rpx;
	}

	.button-group .btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
	}

	.convert-btn {
		background: linear-gradient(to right, #1890ff, #096dd9);
		color: #fff;
	}

	.reset-btn {
		background: #fff;
		color: #666;
		border: 1px solid #ddd;
	}

	/* 结果区域 */
	.result-section {
		margin-top: 40rpx;
		padding-top: 30rpx;
		border-top: 1px solid #eee;
	}

	.result-title {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
		text-align: center;
	}

	.result-card {
		background: linear-gradient(135deg, #1890ff, #096dd9);
		border-radius: 16rpx;
		padding: 40rpx 30rpx;
		margin-bottom: 30rpx;
		text-align: center;
		box-shadow: 0 8rpx 24rpx rgba(9, 109, 217, 0.3);
	}

	.ganzhi-text {
		display: block;
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 10rpx;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
	}

	.ganzhi-description {
		display: block;
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.9);
	}

	/* 生肖和星座展示 */
	.zodiac-constellation-section {
		margin-bottom: 30rpx;
	}

	.zodiac-constellation-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20rpx;
	}

	.zodiac-item,
	.constellation-item {
		flex: 1;
		background: #fff;
		border-radius: 12rpx;
		padding: 25rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
		border: 1px solid #f0f0f0;
	}

	.zodiac-icon {
		font-size: 50rpx;
		margin-right: 20rpx;
	}

	.constellation-icon {
		font-size: 40rpx;
		margin-right: 20rpx;
	}

	.zodiac-info,
	.constellation-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
	}

	.zodiac-label,
	.constellation-label {
		font-size: 24rpx;
		color: #888;
		margin-bottom: 5rpx;
	}

	.zodiac-value,
	.constellation-value {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}

	/* 日期信息展示 */
	.date-info-section {
		background: #f9f9f9;
		border-radius: 12rpx;
		padding: 25rpx;
		margin-bottom: 30rpx;
	}

	.date-info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.date-info-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.date-info-label {
		font-size: 24rpx;
		color: #888;
		margin-bottom: 8rpx;
	}

	.date-info-value {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		text-align: center;
	}

	.date-time-row {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 15rpx;
		border-top: 1rpx dashed #ddd;
	}

	.date-time-label {
		font-size: 24rpx;
		color: #888;
		margin-bottom: 5rpx;
	}

	.date-time-value {
		font-size: 28rpx;
		font-weight: 600;
		color: #1890ff;
	}

	/* 四柱网格布局 */
	.four-pillars-section {
		margin-bottom: 40rpx;
	}

	.four-pillars-title {
		display: block;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		text-align: center;
	}

	.four-pillars-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20rpx;
	}

	.pillar-item {
		background: #fff;
		border-radius: 12rpx;
		padding: 25rpx 15rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
		border: 1px solid #f0f0f0;
		min-height: 120rpx;
	}

	.pillar-label {
		font-size: 24rpx;
		color: #888;
		margin-bottom: 10rpx;
		text-align: center;
	}

	.pillar-value {
		font-size: 32rpx;
		font-weight: bold;
		color: #1890ff;
		text-align: center;
	}

	/* 十神展示区域 */
	.ten-gods-section {
		margin-bottom: 30rpx;
	}

	.ten-gods-title {
		display: block;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		text-align: center;
	}

	.ten-gods-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 15rpx;
		margin-bottom: 20rpx;
	}

	.ten-god-item {
		border-radius: 12rpx;
		padding: 20rpx 15rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		border: none;
	}

	.ten-god-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 15rpx;
		padding-bottom: 10rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.3);
		width: 100%;
	}

	.ten-god-label {
		font-size: 22rpx;
		margin-bottom: 5rpx;
		text-align: center;
		opacity: 0.9;
	}

	.ten-god-zhi {
		font-size: 28rpx;
		font-weight: bold;
		text-align: center;
		opacity: 0.9;
	}

	.ten-god-detail {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.ten-god-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.ten-god-type {
		font-size: 20rpx;
		opacity: 0.8;
	}

	.ten-god-value {
		font-size: 22rpx;
		font-weight: 600;
		padding: 2rpx 8rpx;
		border-radius: 6rpx;
		background: rgba(255, 255, 255, 0.2);
	}

	/* 十神说明区域样式 */
	.ten-gods-explain {
		margin-top: 20rpx;
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		border-radius: 12rpx;
		padding: 20rpx;
		border: 1px solid #e0e0e0;
	}

	.explain-title {
		display: block;
		font-size: 24rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		text-align: center;
	}

	.explain-content {
		display: flex;
		flex-direction: column;
		gap: 15rpx;
	}

	.explain-row {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.explain-item {
		display: flex;
		align-items: center;
		gap: 15rpx;
		padding: 10rpx 15rpx;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 8rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.explain-color {
		width: 30rpx;
		height: 30rpx;
		border-radius: 6rpx;
		flex-shrink: 0;
	}

	.explain-text-group {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.explain-main {
		font-size: 24rpx;
		font-weight: 600;
		color: #333;
		line-height: 1.3;
	}

	.explain-detail {
		font-size: 20rpx;
		color: #666;
		line-height: 1.2;
		margin-top: 3rpx;
	}

	/* 十神关系颜色定义 */
	.shengwo-color {
		background-color: #52c41a;
		background-image: linear-gradient(135deg, #52c41a, #73d13d);
	}

	.wosheng-color {
		background-color: #13c2c2;
		background-image: linear-gradient(135deg, #13c2c2, #36cfc9);
	}

	.woke-color {
		background-color: #1890ff;
		background-image: linear-gradient(135deg, #1890ff, #40a9ff);
	}

	.kewo-color {
		background-color: #f5222d;
		background-image: linear-gradient(135deg, #f5222d, #ff4d4f);
	}

	.tongwo-color {
		background-color: #722ed1;
		background-image: linear-gradient(135deg, #722ed1, #9254de);
	}

	/* 藏干十神展示区域 */
	.hide-gods-section {
		margin-top: 30rpx;
		margin-bottom: 20rpx;
	}

	.hide-gods-title {
		display: block;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		text-align: center;
	}

	.hide-gods-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		margin-bottom: 20rpx;
	}

	.hide-god-item {
		background: #fff;
		border-radius: 12rpx;
		padding: 20rpx 15rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
		border: 1px solid #f0f0f0;
		display: flex;
		flex-direction: column;
	}

	.hide-god-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
		padding-bottom: 10rpx;
		border-bottom: 1rpx solid #eee;
	}

	.hide-god-label {
		font-size: 24rpx;
		color: #888;
		font-weight: 600;
	}

	.hide-god-pillar {
		font-size: 28rpx;
		font-weight: bold;
		color: #1890ff;
	}

	.hide-god-list {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	.hide-god-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8rpx 10rpx;
		background: #f9f9f9;
		border-radius: 6rpx;
	}

	.hide-god-gan {
		font-size: 24rpx;
		font-weight: bold;
		color: #333;
		width: 40rpx;
		text-align: center;
	}

	.hide-god-god {
		font-size: 22rpx;
		font-weight: 600;
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		color: #fff;
		min-width: 80rpx;
		text-align: center;
	}

	.hide-god-type {
		font-size: 20rpx;
		color: #666;
		padding: 4rpx 10rpx;
		border-radius: 4rpx;
		background: #f0f0f0;
		min-width: 60rpx;
		text-align: center;
	}

	/* 操作按钮 */
	.action-buttons {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 20rpx;
		margin-top: 40rpx;
	}

	.action-buttons .btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
	}

	.share-btn {
		background: #fff;
		color: #1890ff;
		border: 1px solid #1890ff;
	}

	.copy-btn {
		background: linear-gradient(to right, #52c41a, #389e0d);
		color: #fff;
	}

	/* 占位区域 */
	.placeholder-section {
		text-align: center;
		padding: 60rpx 30rpx;
		margin-top: 40rpx;
		background: #f9f9f9;
		border-radius: 12rpx;
		border: 2rpx dashed #ddd;
	}

	.placeholder-icon {
		font-size: 80rpx;
		margin-bottom: 20rpx;
	}

	.placeholder-title {
		display: block;
		font-size: 32rpx;
		font-weight: 600;
		color: #666;
		margin-bottom: 15rpx;
	}

	.placeholder-text {
		display: block;
		font-size: 28rpx;
		color: #888;
		margin-bottom: 20rpx;
		line-height: 1.4;
	}

	.placeholder-hint {
		display: block;
		font-size: 24rpx;
		color: #aaa;
		line-height: 1.3;
	}

	/* 信息区域 */
	.info-section {
		margin-top: 50rpx;
		padding-top: 30rpx;
		border-top: 1px solid #eee;
	}

	.info-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.info-content {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		background: #f9f9f9;
		border-radius: 10rpx;
		padding: 20rpx;
	}

	.info-text {
		font-size: 26rpx;
		color: #666;
		line-height: 1.5;
	}
</style>
