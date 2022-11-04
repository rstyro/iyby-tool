<template>
	<view class="content">
		<uni-section title="算法计算相关" type="line" titleFontSize="18px">
			<uni-card @click="toHashEncrypt">
				<view class="eti">消息摘要算法支持:</view>
				<text class="uni-body">MD5、SHA、HMAC、PBKDF2</text>
			</uni-card>

			<uni-card @click="toSymmetryEncrypt">
				<view class="eti">对称算法支持:</view>
				<text class="uni-body">AES、DES、3DES(Triple DES)、RC4、Rabbit</text>
			</uni-card>

			<uni-card @click="toRsaEncrypt">
				<view class="eti">非对称算法支持:</view>
				<text class="uni-body">RSA</text>
			</uni-card>

			<uni-card @click="toBase64Encrypt">
				<view class="eti">其他常用的编码支持:</view>
				<text class="uni-body">Base64</text>
			</uni-card>

		</uni-section>

		<uni-section title="转换计算工具" type="line" titleFontSize="18px">
			<uni-grid :column="2" :show-border="false" :square="false" @change="converChange">
				<uni-grid-item v-for="(item ,index) in converList" :index="index" :key="index">
					<uni-card>
						<text class="uni-body">{{item}}</text>
					</uni-card>
				</uni-grid-item>
			</uni-grid>
		</uni-section>

<!-- 
		<uni-section title="其他工具" type="line" titleFontSize="18px">
			<uni-grid :column="2" :show-border="false" :square="false" @change="otherChange">
				<uni-grid-item v-for="(item ,index) in otherList" :index="index" :key="index">
					<uni-card>
						<text class="uni-body">{{item}}</text>
					</uni-card>
				</uni-grid-item>
			</uni-grid>
		</uni-section> -->

	</view>
</template>

<script>
	import Encrypt from 'encryptlong';
	// Crypto-JS 支持 MD5、SHA、RIPEMD-160、HMAC、PBKDF2、AES、DES、3DES(Triple DES)等
	import CryptoJS from 'crypto-js';
	// rsa 
	import {
		convertToCnMoney,
		getZodiac,
		getTimestampByDate,
		getDateByTimestamp,
		baseConversion,
		baseTenToOther,
		getDateAddOrSubDay
	} from '@/utils/Tools.js';
	import relationship from 'relationship.js';

	export default {
		data() {
			return {
				canClick: true,
				converList: ['进制转换计算', '数字转大写金额',  '日期时间计算器','亲戚关系计算器'],
				otherList: ['二维码生成解析', '生肖查询', '节日头像合成', '氛围跑马灯']
			};
		},
		// onLoad：第一次创建页面执行
		onLoad() {},
		// onShow：每次进入页面都会执行
		onShow() {
			// this.testRelation();

			// // 生肖
			// console.log(getZodiac(2023));

		},
		//分享
		onShareAppMessage(res) {
			if (res.from === 'menu') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '巨好用的有趣工具库',
				path: '/pages/tabbar/tabbar-home'
			}
		},
		methods: {
			testRelation() {
				console.log("???");
				// 如：我应该叫外婆的哥哥什么？
				console.log(relationship({
					text: '妈妈的妈妈的哥哥'
				}));
				// => ['舅外公']

				// 如：七舅姥爷应该叫我什么？
				console.log(relationship({
					text: '七舅姥爷',
					reverse: true,
					sex: 1
				}));
				// => ['甥外孙']

				// 如：舅公和我具体是什么关系？
				console.log(relationship({
					text: '舅公',
					type: 'chain'
				}));
				// => ['爸爸的妈妈的兄弟', '妈妈的妈妈的兄弟', '老公的妈妈的兄弟']

				// 如：舅妈如何称呼外婆？
				console.log(relationship({
					text: '外婆',
					target: '舅妈',
					sex: 1
				}));
				// => ['婆婆']

				// 如：外婆和奶奶之间是什么关系？
				console.log(relationship({
					text: '外婆',
					target: '奶奶',
					type: 'pair'
				}));
				// => ['儿女亲家']

			},
			converChange(e) {
				let { index } = e.detail;
				if(index == 0){
					this.toPage('/pages/tabbar/tools/base-conversion');
				}else if(index == 1){
					this.toPage('/pages/tabbar/tools/ancient-money');
				}else if(index == 2){
					this.toPage('/pages/tabbar/tools/time-conversion');
				}else if(index == 3){
					this.toPage('/pages/tabbar/tools/kinship');
				}
			},
			otherChange(e) {
				let {
					index
				} = e.detail;
				console.log('你点击了第几个：', index);
			},
			toHashEncrypt() {
				this.toPage('/pages/tabbar/tools/hash-encrypt');
			},
			toSymmetryEncrypt() {
				this.toPage('/pages/tabbar/tools/symmetry-encrypt');
			},
			toRsaEncrypt() {
				this.toPage('/pages/tabbar/tools/rsa-encrypt');
			},
			toBase64Encrypt() {
				this.toPage('/pages/tabbar/tools/base64-encrypt');
			},
			toPage(url) {
				if (this.canClick) {
					uni.navigateTo({
						url: url
					});
					setTimeout(() => {
						this.canClick = true;
					}, 2000)
				} else {
					uni.showToast({
						title: '正在跳转...',
						icon: "success",
						duration: 1000
					});
				}
			},
		}
	};
</script>

<style scoped lang="scss">
	.content {

		/* text-align: center; */
		/* margin-top: 200upx; */
		/* height: 400upx; */
		/* overflow: auto; */
		.eti {
			height: 34upx;
			line-height: 34upx;
		}
	}
</style>
