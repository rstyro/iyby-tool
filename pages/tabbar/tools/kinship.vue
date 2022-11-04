<template>
	<view class="container">
		<uni-section title="亲戚计算器" type="line" titleFontSize="18px" padding>
			<view>
				每次遇到不常碰面的亲戚，一时难免不知道该怎么称呼，极其尴尬甚至被当作不懂礼貌。中国亲戚关系称呼计算器工具可以快速简单的查询家庭亲戚称呼。</view>
		</uni-section>
		<view class="main">
			<view>
				<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="button"
					activeColor="#4cd964"></uni-segmented-control>
				<view class="content">
					<view v-show="current === 0">
						<uni-forms class="margin-top">
							<uni-forms-item label="我的性别:" label-width="100px">
								<view class="margin-top-5">
									<uni-data-checkbox v-model="baseFormData.sex" :localdata="sexs"
										@change="changeSex" />
								</view>
							</uni-forms-item>

							<uni-forms-item label="称呼方式:" label-width="100px">
								<view class="margin-top-5">
									<uni-data-checkbox v-model="baseFormData.reverse" :localdata="reverses" />
								</view>
							</uni-forms-item>
						</uni-forms>
					</view>
					<view v-show="current === 1">
						<view class="margin-top"></view>
					</view>

					<textarea class="text-box" maxlength=-1 :value="content" @input="bindTextAreaBlur"
						:placeholder="current == 0?'称谓之间用 的 字分开':'请输入你要查询的称呼' " />
					<uni-grid :column="5" :show-border="false" :square="false" @change="addRelation">
						<uni-grid-item class="margin-top" v-for="(item ,index) in relation" :index="index" :key="index">
							<button style="width: 90%;" :disabled="disableIndex == index"
								type="primary">{{item}}</button>
						</uni-grid-item>
					</uni-grid>

					<view class="btn-box margin-top">
						<button type="default" @click="del">回退</button>
						<button type="warn" @click="clear">清空</button>
						<button type="primary" @click="calc">计算</button>
					</view>


					<uni-section class="margin-top" title="计算结果" type="line" titleFontSize="18px" padding>
						<textarea class="text-box" maxlength=-1 :value="result" @input="bindTextResult"
							placeholder="计算结果" />
					</uni-section>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import relationship from 'relationship.js';
	export default {
		data() {
			return {
				items: ['找称呼', '找关系'],
				current: 0,
				baseFormData: {
					sex: 1,
					reverse: 0,
					type:'default'
				},
				sexs: [{
					text: '男',
					value: 1
				}, {
					text: '女',
					value: 0
				}],
				reverses: [{
					text: '我称呼对方',
					value: 0
				}, {
					text: '对方称呼我',
					value: 1
				}],
				relation: ['父', '母', '夫', '妻', '儿', '女', '兄', '姐', '弟', '妹'],
				disableIndex: 2,
				content: '',
				result: ''
			}
		},
		// onLoad：第一次创建页面执行
		onLoad() {

		},
		//分享
		onShareAppMessage(res) {
			if (res.from === 'menu') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '过年别在叫错亲戚了，亲戚计算器，轻松搞定亲戚关系',
				path: '/pages/tabbar/tools/kinship'
			}
		},
		methods: {
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
				this.content='';
			},
			changeSex(e) {
				if (e.detail.value) {
					this.disableIndex = 2;
				} else {
					this.disableIndex = 3;
				}
			},
			bindTextAreaBlur(e) {
				this.content = e.detail.value;
			},
			bindTextResult(e) {
				this.result = e.detail.value;
			},
			addRelation(e) {
				let text = this.getRelationText(e.detail.index);
				if (this.content == "") {
					this.content = text;
				} else {
					this.content = this.content + "的" + text;
				}
			},
			getRelationText(index) {
				let text = "爸爸";
				if (index == 1) {
					text = "妈妈";
				} else if (index == 2) {
					text = "老公";
				} else if (index == 3) {
					text = "老婆";
				} else if (index == 4) {
					text = "儿子";
				} else if (index == 5) {
					text = "女儿";
				} else if (index == 6) {
					text = "哥哥";
				} else if (index == 7) {
					text = "姐姐";
				} else if (index == 8) {
					text = "弟弟";
				} else if (index == 9) {
					text = "妹妹";
				}

				// 男女判断
				if (index % 2 == 0) {
					this.disableIndex = 2;
				} else {
					this.disableIndex = 3;
				}
				return text;
			},
			del() {
				if (this.content) {
					let lastIndex = this.content.lastIndexOf("的");
					if (lastIndex > 0) {
						this.content = this.content.substring(0, lastIndex);
					} else {
						this.content = '';
					}
				}
			},
			clear() {
				this.content = '';
				this.disableIndex=this.baseFormData.sex?2:3;
			},
			calc() {
				if(this.current == 0){
					this.baseFormData.type="default";
				}else if(this.current == 1){
					this.baseFormData.type='chain';
				}
				let resultArr = relationship({
					text: this.content,
					reverse: this.baseFormData.reverse,
					sex: this.baseFormData.sex,
					type:this.baseFormData.type
				});
				
				this.result = resultArr.join("  或  ");
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.main {
			padding: 10px;
		}

		.margin-top-5 {
			margin-top: 5px;
		}

		.btn-box {
			display: flex;
			justify-content: space-between;

			button {
				width: 30%;
			}
		}
	}
</style>
