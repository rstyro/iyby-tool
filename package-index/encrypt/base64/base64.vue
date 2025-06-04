<template>
	<view class="container">
		<!-- 自定义section组件 -->
		<view class="section">
			<view class="section-title">BASE64是什么</view>
			<view class="section-content">
				Base64是网络上最常见的用于传输8Bit字节码的编码方式之一，Base64就是一种基于64个可打印字符来表示二进制数据的方法。
				Base64编码是从二进制到字符的过程，可用于在HTTP环境下传递较长的标识信息。采用Base64编码具有不可读性，需要解码后才能阅读。
			</view>
		</view>

		<view class="main">
			<view class="section">
				<view class="section-title">待计算的内容</view>
				<view class="section-content">
					<textarea class="text-box" maxlength=-1 :value="content" @input="bindTextContent" placeholder="请输入需要加密的内容"
						auto-height />

					<view class="btn-box margin-top">
						<button type="primary" @click="encodeContent">计算</button>
						<button type="primary" @click="decodeContent">解密</button>
					</view>
				</view>
			</view>

			<view class="section">
				<view class="section-title">计算后的内容</view>
				<view class="section-content">
					<textarea class="text-box" maxlength=-1 :value="encode" @input="bindTextEncode" placeholder="加密后的内容"
						auto-height />
					<view class="margin-top">
						<button type="primary" v-show="content" @click="copyContent">复制待计算的内容</button>
						<button type="primary" v-show="encode" class="margin-top" @click="copyEncode">复制计算后的内容</button>
						<button type="primary" class="margin-top" @click="clearContent">清空内容</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CryptoJS from 'crypto-js';
	export default {
		data() {
			return {
				content: '',
				encode: '',
			}
		},
		methods: {
			// 输入处理
			bindTextContent(e) {
				this.content = e.detail.value;
			},
			bindTextEncode(e) {
				this.encode = e.detail.value;
			},
			encodeContent() {
				if (!this.content) return;
				// Base64
				this.encode = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(this.content));
			},
			decodeContent() {
				if (!this.encode) return;
				this.content = CryptoJS.enc.Base64.parse(this.encode).toString(CryptoJS.enc.Utf8)
			},
			// 清空内容
			clearContent() {
				this.content = '';
				this.encode = '';
			},

			// 复制内容
			copyContent() {
				this.$t.copyData(this.content);
			},
			copyEncode() {
				this.$t.copyData(this.encode);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 20rpx;

		.section {
			margin-bottom: 40rpx;
			border-radius: 16rpx;
			overflow: hidden;

			.section-title {
				font-size: 32rpx;
				font-weight: bold;
				padding: 20rpx 30rpx;
				background-color: #f5f5f5;
			}

			.section-content {
				padding: 30rpx;
				background-color: #ffffff;
				border-top: 1rpx solid #eee;
			}
		}

		.text-box {
			width: 100%;
			min-height: 200rpx;
			padding: 20rpx;
			border: 1rpx solid #e0e0e0;
			border-radius: 8rpx;
			font-size: 28rpx;
			margin-bottom: 20rpx;
		}

		.btn-box {
			display: flex;
			justify-content: space-between;

			button {
				flex: 1;
				margin: 0 10rpx;

				&:first-child {
					margin-left: 0;
				}

				&:last-child {
					margin-right: 0;
				}
			}
		}
	}
</style>