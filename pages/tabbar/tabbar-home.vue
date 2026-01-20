<template>
	<view class="container" :class="{ 'dark-mode': darkMode }">
		<!-- 头部 -->
		<view class="header">
			<text class="app-title">实用<text class="highlight">有趣工坊</text></text>
			<view class="dark-mode-toggle" @click="toggleDarkMode">
				<cl-icon :type="darkMode ? 'icon-yueliang' : 'icon-taiyang'" :color="darkMode ? '#FFE' : '#FFF'"
					size="25"></cl-icon>
				<text>{{ darkMode ? '日间模式' : '夜间模式' }}</text>
			</view>
		</view>

		<!-- 搜索框 -->
		<view class="search-container">
			<input class="search-box" placeholder="搜索工具..." v-model="searchText" @input="filterTools"
				:class="{ 'dark-input': darkMode }" />
		</view>

		<!-- 分类标签 -->
		<scroll-view class="categories" scroll-x>
			<view v-for="category in categories" :key="category.id" class="category-item"
				:class="{ active: activeCategory === category.id }" @click="setActiveCategory(category.id)">
				{{ category.name }}
			</view>
		</scroll-view>

		<!-- 工具网格 -->
		<view class="tools-grid">
			<view v-for="(tool,index) in filteredTools" :key="index" class="tool-card" @click="selectTool(tool)">
				<view class="icon-container">
					<cl-icon :type="tool.icon" color="#fff" size="30"></cl-icon>
				</view>
				<view class="tool-name">{{ tool.name }}</view>
				<text class="tool-desc">{{ tool.desc }}</text>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				darkMode: false,
				searchText: '',
				activeCategory: 'all',
				categories: [{
						id: 'all',
						name: '全部工具'
					},
					{
						id: 'query',
						name: '查询工具'
					},
					{
						id: 'generate',
						name: '生成工具'
					},
					{
						id: 'life',
						name: '生活工具'
					},
					{
						id: 'convert',
						name: '转换工具'
					},
					
					
					{
						id: 'encrypt',
						name: '加密工具'
					}
				],
				tools: [{
						name: '金额大写',
						icon: 'icon-jinedaxie',
						desc: '财务专用大写金额',
						category: 'convert',
						path: 'ancientMoney'
					},
					{
						name: '时间计算器',
						icon: 'icon-riqijisuan',
						desc: '日期计算与转换',
						category: 'convert',
						path: 'timeConversion'
					},

					{
						name: '二维码生成',
						icon: 'icon-erweima',
						desc: '生成与识别二维码',
						category: 'generate',
						path: 'qrcode'
					},
					{
						name: '生肖查询',
						icon: 'icon-shengxiao',
						desc: '生肖属相查询',
						category: 'query',
						path: 'zodiac'
					},

					{
						name: '手持弹幕',
						icon: 'icon-danmu',
						desc: '个性弹幕随心而发',
						category: 'generate',
						path: 'barrage'
					},

					{
						name: '密码生成器',
						icon: 'icon-mima',
						desc: '生成高强度密码',
						category: 'generate',
						path: 'pwdGen'
					},
					{
						name: '节日头像',
						icon: 'icon-touxiang',
						desc: '制作专属节日头像',
						category: 'generate',
						path: 'avatarMix'
					},
					{
						name: '单位换算',
						icon: 'icon-danweizhuanhuan',
						desc: '多种单位自由转换',
						category: 'convert',
						path: 'unit'
					},
					{
						name: 'BMI计算器',
						icon: 'icon-shentizhiliangzhishu',
						desc: '身体质量指数计算',
						category: 'life',
						path: 'bmi'
					},{
						name: '血型查询',
						icon: 'icon-xiexing',
						desc: '预测子女血型概率',
						category: 'life',
						path: 'bloodType'
					},{
						name: '电子木鱼',
						icon: 'icon-muyu',
						desc: '电子木鱼，心静则明',
						category: 'life',
						path: 'woodenFish'
					},{
						name: '星座',
						icon: 'icon-xingzuo',
						desc: '星语解码，知己知彼',
						category: 'query',
						path: 'star'
					},
					{
						name: '进制转换',
						icon: 'icon-erjinzhi',
						desc: '支持多种进制转换',
						category: 'convert',
						path: 'baseConversion'
					},
					{
						name: 'BASE64',
						icon: 'icon-base64',
						desc: 'BASE64加解密',
						category: 'encrypt',
						path: 'base64'
					},
					{
						name: 'HASH',
						icon: 'icon-hash',
						desc: '摘要算法加密',
						category: 'encrypt',
						path: 'hash'
					},
					{
						name: '非对称加密',
						icon: 'icon-gongsiyao',
						desc: '非对称加解密',
						category: 'encrypt',
						path: 'rsa'
					},
					{
						name: '对称加密',
						icon: 'icon-duichengjiami',
						desc: '对称加解密',
						category: 'encrypt',
						path: 'symmetry'
					},
					{
						name: '房贷计算器',
						icon: 'icon-jisuanqi',
						desc: '房贷计算器',
						category: 'query',
						path: 'houseLoan'
					},
					{
						name: '生理周期追踪',
						icon: 'icon-shengliqi',
						desc: '生理周期记录及查询',
						category: 'query',
						path: 'cycle'
					},
					{
						name: '饮食热量计算',
						icon: 'icon-yinshireliang',
						desc: '饮食热量计算器',
						category: 'life',
						path: 'calorie'
					},
					{
						name: '啪啪啪计算',
						icon: 'icon-peidui',
						desc: '亲密关系时间预测',
						category: 'query',
						path: 'papaCalc'
					},
					{
						name: '上班性价比',
						icon: 'icon-shangban',
						desc: '这个班值不值得上',
						category: 'query',
						path: 'workValue'
					},
					{
						name: '开店盈亏计算',
						icon: 'icon-chengbengusuan',
						desc: '成本利润一键速算',
						category: 'query',
						path: 'shopProfit'
					},
					{
						name: '太岁查询',
						icon: 'icon-long',
						desc: '流年太岁生肖查询',
						category: 'query',
						path: 'taisui'
					},
					{
						name: '图片拼接',
						icon: 'icon-pinjie',
						desc: '多图自由拼接',
						category: 'convert',
						path: 'imageStitch'
					},
					{
						name: '图片切割',
						icon: 'icon-tupian',
						desc: '自定义花式切图',
						category: 'convert',
						path: 'imageCut'
					},
					{
						name: '生肖流年分析',
						icon: 'icon-shengxiao',
						desc: '生肖流年吉凶分析',
						category: 'query',
						path: 'evilStar'
					},
					{
						name: '手写签名',
						icon: 'icon-qianming',
						desc: '手写签名秒变电子版',
						category: 'generate',
						path: 'signature'
					},
					{
						name: '身份验证器',
						icon: 'icon-authenticator',
						desc: '动态验证码生成器',
						category: 'generate',
						path: '2fa'
					},
					{
						name: '栽种爱情树',
						icon: 'icon-qinglv',
						desc: '定制你们的专属浪漫',
						category: 'generate',
						path: 'loveTreeIndex'
					},
					{
						name: '天干地支',
						icon: 'icon-yueliang',
						desc: '天干地支·传统历法',
						category: 'query',
						path: 'ganzhi'
					},
				],
				filteredTools: []
			};
		},
		mounted() {
			this.filteredTools = [...this.tools];
		},
		onShow() {
			this.$version.checkUpdate();
		},
		//分享
		onShareAppMessage(res) {
			return this.generateShareConfig();
		},
		onShareTimeline() {
			return this.generateShareConfig(true);
		},
		methods: {
			toggleDarkMode() {
				this.darkMode = !this.darkMode;
			},
			setActiveCategory(categoryId) {
				this.activeCategory = categoryId;
				this.filterTools();
			},
			filterTools() {
				const searchTerm = this.searchText.toLowerCase();
				this.filteredTools = this.tools.filter(tool => {
					const categoryMatch = this.activeCategory === 'all' || tool.category === this.activeCategory;
					const searchMatch = !searchTerm ||
						tool.name.toLowerCase().includes(searchTerm) ||
						(tool.desc && tool.desc.toLowerCase().includes(searchTerm));
					return categoryMatch && searchMatch;
				});
			},
			selectTool(tool) {
				this.$Router.push({
					name: tool.path
				});
			},
			generateShareConfig(forTimeline = false) {
				const defaultTemplates = [
					"「效率翻倍！这可能是全网最快的小工具合集，点击即用，省时又省心！ 」#实用工具",
					"「🤫“偷偷测了室友的星座合盘…结果震惊！TA竟是你命中的‘贵人’？🔍速查朋友默契值」",
					"「❓“输入名字首字母+生日，解锁你的『隐藏人格』！——据说90%人不知道自己有第二天赋…”」",
					"✨“转发这个『量子锦鲤』，24小时内会有意外好消息！科学玄学双buff加持🔬”"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'pages/tabbar/tabbar-home',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
	}

	.container {
		padding: 20rpx;
		// background: linear-gradient(135deg, #6e8efb, #a777e3);
		background: linear-gradient(135deg, #8ec5fc, #e0c3fc);
		transition: background 0.5s ease;
		max-width: 750rpx;
		margin: 0 auto;
		color: #333;
		min-height: 100vh;
	}

	/* 头部样式 */
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
		padding: 30rpx 0;
		color: white;
	}

	.app-title {
		font-size: 48rpx;
		font-weight: 700;
		text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

	}

	.app-title .highlight {
		color: #ffde59;
	}

	.dark-mode-toggle {
		background: rgba(255, 255, 255, 0.2);
		border: none;
		border-radius: 50px;
		padding: 8px 15px;
		color: white;
		font-size: 14px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 5px;
		transition: all 0.3s ease;
	}

	/* 搜索框样式 */
	.search-container {
		position: relative;
		margin-bottom: 40rpx;
	}

	.search-box {
		width: 84%;
		padding: 25rpx 30rpx 25rpx 80rpx;
		border-radius: 50rpx;
		border: none;
		font-size: 28rpx;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.search-box:focus {
		outline: none;
		box-shadow: 0 8rpx 50rpx rgba(0, 0, 0, 0.15);
		background: white;
	}

	.search-icon {
		position: absolute;
		left: 35rpx;
		top: 50%;
		transform: translateY(-50%);
		color: #a777e3;
		font-size: 36rpx;
	}

	/* 分类标签样式 */
	.categories {
		display: flex;
		overflow-x: auto;
		padding: 20rpx 0 40rpx;
		gap: 24rpx;
		margin-bottom: 30rpx;

		white-space: nowrap;
		overflow-x: auto;
	}

	.categories::-webkit-scrollbar {
		display: none;
	}

	.category-item {
		// flex: 0 0 auto;
		padding: 15rpx 36rpx;
		border-radius: 60rpx;
		background: rgba(255, 255, 255, 0.2);
		color: #FFF;
		font-size: 28rpx;
		cursor: pointer;
		transition: all 0.3s ease;
		border: 2rpx solid rgba(255, 255, 255, 0.3);

		display: inline-block;
		margin-right: 12rpx;
	}

	.category-item.active {
		background: rgba(255, 255, 255, 0.9);
		color: #6e8efb;
		font-weight: 600;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
	}

	/* 工具网格样式 */
	.tools-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 30rpx;
		margin-top: 20rpx;
	}

	.tool-card {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 32rpx;
		padding: 30rpx 15rpx;
		text-align: center;
		transition: all 0.3s ease;
		box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.08);
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.tool-card:active {
		transform: translateY(-10rpx);
		box-shadow: 0 24rpx 50rpx rgba(0, 0, 0, 0.15);
	}

	.tool-card::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 8rpx;
		background: linear-gradient(90deg, #6e8efb, #a777e3);
	}

	.icon-container {
		width: 100rpx;
		height: 100rpx;
		margin: 0 auto 30rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48rpx;
		color: white;
		background: linear-gradient(135deg, #6e8efb, #a777e3);
		box-shadow: 0 8rpx 20rpx rgba(106, 142, 251, 0.4);
	}

	.tool-name {
		font-size: 30rpx;
		font-weight: 600;
		color: #1f2937;
		line-height: 1.4;
	}

	.tool-desc {
		font-size: 20rpx;
		color: #888;
		margin-top: 10rpx;
		line-height: 1.4;
	}


	/* 热门推荐样式 */
	.section-title {
		font-size: 36rpx;
		font-weight: 600;
		color: white;
		margin: 50rpx 0 30rpx;
		padding-left: 20rpx;
		position: relative;
	}

	.section-title::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 10rpx;
		height: 36rpx;
		background: #ffde59;
		border-radius: 10rpx;
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

	.tool-card {
		animation: fadeIn 0.5s ease forwards;
		opacity: 0;
	}

	/* 为每个卡片设置不同的动画延迟 */
	@for $i from 1 through 34 {
		.tool-card:nth-child(#{$i}) {
			animation-delay: $i * 0.1s;
		}
	}

	/* 暗黑模式样式 */
	.dark-mode {
		background: linear-gradient(135deg, #23232e, #14141a);

		.app-title {
			background: linear-gradient(90deg, #818cf8, #a78bfa);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;

			&::before {
				background: linear-gradient(to bottom, #818cf8, #a78bfa);
			}
		}

		.dark-mode-toggle {
			background: rgba(30, 41, 59, 0.7);
			box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

			i {
				color: #cbd5e1;
			}
		}

		.search-box {
			background: rgba(15, 23, 42, 0.7);
			color: #e2e8f0;
			border: 1px solid rgba(255, 255, 255, 0.05);
			box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);

			&:focus {
				box-shadow: 0 10px 40px rgba(124, 58, 237, 0.2);
			}

			&::placeholder {
				color: #94a3b8;
			}
		}

		.section-title {
			color: #a78bfa;
		}

		.category-item {
			background: rgba(15, 23, 42, 0.7);
			color: #cbd5e1;
			border: 1px solid rgba(255, 255, 255, 0.05);
			box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

			&:hover {
				box-shadow: 0 8px 25px rgba(124, 58, 237, 0.2);
			}

			&.active {
				box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3);
			}
		}

		.tool-card {
			background: rgba(15, 23, 42, 0.7);
			box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
			border: 1px solid rgba(255, 255, 255, 0.05);

			&:hover {
				box-shadow: 0 15px 40px rgba(124, 58, 237, 0.2);
			}
		}

		.tool-name {
			color: #e2e8f0;
		}

		.tool-desc {
			color: #94a3b8;
		}

		.footer {
			color: #94a3b8;
			border-top: 1px solid rgba(255, 255, 255, 0.05);
		}
	}
</style>