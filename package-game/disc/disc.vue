<template>
	<view class="content">
		<view class="topic-name">{{topic.topicName}}</view>
		<view id="app">
			<view class="container" v-if="circle.list && circle.list.length>0">
				<view class="circle one">
					<view class="position-box"
						v-bind:style="{transform:'rotate('+circle.initAngle+'deg)', '-webkit-transition-duration': times}">
						<view v-for="(item, index) in circle.list" :key="index" class="other-item"
							v-bind:style="{ transform: 'rotate('+avgAngle*(index)+'deg)skewX(45deg)' }">
							<span v-bind:style="{transform: 'rotate(0deg)skewX(-45deg)' }">{{item.name}}</span>
						</view>
					</view>
				</view>
				<view class="circle circle-center">
					<view class="go" @click="rotateAll">抽奖</view>
				</view>

				<view class="arrowhead-box">
					<view class="arrowhead"></view>
				</view>
			</view>
			<view v-show="result" style="clear: both;margin-top: 20upx;color: #FF0033;">结果：{{result}}</view>
			<view v-show="desc" style="clear: both;margin: 10rpx 0rpx;color: #FF0033;">{{desc}}</view>
		</view>

		<!-- 编辑主题 -->
		<cl-edit-topic :show="showEdit" :data="topic" @save="handlerSave" @close="closeEdit" />

		<!-- 设置 -->
		<cl-fly-settings :show="showSetting" :options="topicOptions" @close="operateSetting" @apply="changeVersion"
			@edit="handleEdit" />

		<view class="action-btn">
			<button v-if="!isDevOrTrial" class="btn chooseBtn" @click="chooseTopic">选择主题</button>
			<button class="btn goBtn" @click="rotateAll">开始抽奖</button>
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
					}]
				},
				key: 'normal',
				circle: {
					initAngle: 0,
					list: []
				},
				isRotating: false,
				times: '2s',
				count: 0,
				result: "",
				desc: "",
			};
		},
		onShow() {
			console.log('App Show');
		},
		onLoad() {
			this.onloadData();
			this.init();
			this.isDevOrTrial = this.$version.isDevOrTrialVersion();
		},
		computed: {
			// 动态计算每个奖项的夹角
			avgAngle() {
				return 360 / (this.circle.list.length || 1);
			},
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
					"🎡 幸运大转盘免费抽！iPhone、红包、优惠券... 100%有奖，手慢无！点我马上转👉",
					"「🔥 火爆进行中！幸运大转盘，每日免费抽奖机会快用掉！大奖等你抱回家🎁"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'pages/fun/child/disc/disc',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					}) // 朋友圈强制要求 imageUrl [[7]]
				};
			},
			handleEdit(newVersion) {
				this.key=newVersion;
				this.topic = this.topicMap[newVersion];
				this.showEdit = true;
			},
			handlerSave(res) {
				this.topicMap[this.key] = res;
				this.topic = res;
				this.init();
				// 保存缓存
				uni.$u.vuex('store_topics_map', JSON.stringify(this.topicMap));
			},
			closeEdit() {
				this.showEdit = false;
			},
			// 切换版本
			changeVersion(newVersion) {
				this.key=newVersion;
				this.topic = this.topicMap[newVersion];
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
				// 1. 强制截断到最多 8 个奖项
				// 个数不够会导致样式有问题，他喵的有点菜先兼容一下
				const MAX_ITEMS = 8;
				const rawList = this.topic.list.slice(0, MAX_ITEMS);

				// 2. 不足 8 个时，用 "再来一次" 补全
				const needed = MAX_ITEMS - rawList.length;
				const fillItem = {
					name: "再来一次"
				};

				// 3. 合并最终列表
				const finalList = [...rawList, ...Array(needed).fill(fillItem)];

				this.circle.list = finalList;
			},
			rotateAll() {
				// 防止重复点击
				if (this.isRotating) return;
				this.isRotating = true;

				// 生成随机旋转角度（720-1080度）
				const randomAngle = 720 + Math.floor(Math.random() * 360);
				this.circle.initAngle += randomAngle;

				// 动画结束后显示结果
				setTimeout(() => {
					uni.$emit('global-user-interaction');
					// 播放音效（带错误处理）
					try {
						this.$soundManager.play("sound4");
					} catch (error) {
						console.warn('音效播放失败:', error);
					}
					// 计算最终奖项
					const item = this.calculatePrize();
					this.result = item.name;
					this.desc = item.desc;
					this.isRotating = false;
				}, 2000);
			},
			/**
			 * 计算获奖索引
			 * @returns {Object} 奖项对象
			 */
			calculatePrize() {
				// 总旋转角度取模360，得到最终偏移角度
				const finalAngle = this.circle.initAngle % 360;
				// 根据偏移角度计算奖项索引
				const index = Math.floor(finalAngle / this.avgAngle);
				// 反转索引顺序（根据实际旋转方向调整）
				const adjustedIndex = this.circle.list.length - 1 - index;
				return this.circle.list[adjustedIndex] || this.circle.list[0];
			}
		}
	};
</script>

<style scoped lang="scss">
	page {
		height: 100%;
		background: #ffe;
	}

	.content {
		text-align: center;
		
		.topic-name{
			margin:40rpx 0rpx;
			font-size: 60rpx;
			font-weight: bold;
			color: #FF6666;
		}
	}

	#app {
		height: 700upx;
		width: 700upx;
		margin: 0px auto;
		margin-bottom: 220rpx;
	}

	.container {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 50%;
		z-index: 0;
	}

	.circle {
		position: absolute;
		border-radius: 50%;
	}

	.one {
		width: 98%;
		height: 98%;
		background: #eee;
		z-index: 1;
		top: 1%;
		left: 1%;
	}

	.circle-center {
		width: 20%;
		height: 20%;
		z-index: 999;
		left: 40%;
		top: 40%;
		background: #FF0033;
		color: #fff;
		text-align: center;
	}

	.go {
		width: 100%;
		height: 100%;
		font-size: 1.3em;
		padding-top: 26%;
	}

	.position-box {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 50%;
		color: #FFFFFF;
	}

	.position-box .other-item {
		position: absolute;
		transform-origin: left top;
		width: 50%;
		height: 50%;
		left: 50%;
		top: 50%;

	}

	.position-box .other-item:nth-child(odd) {
		background: #FF8C00;
	}

	.position-box .other-item:nth-child(even) {
		background: #FA8072;
	}

	.position-box .other-item span {
		display: inline-block;
		text-align: center;
		padding-top: 50upx;

		text-orientation: upright;
		writing-mode: lr;
		width: 80px;
	}

	.rotate {
		transform: rotate(720deg);
		-ms-transform: rotate(720deg);
		/* IE 9 */
		-moz-transform: rotate(720deg);
		/* Firefox */
		-webkit-transform: rotate(720deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(720deg);
		-webkit-transition-duration: 3s;
	}

	.arrowhead-box {
		position: absolute;
		width: 10%;
		height: 10%;
		left: 45%;
		top: 45%;
		z-index: 9;
	}

	.arrowhead {
		height: 2px;
		width: 400%;
		background: red;
		margin-top: 50%;
		margin-left: 50%;
	}

	.action-btn {
		margin-top: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 40rpx;

		.btn {
			padding: 10rpx 40rpx;
			color: #fff;
			font-size: 36rpx;
			font-weight: bold;
			background: #FF6666;
			border-radius: 20rpx;
		}
	}
</style>