<template>
	<view class="container">
		<!-- 页面内容 -->
		<view class="content">
			<!-- 头部 -->
			<view class="header">
				<view class="logo-container">
					<view class="logo">
						<cl-icon type="icon-touzi" color="#fff" size="30"></cl-icon>
					</view>
					<view class="header-text">
						<text class="header-title">惊喜制造局</text>
						<text class="subtitle">10+种天选惊喜生成器</text>
					</view>
				</view>

				<!-- 搜索框 -->
				<view class="search-box">
					<cl-icon type="icon-sousuo" size="20" class="search-icon" color="#ccc" />
					<input class="search-input" v-model="searchQuery" placeholder="搜索抽奖类型..." type="text" />
				</view>
			</view>

			<!-- 分类标签 -->
			<view class="categories-container">
				<scroll-view class="categories" scroll-x>
					<view class="category" :class="{ active: currentCategory === cat }"
						v-for="(cat, index) in categories" :key="index" @click="currentCategory = cat">
						{{ cat }}
					</view>
				</scroll-view>
			</view>

			<!-- 抽奖卡片 -->
			<view class="lottery-navs">

				<block v-for="(item,index) in filteredNavs" :key="index">

					<view class="lottery-card" @click="selectCard(item.name)">
						<text v-if="item.hot || item.new" class="lottery-card-tag"
							:class="{'hot-tag':item.hot,'new-tag':item.new}">{{item.hot?'热门':'NEW'}}</text>
						<view class="content-wrapper">
							<view class="text-container">
								<view class="title">{{ item.title }}</view>
								<text class="description">{{ item.desc }}</text>
							</view>
							<cl-icon class="feature-image" :type="item.icon" :color="item.color" size="60" />
						</view>
						<view class="card-footer">
							<text>{{ item.category }}</text>
						</view>
					</view>

				</block>


			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchQuery: '',
				currentCategory: '全部',
				categories: ['全部', '经典', '开黑', '趣味', '日常'],
				navs: [{
						"name": 'disc',
						"title": "幸运大转盘",
						"desc": "转动命运之轮，惊喜大奖即刻降临！",
						"icon": "icon-zhuanpan",
						"color": '#FFAB00',
						"category": "经典",
						"hot": true
					},
					{
						"name": 'specie',
						"title": "上帝硬币",
						"desc": "纠结选哪个？抛个硬币让老天爷帮你做决定吧！",
						"icon": "icon-paoyingbi",
						"color": '#FFD700',
						"category": "经典",
						"hot": false
					},
					{
						"name": 'brand',
						"title": "帝王翻牌",
						"desc": "像皇帝一样翻牌选妃，今天翻到谁就宠幸谁！",
						"icon": "icon-kapai",
						"color": '#AB47BC',
						"category": "趣味",
						"hot": true
					},
					{
						"name": 'dice',
						"title": "大话骰",
						"desc": "朋友聚会必备！摇骰子拼酒量，今晚谁先倒下？",
						"icon": "icon-touzi",
						"color": '#FF5252',
						"category": "开黑",
						"new": true
					},
					{
						"name": 'dicePk',
						"title": "骰子对决",
						"desc": "刺激骰子大乱斗，看看谁才是终极赢家！",
						"icon": "icon-wuxianduijue",
						"color": '#FF4081',
						"category": "开黑",
						"hot": true
					},
					{
						"name": 'fireDice',
						"title": "激情骰子",
						"desc": "骰子燃爆全场，挑战你的心跳极限！",
						"icon": "icon-dengpao",
						"color": '#FF7043',
						"category": "开黑",
						"hot": true
					},
					{
						"name": 'fly',
						"title": "情侣飞行棋",
						"desc": "双人甜蜜冒险，每一步都是心动的邂逅！",
						"icon": "icon-qinglv",
						"color": '#EC407A',
						"category": "开黑",
						"new": true
					},
					{
						"name": 'truthOrDare',
						"title": "真心话大冒险",
						"desc": "劲爆挑战+灵魂拷问，引爆全场尖叫时刻！",
						"icon": "icon-zhenxinhua",
						"color": '#FF3860',
						"category": "开黑",
						"new": true
					}
				]
			};
		},
		computed: {
			filteredNavs() {
				let result = this.navs;
				// 搜索过滤
				if (this.searchQuery) {
					const query = this.searchQuery.toLowerCase();
					result = result.filter(item =>
						item.title.toLowerCase().includes(query) ||
						item.desc.toLowerCase().includes(query) ||
						item.category.toLowerCase().includes(query)
					);
				}

				// 分类过滤
				if (this.currentCategory !== '全部') {
					result = result.filter(item => item.category === this.currentCategory);
				}

				return result;
			}
		},
		onShow() {},
		//下拉刷新
		onPullDownRefresh: function() {
			setTimeout(function() {
				// 可以停止当前页面的下拉刷新
				uni.stopPullDownRefresh();
			}, 1000);
		},
		mounted() {},
		onShareAppMessage(res) {
			return this.generateShareConfig();
		},
		onShareTimeline() {
			return this.generateShareConfig(true);
		},
		methods: {
			generateShareConfig(forTimeline = false) {
				const defaultTemplates = [
					"发现一个‘情侣专属’游戏空间！没有复杂的规则，只有两个人简单的快乐和互动，推荐！",
					"敢不敢和你的另一半玩这个游戏？问题直击灵魂，答案可能出乎意料！"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'pages/tabbar/tabbar-game',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			selectCard(name) {
				this.$Router.push({
					name: name,
				});
			},
			adOnload(e) {
				console.log("onload");
			},
			adOnclose(e) {
				console.log("onclose: " + e.detail);
			},
			adOnerror(e) {
				console.log("onerror: " + e.detail.errCode + " message:: " + e.detail.errMsg);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		--primary: #8a2be2;
		--secondary: #ff6b6b;
		--accent: #4ecdc4;
		--dark: #1a1a2e;
		--darker: #0d0d1a;
		--light: #f8f9fa;
		--card-bg: rgba(255, 255, 255, 0.08);

		background: linear-gradient(135deg, var(--darker), var(--dark));
		min-height: 100vh;
		color: var(--light);
		font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
		overflow-x: hidden;
		padding-bottom: 80px;
		position: relative;
	}


	/* 头部样式 - 移动端优化 */
	.header {
		padding: 20px 15px 15px;
		margin-bottom: 10px;
		background: transparent;

		.logo-container {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 20px;

			.logo {
				width: 50px;
				height: 50px;
				background: linear-gradient(135deg, #8a2be2, #4ecdc4);
				border-radius: 15px;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 5px 15px rgba(138, 43, 226, 0.4);
				margin-right: 15px;
			}

			.header-title {
				display: block;
				font-size: 1.8rem;
				margin-bottom: 5px;
				background: linear-gradient(to right, #4ecdc4, #ff6b6b);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				font-weight: 700;

				.subtitle {
					font-size: 0.9rem;
					color: rgba(255, 255, 255, 0.7);
					line-height: 1.4;
				}
			}
		}
	}

	.search-box {
		position: relative;
		margin: 15px 0;

		.search-input {
			width: 83%;
			padding: 28rpx 20rpx 28rpx 100rpx;
			border-radius: 30px;
			background: rgba(255, 255, 255, 0.1);
			color: white;
			font-size: 1rem;
			box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		}

		.search-icon {
			position: absolute;
			left: 30rpx;
			top: 50%;
			transform: translateY(-50%);
			color: rgba(255, 255, 255, 0.7);
		}
	}


	/* 分类标签 - 移动端横向滚动 */
	.categories-container {
		position: relative;
		margin: 15rpx 0;

		.categories {
			display: flex;
			padding: 20rpx 20rpx 40rpx;
			gap: 24rpx;
			margin-bottom: 30rpx;
			white-space: nowrap;
			overflow-x: auto;
		}

		.categories::-webkit-scrollbar {
			display: none;
		}

		.category {
			padding: 20rpx 60rpx;
			border-radius: 50px;
			background: rgba(255, 255, 255, 0.08);
			cursor: pointer;
			transition: all 0.3s ease;
			font-weight: 500;
			border: 1px solid rgba(255, 255, 255, 0.1);
			font-size: 0.9rem;
			white-space: nowrap;
			flex-shrink: 0;

			display: inline-block;
			margin-right: 12rpx;
		}

		.category.active {
			background: linear-gradient(135deg, var(--primary), #6a11cb);
			box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);
			border-color: transparent;
		}

	}

	/* 卡片网格*/
	.lottery-navs {
		padding: 20rpx;
		display: grid;
		// 1列吧，2列太丑了
		grid-template-columns: repeat(1, 1fr);
		gap: 40rpx;
		margin-top: 20rpx;
	}

	.lottery-card {
		border-radius: 20px;
		padding: 40rpx;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
		background: var(--card-bg);
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	/* HOT 标签样式 */
	.lottery-card-tag {
		position: absolute;
		top: 6rpx;
		left: -20rpx;
		// background: #4ecdc4; 
		color: #fff;
		font-size: 20rpx;
		padding: 5rpx 20rpx;
		border-radius: 5px;
		white-space: nowrap;
		z-index: 1;
		transform: rotate(-45deg);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.hot-tag {
		background: #ff4d4f;
	}

	.new-tag {
		background: #4ecdc4;
	}

	.lottery-card:active {
		transform: scale(0.98);
		background: rgba(255, 255, 255, 0.12);
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

	.lottery-card {
		animation: fadeIn 0.5s ease forwards;
		opacity: 0;
	}

	/* 为每个卡片设置不同的动画延迟 */
	@for $i from 1 through 24 {
		.lottery-card:nth-child(#{$i}) {
			animation-delay: $i * 0.1s;
		}
	}


	.title {
		font-size: 1.3rem;
		font-weight: 700;
		display: block;
		margin-bottom: 12px;
		background: linear-gradient(to right, var(--accent), var(--secondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.content-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 2;
		position: relative;


		.text-container {
			flex: 1;
			padding-right: 15rpx;
		}


		.description {
			font-size: 0.85rem;
			color: rgba(255, 255, 255, 0.75);
			line-height: 1.5;
		}

		.feature-image {
			width: 120rpx;
			height: 120rpx;
			object-fit: contain;
			filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
			transition: all 0.3s ease;
			z-index: 2;
		}
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 15px;
		z-index: 2;
		position: relative;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.6);
	}
</style>