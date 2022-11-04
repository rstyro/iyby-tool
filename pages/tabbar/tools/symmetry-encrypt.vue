<template>
	<view class="container">
		<uni-section title="对称加密算法是什么" type="line" titleFontSize="18px" padding>
			<view class="">采用单钥密码系统的加密方法，同一个密钥可以同时用作信息的加密和解密，这种加密方法称为对称加密，也称为单密钥加密。
			</view>
		</uni-section>

		<view class="main">
			<uni-section title="待计算的内容" type="square" titleFontSize="16px" padding>
				<textarea class="text-box" maxlength=-1 :value="content" @input="bindTextAreaBlur" placeholder="请输入需要加密的内容" />
			</uni-section>

			<uni-section title="选择算法" type="square" titleFontSize="16px" padding>
				<view class="uni-list">
					<radio-group @change="radioChange">
						<view class="radioBox">
							<view class="radioItem" v-for="(item, index) in items" :key="item.value">
								<radio :value="item.value" :checked="index === current" />{{item.name}}
							</view>
						</view>
					</radio-group>
				</view>

				<view class="parame-box">
					<uni-forms :modelValue="params">
						<uni-forms-item label="对称加密密钥:" label-width="100px" name="key">
							<input class="pinput" type="text" v-model="params.key" placeholder="密钥位数分别为16、24、32个字符" />
						</uni-forms-item>
						<uni-forms-item v-show="showDrop" label="drop(words):" label-width="100px" name="key">
							<input class="pinput" type="number" v-model="params.drop" placeholder="丢弃的字符个数" />
						</uni-forms-item>
						<view v-show="aes.show">
							<uni-forms-item label="AES加密模式:" label-width="100px" name="key">
								<uni-data-select v-model="params.mode" :localdata="aes.modeList" @change="changeMode">
								</uni-data-select>
							</uni-forms-item>
							<uni-forms-item label="AES填充:" label-width="100px" name="mode">
								<uni-data-select v-model="params.padding" :localdata="aes.paddingList"
									@change="changePadding">
								</uni-data-select>
							</uni-forms-item>
							<uni-forms-item v-show="params.mode != 'ECB'" label="偏移量:" label-width="100px" name="iv">
								<input class="pinput" type="text" v-model="params.iv" placeholder="请输入对称加密密钥" />
							</uni-forms-item>
						</view>

					</uni-forms>
				</view>

				<view class="btn-box">
					<button type="primary" @click="encodeContent">计算转Base64</button>
					<button type="primary" @click="decodeContent"><uni-icons type="arrow-up" style="color: #fff;"></uni-icons>逆运算</button>
				</view>
			</uni-section>


			<uni-section title="计算后的内容" type="square" titleFontSize="16px" padding>
				<textarea class="text-box" maxlength="-1" @input="bindTextEncode" :value="encode" placeholder="加密后的内容" />
				<view v-show="encode">
					<button type="primary" class="margin-top" @click="copyContent">复制加密后的内容</button>
					<button type="primary" class="margin-top" @click="clearContent">清空内容</button>
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
				params: {
					key: '1234567891012345',
					mode: 'CBC',
					iv: '1234567891012345',
					padding: 'Pkcs7',
					drop:192
				},
				showDrop:false,
				aes: {
					modeList: [{
							value: "ECB",
							text: "ECB"
						},
						{
							value: "CBC",
							text: "CBC"
						},
						{
							value: "CFB",
							text: "CFB"
						}, {
							value: "OFB",
							text: "OFB"
						}, {
							value: "CTR",
							text: "CTR"
						}
					],
					paddingList: [{
						value: "Pkcs7",
						text: "Pkcs7"
					}, {
						value: "Iso97971",
						text: "Iso97971"
					}, {
						value: "AnsiX923",
						text: "AnsiX923"
					}, {
						value: "Iso10126",
						text: "Iso10126"
					}, {
						value: "ZeroPadding",
						text: "ZeroPadding"
					}, {
						value: "NoPadding",
						text: "NoPadding"
					}],
					show:true
				},
				items: [{
						value: 'AES',
						name: 'AES',
						checked: 'true'
					},
					{
						value: 'DES',
						name: 'DES'
					},
					{
						value: 'TripleDES',
						name: 'TripleDES'
					},
					{
						value: 'Rabbit',
						name: 'Rabbit'
					},
					{
						value: 'RC4',
						name: 'RC4'
					},
					{
						value: 'RC4Drop',
						name: 'RC4Drop'
					}
				],
				current: 0
			};
		},
		onShareAppMessage(res) {
			if (res.from === 'menu') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '在线对称加解密',
				path: '/pages/tabbar/tools/symmetry-encrypt'
			}
		},
		methods: {
			bindTextAreaBlur(e) {
				this.content = e.detail.value;
			},
			bindTextEncode(e){
				this.encode = e.detail.value;
			},
			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.detail.value) {
						this.current = i;
						
						if(this.current == 0){
							this.aes.show=true;
						}else{
							this.aes.show=false;
						}
						
						if (evt.detail.value.includes("RC4Drop")) {
							this.showDrop = true;
						} else {
							this.showDrop = false;
						}
						break;
					}
				}
			},
			// 加密
			encodeContent() {
				if (this.content == "") {
					uni.showToast({
						title: '内容不能为空',
						icon: "error",
						duration: 1000
					});
					return false;
				}
				uni.showLoading({
					title: '加载中'
				});
				if (this.items[this.current].value == "AES") {
					var key = CryptoJS.enc.Utf8.parse(this.params.key);
					// 向量16个字节，ECB模式不需要向量参数
					var iv = CryptoJS.enc.Utf8.parse(this.params.iv);
					let mode = this.getMode();
					let padding = this.getPadding();
					var encryptedIv = CryptoJS.AES.encrypt(this.content, key, {
						iv: iv,
						mode: mode,
						padding: padding
					});
					// 这个就是base64的结果
					this.encode = encryptedIv.toString();
					// hex
					// this.encode = encryptedIv.ciphertext.toString();

				} else if (this.items[this.current].value == "DES") {
					var encrypted = CryptoJS.DES.encrypt(this.content, this.params.key);
					this.encode = encrypted.toString();
					
				} else if (this.items[this.current].value == "TripleDES") {
					var encrypted = CryptoJS.TripleDES.encrypt(this.content, this.params.key);
					this.encode = encrypted.toString();
				} else if (this.items[this.current].value == "Rabbit") {
					let encrypted = CryptoJS.Rabbit.encrypt(this.content, this.params.key);
					this.encode = encrypted.toString();
					
				} else if (this.items[this.current].value == "RC4") {
					var encrypted = CryptoJS.RC4.encrypt(this.content, this.params.key);
					this.encode = encrypted.toString();
				} else if (this.items[this.current].value == "RC4Drop") {
					let dropBit = this.params.drop * 4;
					var encrypted = CryptoJS.RC4Drop.encrypt(this.content, this.params.key, {
						drop: dropBit
					});
					this.encode = encrypted.toString();
				}
				uni.hideLoading();
			},
			decodeContent() {
				if (this.encode == "") {
					uni.showToast({
						title: '加密内容为空',
						icon: "error",
						duration: 1000
					});
					return false;
				}
				
				try {
					uni.showLoading({
						title: '计算中'
					});
					
					if (this.items[this.current].value == "AES") {
						var key = CryptoJS.enc.Utf8.parse(this.params.key);
						// 向量16个字节，ECB模式不需要向量参数
						var iv = CryptoJS.enc.Utf8.parse(this.params.iv);
						let mode = this.getMode();
						let padding = this.getPadding();
						var decryptedIv = CryptoJS.AES.decrypt(this.encode, key, {
							iv: iv,
							mode: mode,
							padding: padding
						});
						// 这个就是base64的结果
						this.content = decryptedIv.toString(CryptoJS.enc.Utf8);
					} else if (this.items[this.current].value == "DES") {
						var decrypted = CryptoJS.DES.decrypt(this.encode, this.params.key);
						this.content = decrypted.toString(CryptoJS.enc.Utf8);
					} else if (this.items[this.current].value == "TripleDES") {
						var decrypted = CryptoJS.TripleDES.decrypt(this.encode, this.params.key);
						this.content = decrypted.toString(CryptoJS.enc.Utf8);
					} else if (this.items[this.current].value == "Rabbit") {
						var decrypted = CryptoJS.Rabbit.decrypt(this.encode, this.params.key);
						this.content = decrypted.toString(CryptoJS.enc.Utf8);
					} else if (this.items[this.current].value == "RC4") {
						var decrypted = CryptoJS.RC4.decrypt(this.encode, this.params.key);
						this.content = decrypted.toString(CryptoJS.enc.Utf8);
					} else if (this.items[this.current].value == "RC4Drop") {
						var encrypted5 = CryptoJS.RC4Drop.encrypt("Message", "Secret Passphrase", {
							drop: 3072 / 4
						});
						var decrypted5 = CryptoJS.RC4Drop.decrypt(encrypted5, "Secret Passphrase", {
							drop: 3072 / 4
						});
						
						let dropBit = this.params.drop * 4;
						var decrypted = CryptoJS.RC4Drop.decrypt(this.encode, this.params.key, {
							drop: dropBit
						});
						this.content = decrypted.toString(CryptoJS.enc.Utf8);
					}
				}catch(e){
					console.log("err=:",e);
					uni.showToast({
						title: '解密失败',
						icon: "error",
						duration: 1000
					});
				}finally{
					uni.hideLoading();
					if(this.content==""){
						uni.showToast({
							title: '解密失败',
							icon: "error",
							duration: 1000
						});
					}
				}
			},
			changeMode(e) {
				this.params.mode = e;
			},
			changePadding(e) {
				this.params.padding = e;
			},
			clearContent() {
				this.content = '';
				this.encode = '';
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
			getMode(){
				let e = this.params.mode;
				let mode = CryptoJS.mode.CBC;
				if (e == "ECB") {
					mode = CryptoJS.mode.ECB;
				} else if (e == "CBC") {
					mode = CryptoJS.mode.CBC;
				} else if (e == "CFB") {
					mode = CryptoJS.mode.CFB;
				} else if (e == "OFB") {
					mode = CryptoJS.mode.OFB;
				} else if (e == "CTR") {
					mode = CryptoJS.mode.CTR;
				}
				return mode;
			},
			getPadding(){
				let e = this.params.padding;
				let padding  = CryptoJS.pad.Pkcs7;
				if (e == "NoPadding") {
					padding = CryptoJS.pad.NoPadding;
				} else if (e == "Iso97971") {
					padding = CryptoJS.pad.Iso97971;
				} else if (e == "AnsiX923") {
					padding = CryptoJS.pad.AnsiX923;
				} else if (e == "Iso10126") {
					padding = CryptoJS.pad.Iso10126;
				} else if (e == "ZeroPadding") {
					padding = CryptoJS.pad.ZeroPadding;
				}
				return padding;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {

		.main {
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
					width: 200upx;
					height: 80upx;
				}
			}

			

			.btn-box {
				display: flex;
				justify-content: space-between;

				button {
					width: 48%;
				}
			}
		}



	}
</style>
