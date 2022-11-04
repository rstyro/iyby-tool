<template>
	<view class="container">
		<uni-section title="进制转换是什么" type="line" titleFontSize="18px" padding>
			<view class="">
				进制转换是人们利用符号来计数的方法。进制转换由一组数码符号和两个基本因素“基数”与“位权”构成。基数是指，进位计数制中所采用的数码（数制中用来表示“量”的符号）的个数。位权是指，进位制中每一固定位置对应的单位值。
			</view>
		</uni-section>

		<uni-section title="内容" type="line" titleFontSize="18px" padding>
			<uni-forms :modelValue="params">
				<uni-forms-item label="选择初始进制:" label-width="100px" name="key">
					<uni-data-select v-model="params.base" :localdata="baseList" @change="changeBase">
					</uni-data-select>
				</uni-forms-item>
				<textarea class="text-box" maxlength=-1 :value="content" @input="bindTextAreaBlur"
					placeholder="请输入需要计算的内容" />

				<uni-forms-item class="margin-top" label="二进制:" label-width="80px">
					<input class="pinput" type="text" v-model="base.r2" placeholder="结果" />
				</uni-forms-item>
				<uni-forms-item class="margin-top" label="八进制:" label-width="80px">
					<input class="pinput" type="text" v-model="base.r8" placeholder="结果" />
				</uni-forms-item>
				<uni-forms-item class="margin-top" label="十进制:" label-width="80px">
					<input class="pinput" type="text" v-model="base.r10" placeholder="结果" />
				</uni-forms-item>
				<uni-forms-item class="margin-top" label="十六进制:" label-width="80px">
					<input class="pinput" type="text" v-model="base.r16" placeholder="结果" />
				</uni-forms-item>

				<uni-forms-item class="margin-top" label="要转换的进制:" label-width="100px" name="key">
					<uni-data-select v-model="params.to" :localdata="baseList2" @change="changeTo">
					</uni-data-select>
				</uni-forms-item>
			</uni-forms>
			<button type="primary" class="margin-top" @click="calc">计算</button>

		</uni-section>

		<uni-section title="结果" type="line" titleFontSize="18px" padding>
			<textarea class="text-box" maxlength=-1 :value="result" @input="bindTextResult" placeholder="请输入需要计算的内容" />
			<uni-forms :modelValue="params">

			</uni-forms>
			<button type="primary" class="margin-top" @click="copyContent">复制计算后的内容</button>
			<button type="primary" class="margin-top" @click="clearContent">清空内容</button>
		</uni-section>



	</view>
</template>

<script>
	import {
		baseConversion,
		copyData,
		isCluderChar
	} from '@/utils/Tools.js';
	export default {
		data() {
			return {
				params: {
					base: 10,
					to: 2
				},
				baseList: [],
				baseList2: [],
				content: '',
				result: '',
				base: {
					r2: '',
					r8: '',
					r10: '',
					r16: ''
				}
			}
		},
		// onLoad：第一次创建页面执行
		onLoad() {
			this.initBaseList();
		},
		// onShow：每次进入页面都会执行
		onShow() {

		},
		methods: {
			bindTextAreaBlur(e) {
				if (this.params.base <= 10 && isCluderChar(e.detail.value)) {
					uni.showToast({
						title: '内容不能有字符',
						icon: "error",
						duration: 1000
					});
					this.initResult();
					return false;
				}
				this.content = e.detail.value;
				this.toResult();
			},
			bindTextResult(e) {
				this.result = e.detail.value;
			},
			changeBase(e) {
				this.params.base = e;
				this.toResult();
			},
			changeTo(e) {
				this.params.to = e;
			},
			initBaseList() {
				this.baseList = [];
				this.baseList2 = [];
				for (var i = 2; i <= 32; i++) {
					this.baseList.push({
						value: i,
						text: i + '进制'
					});
					this.baseList2.push({
						value: i,
						text: i + '进制'
					});
				}
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
				this.result = baseConversion(this.content, this.params.base, this.params.to)
			},
			copyContent() {
				copyData(this.result);
			},
			clearContent() {
				this.content = '';
			},
			initResult() {
				this.base.r2 = '';
				this.base.r8 = '';
				this.base.r10 = '';
				this.base.r16 = '';
			},
			toResult(){
				this.base.r2 = baseConversion(this.content, this.params.base, 2);
				this.base.r8 = baseConversion(this.content, this.params.base, 8);
				this.base.r10 = baseConversion(this.content, this.params.base, 10);
				this.base.r16 = baseConversion(this.content, this.params.base, 16);
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
