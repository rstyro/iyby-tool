<template>
	<view class="evil-star-page">
		<!-- 顶部标题区 - 仿照指定样式 -->
		<view class="header">
			<view class="header-bg"></view>
			<text class="header-title">十二神煞查询</text>
			<text class="header-subtitle">传统干支命理参考 · 民俗文化科普</text>
		</view>

		<!-- 查询区 -->
		<view class="query-card">
			<view class="input-group">
				<text class="label">查询年份</text>
				<view class="input-wrap" :class="{ 'input-focus': inputFocus }">
					<input v-model="inputYear" type="number" placeholder="请输入年份（如2025）" class="year-input"
						@focus="inputFocus = true" @blur="handleInputBlur" @confirm="loadData"
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

			<button class="query-btn" @click="loadData" :disabled="isLoading">
				<text class="btn-text">{{ isLoading ? '查询中...' : '立即查询' }}</text>
			</button>
		</view>

		<!-- 选项卡 -->
		<view class="tabs" v-if="showResult">
			<view class="tab-item" :class="{ active: activeTab === 0 }" @click="switchTab(0)">
				<text class="tab-text">按生肖</text>
				<view v-if="activeTab === 0" class="tab-indicator"></view>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 1 }" @click="switchTab(1)">
				<text class="tab-text">按吉凶</text>
				<view v-if="activeTab === 1" class="tab-indicator"></view>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 2 }" @click="switchTab(2)">
				<text class="tab-text">值年太岁</text>
				<view v-if="activeTab === 2" class="tab-indicator"></view>
			</view>
		</view>

		<!-- 按生肖显示 - 重新设计卡片 -->
		<view v-if="activeTab === 0 && showResult" class="zodiac-grid">
			<view v-for="item in evilStarData.list" :key="item.name" class="zodiac-item" @click="showDetail(item)">
				<!-- 生肖图标 -->
				<view class="zodiac-header">
					<view class="zodiac-icon-box">
						<text class="zodiac-icon">{{ item.icon }}</text>
						<text class="zodiac-name">{{ item.name }}</text>
					</view>
					<view v-if="item.evilStar.isYearMaster" class="master-tag">
						<text class="master-tag-text">值年太岁</text>
					</view>
				</view>

				<!-- 地支信息 -->
				<view class="zodiac-branch">
					<text class="branch-label">地支</text>
					<text class="branch-value">{{ item.branch }}</text>
				</view>

				<!-- 神煞信息 -->
				<view class="evil-star-info">
					<view class="star-name-box">
						<text class="star-name">{{ item.evilStar.name }}</text>
						<text class="luck-level" :style="{ color: item.luckConfig.color }">
							{{ item.evilStar.luckLevel }}
						</text>
					</view>
					<text class="star-desc">{{ item.evilStar.desc }}</text>
				</view>

				<!-- 底部装饰线 -->
				<view class="zodiac-footer" :style="{ backgroundColor: item.luckConfig.color }"></view>
			</view>
		</view>

		<!-- 按吉凶显示 -->
		<view v-if="activeTab === 1 && showResult" class="luck-groups">
			<view v-for="(level, levelName) in LUCK_LEVEL_CONFIG" :key="levelName" class="luck-group">
				<view class="group-header"
					:style="{ backgroundColor: level.bgColor, borderLeft: '8rpx solid ' + level.color }">
					<text class="group-title" :style="{ color: level.color }">
						{{ levelName }}
						({{ groupedData.groups[levelName] ? groupedData.groups[levelName].length : 0 }}个)
					</text>
				</view>

				<view class="group-content">
					<view v-for="item in groupedData.groups[levelName]" :key="item.name" class="group-item"
						@click="showDetail(item)">
						<text class="item-icon">{{ item.icon }}</text>
						<text class="item-name">{{ item.name }}</text>
						<text class="item-evil-star">{{ item.evilStar.name }}</text>
					</view>

					<view v-if="!groupedData.groups[levelName] || groupedData.groups[levelName].length === 0"
						class="empty-tip">
						暂无{{ levelName }}的生肖
					</view>
				</view>
			</view>
		</view>

		<!-- 值年太岁详情 -->
		<view v-if="activeTab === 2 && showResult && currentZodiac" class="year-master-detail">
			<view class="master-card">
				<view class="master-header">
					<text class="master-icon">{{ currentZodiac.icon }}</text>
					<text class="master-title">{{ currentYear }}年值年太岁</text>
				</view>

				<view class="master-content">
					<view class="master-row">
						<text class="row-label">生肖：</text>
						<text class="row-value">{{ currentZodiac.name }}{{ currentZodiac.icon }}</text>
					</view>

					<view class="master-row">
						<text class="row-label">地支：</text>
						<text class="row-value">{{ currentZodiac.branch }}</text>
					</view>

					<view class="master-row">
						<text class="row-label">神煞：</text>
						<text class="row-value">太岁（值年之主）</text>
					</view>

					<view class="master-desc">
						<text class="desc-title">太岁说明：</text>
						<text class="desc-content">太岁是值年之主，中性吉凶。若与太岁发生冲、刑、破等关系，则会转为凶象；若与太岁相合，则能平稳度过。</text>
					</view>

					<view class="master-advice">
						<text class="advice-title">值年建议：</text>
						<view class="advice-list">
							<text class="advice-item">1. 可穿着红色系衣物，如红内衣、红袜子，讨个好彩头</text>
							<text class="advice-item">2. 行事稳扎稳打，遇事多思考，避免冲动决策</text>
							<text class="advice-item">3. 年初可按民俗拜太岁祈福（仅作文化参考）</text>
							<text class="advice-item">4. 保持积极心态，万事以和为贵</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 生肖详情弹窗 -->
		<u-popup :show="showDetailPopup" mode="center" :round="20" @close="closeDetail">
			<view class="detail-popup" v-if="selectedItem">
				<view class="popup-header">
					<text class="popup-title">{{ selectedItem.icon }}{{ selectedItem.name }}详情</text>
					<view class="popup-close" @click="closeDetail">
						<text class="close-icon">✕</text>
					</view>
				</view>

				<scroll-view class="detail-content" scroll-y>
					<view class="detail-row">
						<text class="detail-label">生肖：</text>
						<text class="detail-value">{{ selectedItem.name }}</text>
					</view>

					<view class="detail-row">
						<text class="detail-label">地支：</text>
						<text class="detail-value">{{ selectedItem.branch }}</text>
					</view>

					<view class="detail-row">
						<text class="detail-label">{{ currentYear }}年神煞：</text>
						<text class="detail-value" :style="{ color: selectedItem.luckConfig.color }">
							{{ selectedItem.evilStar.name }} ({{ selectedItem.evilStar.luckLevel }})
						</text>
					</view>

					<view class="detail-row">
						<text class="detail-label">别名：</text>
						<text class="detail-value">{{ selectedItem.evilStar.aliases.join('、') }}</text>
					</view>

					<view class="detail-desc">
						<text class="desc-title">详细描述：</text>
						<text class="desc-content">{{ selectedItem.evilStar.desc }}</text>
					</view>

					<view v-if="selectedItem.evilStar.isYearMaster" class="warning-tip">
						<text class="warning-icon">⚠️</text>
						<text class="warning-text">今年是{{ selectedItem.name }}{{ selectedItem.icon }}的本命年（值太岁）</text>
					</view>

					<view class="advice-section">
						<text class="advice-title">化解建议：</text>
						<view class="advice-list">
							<text class="advice-item" v-for="(advice, idx) in getAdviceList(selectedItem)" :key="idx">
								{{ idx + 1 }}. {{ advice }}
							</text>
						</view>
					</view>
				</scroll-view>

				<view class="popup-actions">
					<view class="action-btn close" @click="closeDetail">关闭</view>
				</view>
			</view>
		</u-popup>

		<!-- 空状态/错误提示 -->
		<view class="empty-tip" v-if="hasQuery && !showResult && !isLoading">
			<text class="empty-icon">📅</text>
			<text class="empty-text">请输入有效年份查询神煞信息</text>
		</view>

		<!-- 底部说明 -->
		<view class="footer" v-if="showResult">
			<view class="footer-note">
				<text class="note-icon">📚</text>
				<text class="note-text">数据说明：十二神煞是传统命理学概念，本结果仅供参考，请保持理性态度</text>
			</view>
		</view>
	</view>
</template>

<script>
	import evilStarUtils from '@/common/evilStarUtils.js';

	export default {
		data() {
			const currentYear = new Date().getFullYear();
			return {
				currentYear,
				inputYear: currentYear,
				activeTab: 0,
				showDetailPopup: false,
				selectedItem: null,
				isLoading: false,
				showResult: false,
				hasQuery: false,
				inputFocus: false,

				// 从工具类导入的常量
				LUCK_LEVEL_CONFIG: evilStarUtils.LUCK_LEVEL_CONFIG,

				// 计算数据
				evilStarData: {
					list: [],
					summary: {
						greatMisfortune: 0,
						minorMisfortune: 0,
						neutral: 0,
						auspicious: 0,
						total: 0
					}
				},

				groupedData: {
					groups: {}
				},

				// 快捷年份
				shortcutYears: [
					currentYear - 2,
					currentYear - 1,
					currentYear,
					currentYear + 1,
					currentYear + 2
				],

				// 化解建议
				adviceMap: {
					'太岁': [
						'可穿着红色系衣物（如红内衣、红袜子）讨个好彩头',
						'行事稳扎稳打，遇事别冲动，凡事多思虑',
						'年初可按民俗拜太岁祈福（仅作文化参考）',
						'保持心态平和，为人处世留有余地'
					],
					'青龙': [
						'多参加社交活动，拓展人脉资源',
						'把握好贵人运，多与正能量的人交往',
						'适合开展新项目或学习新技能',
						'保持积极乐观的心态，好运自然来'
					],
					'丧门': [
						'多关心家人健康，定期做体检',
						'避免参加白事或探病，减少负能量',
						'投资理财要保守，避免大额支出',
						'多做善事，积善之家必有余庆'
					],
					'六合': [
						'多与合作伙伴沟通，把握合作机会',
						'适合拓展人脉，参加社交活动',
						'财运较佳，可考虑稳健投资',
						'保持良好人际关系，避免口舌是非'
					],
					'官符': [
						'谨言慎行，避免与人发生纠纷',
						'签订合同要仔细，避免法律风险',
						'处理事务要公正，避免偏袒',
						'保持清白，远离是非之地'
					],
					'小耗': [
						'减少不必要的开支，精打细算',
						'注意身体健康，避免过度劳累',
						'保管好个人物品，防止丢失',
						'投资理财需谨慎，避免冲动消费'
					],
					'岁破': [
						'重大决策要三思而后行',
						'避免高风险投资和大额借贷',
						'出行注意安全，防范意外',
						'保持低调，避免与人争执'
					],
					'朱雀': [
						'多参加公益活动，积累福报',
						'遇事冷静处理，避免冲动',
						'贵人运佳，可寻求帮助',
						'保持平和心态，化解小人是非'
					],
					'白虎': [
						'注意交通安全，避免危险活动',
						'保持良好作息，关注身体健康',
						'避免口舌之争，谨言慎行',
						'做好安全防护，防范意外伤害'
					],
					'贵神': [
						'多与长辈沟通，获得指导帮助',
						'把握贵人运，积极拓展人脉',
						'保持谦逊态度，虚心学习',
						'多做善事，积累福德'
					],
					'天狗': [
						'注意家人健康，多关心照顾',
						'避免参加危险活动，注意安全',
						'保持良好心态，避免过度担忧',
						'与人为善，减少口舌是非'
					],
					'病符': [
						'定期体检，关注身体健康',
						'保持良好作息，适当锻炼',
						'注意饮食卫生，避免病从口入',
						'及时就医，不要讳疾忌医'
					]
				}
			};
		},

		computed: {
			// 当前年份生肖
			currentZodiac() {
				return evilStarUtils.getZodiacByYear(this.currentYear);
			}
		},

		onLoad() {
			this.initData();
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
					"你的生肖今年运势如何？一查便知！",
					"生肖运势全知道，传统文化新体验🎋～",
					"想知道生肖运势？来这里一探究竟！",
					"揭秘生肖年度运势，快来测测！🔮"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/evilStar/evilStar',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			// 初始化数据
			initData() {
				this.loadData();
			},

			// 加载年份数据
			loadData() {
				this.isLoading = true;
				this.showResult = false;
				this.hasQuery = true;

				// 模拟加载延迟
				setTimeout(() => {
					try {
						this.currentYear = Number(this.inputYear);

						// 获取按生肖排列的数据
						this.evilStarData = evilStarUtils.getEvilStarsByYear(this.currentYear);

						// 获取按吉凶分组的数据
						this.groupedData = evilStarUtils.getEvilStarsGroupedByLuck(this.currentYear);

						this.showResult = true;
						this.isLoading = false;

					} catch (error) {
						console.error('加载数据失败:', error);
						uni.showToast({
							title: '查询失败，请重试',
							icon: 'none',
							duration: 2000
						});
						this.isLoading = false;
					}
				}, 300);
			},

			// 年份输入处理
			handleYearInput(e) {
				const value = e.detail.value;
				if (value) {
					this.inputYear = value.replace(/\D/g, '');
				}
			},

			// 输入框失焦处理
			handleInputBlur() {
				this.inputFocus = false;
				if (!this.inputYear || isNaN(this.inputYear)) {
					this.inputYear = this.currentYear;
				}
			},

			// 选择快捷年份
			selectShortcutYear(year) {
				this.inputYear = year;
				this.loadData();
			},

			// 切换选项卡
			switchTab(index) {
				this.activeTab = index;
			},

			// 显示详情
			showDetail(item) {
				this.selectedItem = item;
				this.showDetailPopup = true;
			},

			// 关闭详情
			closeDetail() {
				this.showDetailPopup = false;
				setTimeout(() => {
					this.selectedItem = null;
				}, 300);
			},

			// 获取化解建议列表
			getAdviceList(item) {
				const starName = item.evilStar.name;
				return this.adviceMap[starName] || [
					'保持平常心，万事顺意',
					'多行善事，广结善缘',
					'遇事冷静，三思而后行'
				];
			}
		}
	};
</script>

<style lang="scss" scoped>
	/* 全局容器 */
	.evil-star-page {
		min-height: 100vh;
		background: linear-gradient(to bottom, #faf8f5, #f5f0eb);
		padding: 30rpx 24rpx;
		box-sizing: border-box;
		position: relative;
	}

	/* 顶部标题区 - 仿照指定样式 */
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
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

	/* 查询卡片 */
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
					border-color: #667eea;
					box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
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
					background: #667eea;
					color: #fff;
				}

				&:active:not(.active) {
					background: #667eea;
					color: #fff;
					transform: scale(0.95);
				}
			}
		}

		.query-btn {
			width: 100%;
			height: 96rpx;
			line-height: 96rpx;
			background: linear-gradient(to right, #667eea, #764ba2);
			border-radius: 12rpx;
			border: none;
			box-shadow: 0 8rpx 16rpx rgba(102, 126, 234, 0.2);
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
				box-shadow: 0 4rpx 8rpx rgba(102, 126, 234, 0.2);
			}
		}
	}

	/* 选项卡样式 */
	.tabs {
		display: flex;
		margin: 0 0 30rpx;
		background: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

		.tab-item {
			flex: 1;
			text-align: center;
			padding: 25rpx 0;
			font-size: 28rpx;
			color: #666;
			position: relative;
			transition: all 0.3s ease;

			&.active {
				color: #667eea;
				font-weight: bold;
				background: #f8f9ff;
			}

			.tab-indicator {
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 60rpx;
				height: 4rpx;
				background: #667eea;
				border-radius: 2rpx;
			}

			&:active {
				background: #f0f2ff;
			}
		}
	}

	/* 生肖网格 - 重新设计 */
	.zodiac-grid {
		margin: 0 0 30rpx;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;

		.zodiac-item {
			background: #fff;
			border-radius: 16rpx;
			padding: 25rpx;
			position: relative;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
			transition: all 0.3s ease;
			border: 1rpx solid #f0f0f0;
			display: flex;
			flex-direction: column;
			overflow: hidden;

			&:active {
				transform: translateY(-4rpx);
				box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
			}

			.zodiac-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 20rpx;

				.zodiac-icon-box {
					display: flex;
					align-items: center;

					.zodiac-icon {
						font-size: 44rpx;
						margin-right: 12rpx;
					}

					.zodiac-name {
						font-size: 32rpx;
						font-weight: bold;
						color: #333;
					}
				}

				.master-tag {
					background: #fff2cc;
					border-radius: 12rpx;
					padding: 6rpx 12rpx;

					.master-tag-text {
						font-size: 20rpx;
						color: #d48806;
						font-weight: 500;
					}
				}
			}

			.zodiac-branch {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				padding: 12rpx 0;
				border-top: 1rpx solid #f5f5f5;
				border-bottom: 1rpx solid #f5f5f5;

				.branch-label {
					font-size: 24rpx;
					color: #999;
					margin-right: 12rpx;
				}

				.branch-value {
					font-size: 28rpx;
					color: #666;
					font-weight: 500;
				}
			}

			.evil-star-info {
				flex: 1;

				.star-name-box {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 12rpx;

					.star-name {
						font-size: 28rpx;
						font-weight: bold;
						color: #333;
					}

					.luck-level {
						font-size: 22rpx;
						font-weight: bold;
						padding: 4rpx 12rpx;
						border-radius: 20rpx;
						background: rgba(0, 0, 0, 0.05);
					}
				}

				.star-desc {
					font-size: 24rpx;
					color: #666;
					line-height: 1.4;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			}

			.zodiac-footer {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 6rpx;
				border-radius: 0 0 16rpx 16rpx;
			}
		}
	}

	/* 吉凶分组 */
	.luck-groups {
		margin: 0 0 30rpx;

		.luck-group {
			margin-bottom: 30rpx;

			.group-header {
				padding: 25rpx 30rpx;
				border-radius: 16rpx 16rpx 0 0;

				.group-title {
					font-size: 28rpx;
					font-weight: bold;
				}
			}

			.group-content {
				background: #fff;
				border-radius: 0 0 16rpx 16rpx;
				box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
				overflow: hidden;

				.group-item {
					display: flex;
					align-items: center;
					padding: 25rpx 30rpx;
					border-bottom: 1rpx solid #f0f0f0;
					transition: all 0.3s ease;

					&:last-child {
						border-bottom: none;
					}

					&:active {
						background: #f8f9fa;
						transform: scale(0.99);
					}

					.item-icon {
						font-size: 36rpx;
						margin-right: 20rpx;
						min-width: 36rpx;
					}

					.item-name {
						font-size: 28rpx;
						font-weight: bold;
						color: #333;
						margin-right: 20rpx;
						min-width: 60rpx;
					}

					.item-evil-star {
						font-size: 26rpx;
						color: #666;
						flex: 1;
					}
				}

				.empty-tip {
					text-align: center;
					padding: 60rpx 0;
					color: #999;
					font-size: 26rpx;
					background: #fff;
				}
			}
		}
	}

	/* 值年太岁详情 */
	.year-master-detail {
		margin-bottom: 30rpx;

		.master-card {
			background: linear-gradient(135deg, #fff9e6 0%, #fff0b3 100%);
			border-radius: 20rpx;
			padding: 30rpx;
			box-shadow: 0 8rpx 30rpx rgba(255, 204, 0, 0.2);
			border: 2rpx solid #ffcc00;

			.master-header {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;
				padding-bottom: 20rpx;
				border-bottom: 1rpx solid rgba(255, 204, 0, 0.3);

				.master-icon {
					font-size: 60rpx;
					margin-right: 20rpx;
				}

				.master-title {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
				}
			}

			.master-content {
				.master-row {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;

					.row-label {
						font-size: 26rpx;
						color: #666;
						min-width: 120rpx;
					}

					.row-value {
						font-size: 26rpx;
						color: #333;
						font-weight: 500;
					}
				}

				.master-desc {
					margin: 30rpx 0;
					padding: 20rpx;
					background: rgba(255, 255, 255, 0.8);
					border-radius: 12rpx;

					.desc-title {
						display: block;
						font-size: 26rpx;
						font-weight: bold;
						color: #333;
						margin-bottom: 10rpx;
					}

					.desc-content {
						font-size: 24rpx;
						color: #666;
						line-height: 1.6;
					}
				}

				.master-advice {
					padding: 20rpx;
					background: rgba(255, 255, 255, 0.8);
					border-radius: 12rpx;

					.advice-title {
						display: block;
						font-size: 26rpx;
						font-weight: bold;
						color: #333;
						margin-bottom: 15rpx;
					}

					.advice-list {
						.advice-item {
							display: block;
							font-size: 24rpx;
							color: #666;
							line-height: 1.6;
							margin-bottom: 10rpx;
							padding-left: 20rpx;
							position: relative;

							&::before {
								content: "•";
								position: absolute;
								left: 0;
								color: #ffcc00;
								font-weight: bold;
							}

							&:last-child {
								margin-bottom: 0;
							}
						}
					}
				}
			}
		}
	}

	/* 详情弹窗 */
	.detail-popup {
		width: 90vw;
		max-height: 80vh;
		background: white;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;

		.popup-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 40rpx 30rpx 30rpx;
			border-bottom: 1rpx solid #f0f0f0;
			flex-shrink: 0;

			.popup-title {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
				flex: 1;
			}

			.popup-close {
				font-size: 32rpx;
				color: #999;
				padding: 10rpx;
				border-radius: 50%;
				margin-left: 20rpx;

				&:active {
					background: #f5f5f5;
				}

				.close-icon {
					font-size: 32rpx;
					font-weight: bold;
				}
			}
		}

		.detail-content {
			flex: 1;
			padding: 30rpx;
			max-height: 60vh;
			overflow-y: auto;
			box-sizing: border-box;

			.detail-row {
				display: flex;
				margin-bottom: 25rpx;
				align-items: center;

				.detail-label {
					font-size: 28rpx;
					color: #666;
					min-width: 120rpx;
				}

				.detail-value {
					font-size: 28rpx;
					color: #333;
					flex: 1;
					font-weight: bold;
				}
			}

			.detail-desc {
				background: #f8f9fa;
				border-radius: 12rpx;
				padding: 20rpx;
				margin: 30rpx 0;

				.desc-title {
					display: block;
					font-size: 26rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 10rpx;
				}

				.desc-content {
					font-size: 26rpx;
					color: #666;
					line-height: 1.6;
				}
			}

			.warning-tip {
				background: #fff2e6;
				border-left: 8rpx solid #ff8800;
				padding: 20rpx;
				border-radius: 8rpx;
				margin: 20rpx 0;
				display: flex;
				align-items: center;

				.warning-icon {
					font-size: 36rpx;
					margin-right: 15rpx;
				}

				.warning-text {
					font-size: 26rpx;
					color: #cc5500;
					flex: 1;
				}
			}

			.advice-section {
				background: #f8f9fa;
				border-radius: 12rpx;
				padding: 20rpx;
				margin-top: 20rpx;

				.advice-title {
					display: block;
					font-size: 26rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 15rpx;
				}

				.advice-list {
					.advice-item {
						display: block;
						font-size: 24rpx;
						color: #666;
						line-height: 1.6;
						margin-bottom: 10rpx;
						padding-left: 20rpx;
						position: relative;

						&::before {
							content: "•";
							position: absolute;
							left: 0;
							color: #667eea;
							font-weight: bold;
						}

						&:last-child {
							margin-bottom: 0;
						}
					}
				}
			}
		}

		.popup-actions {
			padding: 0 30rpx 40rpx;
			flex-shrink: 0;

			.action-btn {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
				text-align: center;
				padding: 25rpx 0;
				border-radius: 12rpx;
				font-size: 28rpx;
				font-weight: bold;
				transition: all 0.3s ease;

				&:active {
					transform: translateY(4rpx);
					box-shadow: 0 4rpx 8rpx rgba(102, 126, 234, 0.2);
				}
			}
		}
	}

	/* 空状态提示 */
	.empty-tip {
		text-align: center;
		padding: 100rpx 0;
		color: #999;
		font-size: 28rpx;

		.empty-icon {
			font-size: 80rpx;
			display: block;
			margin-bottom: 30rpx;
			opacity: 0.6;
		}

		.empty-text {
			opacity: 0.8;
		}
	}

	/* 底部说明 */
	.footer {
		padding: 30rpx 0 40rpx;
		text-align: center;

		.footer-note {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #f0f2f5;
			padding: 25rpx;
			border-radius: 12rpx;
			border-left: 8rpx solid #667eea;

			.note-icon {
				font-size: 32rpx;
				margin-right: 15rpx;
				color: #667eea;
			}

			.note-text {
				font-size: 24rpx;
				color: #666;
				text-align: left;
				flex: 1;
			}
		}
	}

	/* 响应式调整 */
	@media (max-width: 750rpx) {
		.zodiac-grid {
			grid-template-columns: 1fr;
		}
	}

	/* 动画效果 */
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

	.zodiac-item {
		animation: fadeIn 0.3s ease-out;
	}

	/* 输入框聚焦样式 */
	.input-focus {
		border-color: #667eea !important;
		box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
	}
</style>