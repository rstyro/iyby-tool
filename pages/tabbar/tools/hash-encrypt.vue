<template>
	<view class="container">
		<uni-section title="消息摘要算法是什么" type="line" titleFontSize="18px" padding>
			<view class="">消息摘要算法的主要特征是加密过程不需要密钥，并且经过加密的数据无法被解密，可以被解密逆向的只有CRC32算法，只有输入相同的明文数据经过相同的消息摘要算法才能得到相同的密文。
			</view>
		</uni-section>
		<view class="main">
			<uni-section title="待加密的内容" type="circle" titleFontSize="16px" padding>
				<textarea class="text-box" maxlength="-1" :value="content" @input="bindTextAreaBlur" placeholder="请输入需要加密的内容" />
			</uni-section>
			<uni-section title="选择加密算法" type="circle" titleFontSize="16px" padding>
				<view class="uni-list">
					<radio-group @change="radioChange">
						<view class="radioBox">
							<view class="radioItem" v-for="(item, index) in items" :key="item.value">
								<radio :value="item.value" :checked="index === current" />{{item.name}}
							</view>
						</view>
					</radio-group>
				</view>

				<view v-show="showKey">
					<uni-forms>
						<uni-forms-item label="HMAC密钥:" label-width="100px" name="key">
							<input class="pinput" type="text" v-model="key" placeholder="请输入HMAC密钥内容" />
						</uni-forms-item>
					</uni-forms>
				</view>
				<view v-show="pbkdf2.show" class="pbkdf-box">
					<uni-forms>

						<uni-forms-item label="PBKDF2 盐(salt):" label-width="130px" name="salt">
							<input class="pinput" type="text" v-model="pbkdf2.salt" placeholder="请输入PBKDF2的盐" />
						</uni-forms-item>
						<uni-forms-item label="Key长度:" label-width="130px" name="keySize">
							<uni-data-select v-model="pbkdf2.keySize" :localdata="range" @change="change">
							</uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="PBKDF2迭代次数:" label-width="130px" name="count">
							<input class="pinput" type="number" v-model="pbkdf2.count" placeholder="请输入PBKDF2的迭代次数" />
						</uni-forms-item>
					</uni-forms>
				</view>

				<button type="primary" @click="encryptContent">加密</button>
			</uni-section>
			<uni-section title="加密后的内容" type="circle" titleFontSize="16px" padding>
				<textarea class="text-box" maxlength="-1" :value="encode" placeholder="加密后的内容" />
				<view v-show="encode">
					<button type="primary" @click="copyContent">复制加密后的内容</button>
					<button type="primary" class="btn" @click="toUp">加密内容转大写</button>
					<button type="primary" class="btn" @click="toBase64">加密内容转Base64</button>
					<button type="primary" class="btn" @click="clearContent">清空内容</button>
				</view>
				
			</uni-section>
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
				key: 'rstyro',
				showKey: false,
				pbkdf2: {
					count: 1,
					salt: 'rstyro',
					keySize: 4,
					show: false
				},
				range: [{
						value: 128 / 32,
						text: "128位"
					},
					{
						value: 256 / 32,
						text: "256位"
					},
					{
						value: 512 / 32,
						text: "512位"
					},
				],
				items: [{
						value: 'MD5',
						name: 'MD5',
						checked: 'true'
					},
					{
						value: 'SHA1',
						name: 'SHA1'
					},
					{
						value: 'SHA224',
						name: 'SHA224'
					},
					{
						value: 'SHA256',
						name: 'SHA256'
					},
					{
						value: 'SHA384',
						name: 'SHA384'
					}, {
						value: 'SHA512',
						name: 'SHA512'
					}, {
						value: 'SHA3-224',
						name: 'SHA3(224位)'
					}, {
						value: 'SHA3-256',
						name: 'SHA3(256位)'
					}, {
						value: 'SHA3-384',
						name: 'SHA3(384位)'
					}, {
						value: 'SHA3-512',
						name: 'SHA3(512位)'
					},
					{
						value: 'HmacSHA1',
						name: 'HmacSHA1'
					}, {
						value: 'HmacSHA224',
						name: 'HmacSHA224'
					}, {
						value: 'HmacSHA256',
						name: 'HmacSHA256'
					}, {
						value: 'HmacSHA384',
						name: 'HmacSHA384'
					}, {
						value: 'HmacSHA512',
						name: 'HmacSHA512'
					}, {
						value: 'HmacMD5',
						name: 'HmacMD5'
					}, {
						value: 'PBKDF2',
						name: 'PBKDF2'
					},
				],
				current: 0
			}
		},
		methods: {
			bindTextAreaBlur(e) {
				this.content = e.detail.value;
			},
			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.detail.value) {
						this.current = i;

						// 是否显示密钥输入框
						if (evt.detail.value.includes("Hmac")) {
							this.showKey = true;
						} else {
							this.showKey = false;
						}

						if (evt.detail.value.includes("PBKDF")) {
							this.pbkdf2.show = true;
						} else {
							this.pbkdf2.show = false;
						}
						break;
					}
				}
				console.log(this.current);
			},
			encryptContent() {
				if (this.content == "") {
					uni.showToast({
						title: '加密内容为空',
						icon: "error",
						duration: 1000
					});
					return false;
				}
				uni.showLoading({
					title: '加载中'
				});
				if (this.items[this.current].value == "MD5") {
					this.encode = CryptoJS.MD5(this.content).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "SHA1") {
					this.encode = CryptoJS.SHA1(this.content).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "SHA224") {
					this.encode = CryptoJS.SHA224(this.content).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "SHA256") {
					this.encode = CryptoJS.SHA256(this.content).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "SHA384") {
					this.encode = CryptoJS.SHA384(this.content).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "SHA512") {
					this.encode = CryptoJS.SHA512(this.content).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "SHA3-512") {
					this.encode = CryptoJS.SHA3(this.content, {
						outputLength: 512
					}).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "SHA3-384") {
					this.encode = CryptoJS.SHA3(this.content, {
						outputLength: 384
					}).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "SHA3-256") {
					this.encode = CryptoJS.SHA3(this.content, {
						outputLength: 256
					}).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "SHA3-224") {
					this.encode = CryptoJS.SHA3(this.content, {
						outputLength: 224
					}).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "HmacSHA1" && this.checkHmacKey()) {
					this.encode = CryptoJS.HmacSHA1(this.content, this.key).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "HmacSHA224" && this.checkHmacKey()) {
					this.encode = CryptoJS.HmacSHA224(this.content, this.key).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "HmacSHA256" && this.checkHmacKey()) {
					this.encode = CryptoJS.HmacSHA256(this.content, this.key).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "HmacSHA384" && this.checkHmacKey()) {
					this.encode = CryptoJS.HmacSHA384(this.content, this.key).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "HmacSHA512" && this.checkHmacKey()) {
					this.encode = CryptoJS.HmacSHA512(this.content, this.key).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "HmacMD5" && this.checkHmacKey()) {
					this.encode = CryptoJS.HmacMD5(this.content, this.key).toString(CryptoJS.enc.Hex);
				} else if (this.items[this.current].value == "PBKDF2") {
					var pbkdf = CryptoJS.PBKDF2(this.content, this.pbkdf2.salt, {
						keySize: this.pbkdf2.keySize,
						iterations: this.pbkdf2.count
					});
					this.encode = pbkdf.toString(CryptoJS.enc.Hex);
				}
				uni.hideLoading();
			},
			copyContent() {
				let _that = this;
				uni.setClipboardData({
					data: _that.encode,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: "success",
							duration: 1000
						});

					}
				});
			},
			checkHmacKey() {
				if (this.key == "") {
					uni.showToast({
						title: '密钥不能为空',
						icon: "error",
						duration: 1000
					});
					return false;
				}
				return true;
			},
			change(e) {
				this.pbkdf2.keySize = e;
			},
			clearContent(){
				this.content='';
				this.encode='';
			},
			toUp(){
				if(this.encode){
					this.encode=this.encode.toUpperCase();
				}
			},
			toBase64(){
				if(this.encode){
					this.encode = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(this.encode));
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		$padding: 40rpx;

		.main {
			padding: 10px;

			.text-box {
				// width: calc(100% - $padding);
				width: 100%;
				border: 1px solid antiquewhite;

			}

			.radioBox {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.radioItem {
					width: 300upx;
					height: 100upx;
				}
			}

			.pinput {
				border: 1px solid #eee;
				height: 80upx;
				line-height: 80upx;
				padding-left: 10upx;
			}
			.btn{
				margin-top: 10upx;
			}
		}
	}
</style>
