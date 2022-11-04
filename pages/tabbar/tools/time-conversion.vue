<template>
	<view class="container">
		<uni-section title="计算日期差" type="line" titleFontSize="18px" padding>
			<uni-forms :modelValue="params">
				<uni-forms-item class="margin-top" label="日期范围:" label-width="80px">
					<uni-datetime-picker v-model="range" type="daterange" />
				</uni-forms-item>
				<uni-forms-item class="margin-top" label="相差天数:" label-width="80px">
					<input class="pinput" type="text" v-model="params.days" placeholder="结果" />
				</uni-forms-item>
			</uni-forms>
		</uni-section>


		<uni-section title="时间戳转换" type="line" titleFontSize="18px" padding>
			<uni-forms :modelValue="params">
				<uni-forms-item class="margin-top" label="选择日期:" label-width="100px">
					<uni-datetime-picker returnType="timestamp" type="datetime" v-model="dateTime" @change="changeTimestamp($event)" />
				</uni-forms-item>
				
				<uni-forms-item class="margin-top" label="时间戳(毫秒):" label-width="100px">
					<input class="pinput" type="text" v-model="params.timestampValue" placeholder="结果" />
				</uni-forms-item>
			</uni-forms>
			<button type="primary" class="margin-top" @click="copyTimestamp">复制时间戳</button>
		</uni-section>
		
		<uni-section title="日期加减天数" type="line" titleFontSize="18px" padding>
			<uni-forms :modelValue="params">
				<uni-forms-item class="margin-top" label="选择日期:" label-width="100px">
					<uni-datetime-picker type="datetime" v-model="params.addDatetime" @change="changeAddDateTime" />
				</uni-forms-item>
				
				<uni-forms-item class="margin-top" label="加/减天数:" label-width="100px">
					<input class="pinput" type="text" @input="addDayChange" v-model="params.addDay" placeholder="负数是减,正数是加" />
				</uni-forms-item>
				
				<uni-forms-item class="margin-top" label="结果日期:" label-width="100px">
					<input class="pinput" type="text" v-model="params.addResultDatetime" placeholder="加/减之后的日期" />
				</uni-forms-item>
			</uni-forms>
			<button type="primary" class="margin-top" @click="copyAddResultDate">复制结果日期</button>
			
		</uni-section>


	</view>
</template>

<script>
	import {
		copyData,
		dateFormat,
		getDiffDay,
		getTimestampByDate,
		getDateAddOrSubDay
	} from '@/utils/Tools.js';
	export default {
		data() {
			return {
				params: {
					days: '10',
					timestampValue: '',
					addDatetime:'',
					addDay:'-1',
					addResultDatetime:''
				},
				dateTime:'',
				range: ["2022-11-01", "2022-11-11"],
			}
		},
		// onLoad：第一次创建页面执行
		onLoad() {
			this.dateTime=dateFormat(new Date());
			this.params.addDatetime=dateFormat(new Date());
			this.params.timestampValue=getTimestampByDate(this.dateTime);
			this.params.addResultDatetime = getDateAddOrSubDay(Number(this.params.addDay),this.params.addDatetime);
		},
		// onShow：每次进入页面都会执行
		onShow() {

		},
		watch: {
			range(newval) {
				this.params.days = getDiffDay(this.range[0], this.range[1]);
			}
		},
		//分享
		onShareAppMessage(res) {
			if (res.from === 'menu') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '还在手算日期呢？日期加减计算器值得拥有',
				path: '/pages/tabbar/tools/time-conversion'
			}
		},
		methods: {
			changeTimestamp(e) {
				this.params.timestampValue=Number(e).toString();
			},
			changeAddDateTime(e) {
				this.params.addDatetime=e;
			},
			addDayChange(e){
				this.params.addDay=e.detail.value;
				//更新结果日期
				this.params.addResultDatetime = getDateAddOrSubDay(Number(this.params.addDay),this.params.addDatetime);
			},
			copyTimestamp() {
				copyData(this.params.timestampValue);
			},
			copyAddResultDate() {
				copyData(this.params.addResultDatetime);
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
