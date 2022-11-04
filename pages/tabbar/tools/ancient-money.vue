<template>
	<view class="container">
		<uni-section title="大写数字" type="line" titleFontSize="18px" padding>
			<view class="">
			大写数字是中国特有的数字书写方式，利用与数字同音的汉字取代数字，以防止数目被涂改。 据考证，大写数字最早是由武则天发明，后经朱元璋改进完善。</view>
		<br/>
		一般文书和商业财务票据上的数字都要采用汉字数码大写: 壹、贰、叁、肆、伍、陆、柒、捌、玖、拾、佰、仟。
		</uni-section>
		
		<uni-section title="关于中文大写金额对比" type="line" titleFontSize="18px" padding>
			<uni-grid :column="16" :show-border="false" :square="false" @change="converChange">
				<uni-grid-item v-for="(item ,index) in numList" :index="index" :key="index">
						<text class="uni-body">{{item}}</text>
				</uni-grid-item>
			</uni-grid>
			<uni-grid :column="16" :show-border="false" :square="false" @change="converChange">
				<uni-grid-item v-for="(item ,index) in cnList" :index="index" :key="index">
						<text class="uni-body">{{item}}</text>
				</uni-grid-item>
			</uni-grid>
		</uni-section>

		<uni-section title="内容" type="line" titleFontSize="18px" padding>
			<uni-forms :modelValue="params">
				<textarea class="text-box" maxlength=-1 :value="content" @input="bindTextAreaBlur"
					placeholder="请输入需要转换的数字" />
			</uni-forms>
			<button type="primary" class="margin-top" @click="calc">转换</button>

		</uni-section>

		<uni-section title="结果" type="line" titleFontSize="18px" padding>
			<textarea class="text-box" maxlength=-1 :value="result" @input="bindTextResult" placeholder="请输入需要计算的内容" />
			<uni-forms :modelValue="params">

			</uni-forms>
			<button type="primary" class="margin-top" @click="copyContent">复制结果</button>
			<button type="primary" class="margin-top" @click="clearContent">清空内容</button>
		</uni-section>



	</view>
</template>

<script>
	import {
		convertToCnMoney,
		copyData,
		isCluderChar
	} from '@/utils/Tools.js';
	export default {
		data() {
			return {
				numList: ['0', '1','2','3','4','5','6','7','8','9','十','百','千','万','亿','元'],
				cnList: ['零', '壹', '贰','叁','肆','伍','陆','柒','捌','玖','拾','佰','仟','万','亿','圆'],
				content: '',
				result: '',
			}
		},
		// onLoad：第一次创建页面执行
		onLoad() {
		},
		// onShow：每次进入页面都会执行
		onShow() {

		},
		//分享
		onShareAppMessage(res) {
			if (res.from === 'menu') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '古代大写金额数字不会写？这个转换器了解一下',
				path: '/pages/tabbar/tools/ancient-money'
			}
		},
		methods: {
			bindTextAreaBlur(e) {
				if (isCluderChar(e.detail.value)) {
					uni.showToast({
						title: '内容不能有字符',
						icon: "error",
						duration: 1000
					});
					return false;
				}
				this.content = e.detail.value;
				this.result = convertToCnMoney(this.content);
			},
			bindTextResult(e) {
				this.result = e.detail.value;
			},
			calc() {
				if (!this.content) {
					uni.showToast({
						title: '内容不能为空',
						icon: "error",
						duration: 1000
					});
					return false;
				}
				this.result = convertToCnMoney(this.content);
			},
			copyContent() {
				copyData(this.result);
			},
			clearContent() {
				this.content = '';
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
