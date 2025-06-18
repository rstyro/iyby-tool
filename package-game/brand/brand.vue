<template>
	<view class="content">
		<view class="topic-name">{{topic.topicName}}</view>
		<view class="flex-container" v-if="brands.list && brands.list.length>0"
			:class="{'shuffle-animation': isShuffling}" :style="{height: containerHeight}">
			<view v-for="(item,index) in brands.list" :key="index" class="container" @click="open(index)">
				<view class="brand" v-bind:style="{transform: 'rotateY('+item.frontAngle+'deg)'}">
					<view class="brand-front">
					</view>
				</view>
				<view class="brand" v-bind:style="{transform: 'rotateY('+item.backAngle+'deg)'}">
					<view class="brand-back">
						<view class="brand-text">{{item.backText}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="descText">{{descText}}</view>

		<!-- 编辑主题 -->
		<cl-edit-topic :show="showEdit" :data="topic" @save="handlerSave" @close="closeEdit" />

		<!-- 设置 -->
		<cl-fly-settings :show="showSetting" :options="topicOptions" @close="operateSetting" @apply="changeVersion"
			@edit="handleEdit" />

		<view class="action-btn">
			<button v-if="!isDevOrTrial" class="btn chooseBtn" @click="chooseTopic">选择主题</button>
			<button class="btn openAllBtn" @click="allOpenBrands">{{openAllBrands}}</button>
			<button class="btn sortBtn" @click="shuffleBrands">{{shuffleSort}}</button>
		</view>

	</view>
</template>

<script>
	import {
		prizeMap
	} from '@/data/prize.js';

	export default {
		data() {
			return {
				isDevOrTrial:true,
				showEdit: false,
				showSetting: false,
				topicMap: {},
				topic: {
					topicName: '',
					list: [{
						name: "奖品1",
						desc: "奖品1描述"
					}, {
						name: "奖品2",
						desc: "奖品2描述"
					}, {
						name: "奖品3",
						desc: "奖品3描述"
					}]
				},
				key: 'normal',
				containerHeight: 'auto',
				isShuffling: false,
				shuffleSort: "洗牌",
				openAllBrands: "全开",
				allOpen: false,
				operateState: {
					open: "全开",
					close: "全关"
				},
				brands: {
					times: '1.5s',
					list: [{
						frontText: "请翻牌",
						backText: "在家睡觉",
						desc: '',
						isOpen: false,
						frontAngle: 0,
						backAngle: -180
					}],
					descList: []
				},
				descText: '',
				topicName: "默认"

			};
		},
		onShow() {

		},
		onLoad() {
			this.onloadData();
			this.init();
			this.isDevOrTrial = this.$version.isDevOrTrialVersion();
		},
		computed: {
			topicOptions() {
				// 示例：遍历所有键，组装选项
				let options = [];
				Object.keys(this.topicMap).forEach(key => {
					let item = {
						label: this.topicMap[key].topicName,
						value: key
					};
					if (key === 'cp' || key === 'love') {
						item.hot = true;
						item.hotText = 'HOT';
					}
					options.push(item)
				});
				return options;
			}
		},
		//分享
		onShareAppMessage(res) {
			return this.generateShareConfig();
		},
		onShareTimeline() {
			return this.generateShareConfig(true);
		},
		methods: {
			generateShareConfig(forTimeline = false) {
				const defaultTemplates = [
					"✨ 翻开即得奖！卡牌福利上线，**100%有惊喜**！红包、好礼翻出来~ 速戳参与➡️",
					"🎁 **隐藏大奖等你揭晓！**  玩翻牌，**最高XXX元/XX奖品** 可能就在下一张！快来翻👉"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'pages/fun/child/brand/brand',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					}) // 朋友圈强制要求 imageUrl [[7]]
				};
			},
			handleEdit(newVersion) {
				this.key = newVersion;
				this.topic = this.topicMap[newVersion];
				this.showEdit = true;
			},
			handlerSave(res) {
				this.topicMap[this.key] = res;
				this.topic = res;
				this.init();
				console.log("res::", res);
				// 保存缓存
				uni.$u.vuex('store_topics_map', JSON.stringify(this.topicMap));

			},
			closeEdit() {
				this.showEdit = false;
			},
			// 切换版本
			changeVersion(newVersion) {
				this.key = newVersion;
				this.topic = this.topicMap[this.key];
				this.init();
			},
			operateSetting() {
				this.showSetting = !this.showSetting;
			},
			chooseTopic() {
				this.showSetting = true;
			},
			onloadData() {
				var stopMap = this.store_topics_map;
				if (stopMap && Object.keys(stopMap).length > 0) {
					this.topicMap = JSON.parse(stopMap);
				} else {
					this.topicMap = prizeMap;
				}
				uni.$u.vuex('store_topics_map', JSON.stringify(this.topicMap));
				this.topic = this.topicMap[this.key];
			},
			init() {
				// 初始化数据
				if (this.topic && this.topic.list.length > 0) {
					this.brands.list = [];
					for (var i = 0; i < this.topic.list.length; i++) {
						const item = this.topic.list[i];
						let data = {
							frontText: "请翻牌",
							backText: item.name,
							desc: item.desc,
							isOpen: false,
							frontAngle: 0,
							backAngle: -180
						}
						// 重新放入
						this.brands.list.push(data);
					}
				}
				// 洗牌
				this.shuffleBrands();

			},
			//翻单个牌
			open(index) {
				uni.$emit('global-user-interaction');
				this.$soundManager.play("sound5");
				this.brands.list[index].isOpen = !this.brands.list[index].isOpen;
				if (this.brands.list[index].isOpen) {
					this.brands.list[index].frontAngle = 180;
					this.brands.list[index].backAngle = 0;
					this.descText = this.brands.list[index].desc || '';
				} else {
					this.brands.list[index].frontAngle = 0;
					this.brands.list[index].backAngle = -180;
					this.descText = '';
				}
			},
			//操作所有牌，全开全关
			operatorBrands() {
				this.descText = '';
				for (var index = 0; index < this.brands.list.length; index++) {
					if (this.allOpen) {
						this.openAllBrands = this.operateState.close;
						this.brands.list[index].isOpen = true;
						this.brands.list[index].frontAngle = 180;
						this.brands.list[index].backAngle = 0;
					} else {
						this.openAllBrands = this.operateState.open;
						this.brands.list[index].isOpen = false;
						this.brands.list[index].frontAngle = 0;
						this.brands.list[index].backAngle = -180;
					}
				}
			},
			allOpenBrands() {
				this.allOpen = !this.allOpen;
				this.operatorBrands();
			},
			//洗牌
			async shuffleBrands() {
				this.allOpen = false;
				//关牌再洗牌
				this.operatorBrands();
				// 获取容器当前高度
				const height = await this.getContainerHeight();
				if (height) {
					this.containerHeight = `${height}px`;
				}

				setTimeout(() => {
					this.brands.list = this.shuffleArr(this.brands.list, this.brands.list.length);
					this.startShuffleAnimation();
				}, 500);
			},

			// 新增获取高度方法
			async getContainerHeight() {
				// 等待50ms确保渲染完成
				await new Promise(resolve => setTimeout(resolve, 100));
				return new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.flex-container').boundingClientRect(data => {
						if (data && data.height !== undefined) {
							resolve(data.height);
						} else {
							reject(new Error('.flex-container not found or has no height'));
						}
					}).exec();
				});
			},
			shuffleArr(arr, num) {
				// 复制arr数组
				var _arr = arr.concat();
				var n = _arr.length;
				var result = [];

				// 先打乱数组
				while (n-- && num--) {
					var index = Math.floor(Math.random() * n); // 随机位置
					[_arr[index], _arr[n]] = [_arr[n], _arr[index]]; // 交换数据
					result.push(_arr[n]); // 取出当前最后的值，即刚才交换过来的值
				}
				return result;
			},
			// 洗牌动画
			startShuffleAnimation() {
				this.isShuffling = true;
				setTimeout(() => {
					this.$nextTick(() => {
						this.isShuffling = false;
						// 恢复自动高度
						this.containerHeight = 'auto';
					});
				}, 1000);
			}
		}
	};
</script>

<style lang="scss">
	page {}

	.content {
		min-height: 100vh;
		background: linear-gradient(135deg, #FFF9E3 0%, #FFEBC4 100%);
		margin: 0rpx;
		padding: 0upx;
		text-align: center;

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 200rpx;
			background: rgba(255, 222, 150, 0.15);
			/* 浅金色半透明层 */
			border-radius: 0 0 50% 50%/0 0 30% 30%;
			z-index: -1;
		}

		.topic-name {
			margin: 30rpx 0;
			font-size: 62rpx;
			font-weight: bold;
			color: #DAA520;
			/* 金色主题色 */
			text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
			letter-spacing: 1rpx;
			position: relative;
			display: inline-block;

			&::after {
				content: "";
				position: absolute;
				bottom: -10rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 120rpx;
				height: 4rpx;
				background: linear-gradient(90deg, transparent, #DAA520, transparent);
			}
		}


	}


	.flex-container {
		display: flex;
		flex-wrap: wrap;
		/* 当空间不足时自动换行 */

	}

	.container {
		position: relative;
		width: 30%;
		height: 300rpx;
		margin-top: 20upx;
		margin-left: 2.5%;
		transition: all 1s ease;
	}

	/* 收集动画 */
	.shuffle-animation .container {
		position: absolute;
		transition: all 1s ease;
	}


	/* 散开动画 */
	.flex-container:not(.shuffle-animation) .container {
		position: relative;
		width: 30%;
		height: 160px;
		margin-top: 20upx;
		margin-left: 2.5%;
	}


	.brand {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		transition: all 1.5s;
		backface-visibility: hidden;
		transform-style: preserve-3d;
		transform-origin: center;
		box-shadow: 0px 20px 15px -15px #999;

		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-color: #999;
	}

	.brand-front {
		// background: #ccc;
		width: 100%;
		height: 100%;
		// background: url("http://66dashun.xyz/static/images/lottery/brand-back1.jpg");
		background: url("http://66dashun.xyz/static/images/lottery/back1.png");
		background-size: 100% 100%;
	}

	.brand-back {
		// background: #C24241;
		// background: linear-gradient(135deg, #f8e5b0 0%, #e6c780 100%);
		// background: linear-gradient(135deg, #d4a017 0%, #b8860b 100%);
		background: linear-gradient(135deg, #FFD700 0%, #DAA520 100%);
		width: 100%;
		height: 100%;
		/*background: url("../images/brand-back1.jpg") ;*/
		display: flex;
		justify-content: center;

		&::before {
			content: "";
			position: absolute;
			top: 15rpx;
			left: 15rpx;
			right: 15rpx;
			bottom: 15rpx;
			border: 1px solid rgba(255, 215, 0, 0.8);
			/* 金色边框 */
			border-radius: 8rpx;
			z-index: 1;
		}
	}

	.brand-text {
		width: 80px;
		line-height: 24px;
		padding-top: 5px;
		margin: 0px auto;
		color: #5D3B09;
		display: flex;
		justify-content: center;
		align-items: center;
		/* 文字从上到下排列 */
		// writing-mode: vertical-rl;
		/* 保持文字直立 */
		// text-orientation: upright;
	}

	.descText {
		display: block;
		margin: 20rpx 0rpx;
		padding: 20rpx;
		// color: #FF0033;
		color: #8C6910;
		font-size: 35rpx;
	}


	.action-btn {
		margin-top: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 30rpx;

		.btn {
			padding: 15rpx 40rpx;
			color: #5D3B09;
			font-size: 36rpx;
			font-weight: bold;
			background: linear-gradient(to bottom, #FFD700, #DAA520);
			border-radius: 20rpx;
			box-shadow: 0 4rpx 12rpx rgba(139, 69, 19, 0.2);
			border: none;
			transition: all 0.3s ease;
			position: relative;
			overflow: hidden;
			margin-bottom: 40rpx;
		}
	}
</style>