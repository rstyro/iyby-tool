<template>
	<view class="container">
		<uni-section title="BASE64是什么" type="line" titleFontSize="18px" padding>
			<view class="">
				Base64是网络上最常见的用于传输8Bit字节码的编码方式之一，Base64就是一种基于64个可打印字符来表示二进制数据的方法。可查看RFC2045～RFC2049，上面有MIME的详细规范。
				Base64编码是从二进制到字符的过程，可用于在HTTP环境下传递较长的标识信息。采用Base64编码具有不可读性，需要解码后才能阅读。
			</view>
		</uni-section>
		
		<view class="main">
			<uni-section title="待计算的内容" type="square" titleFontSize="16px" padding>
				<textarea class="text-box" maxlength=-1 :value="content" @input="bindTextContent" placeholder="请输入需要加密的内容" />
				
				<view class="btn-box margin-top">
					<button type="primary" @click="encodeContent">计算</button>
					<button type="primary" @click="decodeContent"><uni-icons type="arrow-up" style="color: #fff;"></uni-icons>解密</button>
				</view>
			</uni-section>
			
			
			<uni-section title="计算后的内容" type="square" titleFontSize="16px" padding>
				<textarea class="text-box" maxlength="-1" @input="bindTextEncode" :value="encode" placeholder="加密后的内容" />
				<view class="margin-top">
					<button type="primary" v-show="content" @click="copyContent">复制待计算的内容</button>
					<button type="primary" v-show="encode" class="margin-top" @click="copyEncode">复制计算后的内容</button>
					<button type="primary" class="margin-top" @click="clearContent">清空内容</button>
				</view>
			
			</uni-section>
		</view>
		
	</view>
</template>

<script>
	import {copyData} from '@/utils/Tools.js';
	import CryptoJS from 'crypto-js';
	
	export default {
		data() {
			return {
				content: '',
				encode: '',
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'menu') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '在线Base64编码',
				path: '/pages/tabbar/tools/base64-encrypt'
			}
		},
		methods: {
			bindTextContent(e){
				this.content = e.detail.value;
			},
			bindTextEncode(e){
				this.encode = e.detail.value;
			},
			encodeContent() {
				// Base64
				this.encode = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(this.content));
			},
			decodeContent(){
				this.content=CryptoJS.enc.Base64.parse(this.encode).toString(CryptoJS.enc.Utf8)
			},
			clearContent() {
				this.content = '';
				this.encode = '';
			},
			copyContent(){
				copyData(this.content);
			},
			copyEncode() {
				copyData(this.encode);
			},
		}
	}
</script>

<style lang="scss" scoped>

.container{
	
	.btn-box {
		display: flex;
		justify-content: space-between;
	
		button {
			width: 45%;
		}
	}
}

</style>
