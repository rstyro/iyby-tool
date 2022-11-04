<template>
	<view class="container">
		<uni-section title="非对称加密算法是什么" type="line" titleFontSize="18px" padding>
			<view class="">
				非对称加密算法需要两个密钥：公开密钥（publickey:简称公钥）和私有密钥（privatekey:简称私钥）。公钥与私钥是一对，如果用公钥对数据进行加密，只有用对应的私钥才能解密。因为加密和解密使用的是两个不同的密钥，所以这种算法叫作非对称加密算法。
			</view>
		</uni-section>
		<view class="main">
			<view>
				<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="button"
					activeColor="#4cd964"></uni-segmented-control>
				<view class="content">
					<view v-show="current === 0">
						<view>
							<uni-forms class="btn">
								<uni-forms-item label="密码长度:" label-width="80px" name="key">
									<uni-data-select v-model="keySize" :localdata="keySizeList" @change="changeKeySize">
									</uni-data-select>
								</uni-forms-item>
							</uni-forms>
							<button type="primary" class="btn" @click="genKey">生成公私钥对</button>

							<uni-section title="私钥内容" type="square" titleFontSize="16px" padding>
								<textarea class="text-box" maxlength=-1 :value="keys.pri" placeholder="私钥内容" />

							</uni-section>
							<uni-section title="公钥内容" type="square" titleFontSize="16px" padding>
								<textarea class="text-box" maxlength=-1 :value="keys.pub" placeholder="公钥内容" />
							</uni-section>

							<view class="btn-box">
								<button type="primary" @click="copyPri">复制私钥</button>
								<button type="primary" @click="copyPub">复制公钥</button>
							</view>
						</view>
					</view>
					<view v-show="current === 1">
						
						<uni-section title="公钥内容" type="square" titleFontSize="16px" padding>
							<textarea class="text-box" maxlength=-1 :value="keys.pub" @input="bindTextPub" placeholder="公钥内容" />
						</uni-section>

						<uni-section title="需要计算的内容" type="square" titleFontSize="16px" padding>
							<textarea class="text-box" maxlength=-1 :value="content" @input="bindTextContent"  placeholder="加密内容" />
							<button type="primary" class="btn" @click="encodeByPub">公钥计算</button>
						</uni-section>

						<uni-section title="计算后转Base64的内容" type="square" titleFontSize="16px" padding>
							<textarea class="text-box" maxlength=-1 :value="encode" placeholder="加密后的内容" />
							<button type="primary" class="btn" @click="copyEncode">复制计算后的内容</button>
						</uni-section>
					</view>
					<view v-show="current === 2">
						
						
						<uni-section title="私钥内容" type="square" titleFontSize="16px" padding>
							<textarea class="text-box" maxlength=-1 :value="keys.pri" @input="bindTextPri" placeholder="私钥内容" />
						</uni-section>

						<uni-section title="RSA计算后的Base64内容" type="square" titleFontSize="16px" padding>
							<textarea class="text-box" maxlength=-1 :value="encode" @input="bindTextEncode" placeholder="计算后的内容" />
							<button type="primary" class="btn" @click="decodeByPri">私钥解密</button>

						</uni-section>

						<uni-section title="解密后的内容" type="square" titleFontSize="16px" padding>
							<textarea class="text-box" maxlength=-1 :value="result" @input="bindTextResult" placeholder="接密后的内容" />
							<button type="primary" class="btn" @click="copyContent">复制解密后的内容</button>
						</uni-section>


					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import JSEncrypt from 'encryptlong';

	export default {
		data() {
			return {
				items: ['RSA生成公私钥', 'RSA公钥加密', 'RSA私钥解密'],
				current: 0,
				keySize: 512,
				keySizeList: [{
					value: 512,
					text: "512位"
				}, {
					value: 1024,
					text: "1024位"
				}, {
					value: 2048,
					text: "2048位"
				}, {
					value: 4096,
					text: "4096位"
				}],
				keys: {
					pub: '',
					pri: ''
				},
				content: '',
				encode: '',
				result:''
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
				title: '在线RSA加解密',
				path: '/pages/tabbar/tools/rsa-encrypt'
			}
		},
		methods: {
			bindTextContent(e) {
				this.content = e.detail.value;
			},
			bindTextEncode(e) {
				this.encode = e.detail.value;
			},
			bindTextResult(e) {
				this.result = e.detail.value;
			},
			bindTextPri(e) {
				this.keys.pri = e.detail.value;
			},
			bindTextPub(e) {
				this.keys.pub = e.detail.value;
			},
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			changeKeySize(e) {
				this.keySize = e;
			},
			genKey() {
				uni.showLoading({
					title: '生成中'
				});
				try {
					this.keys.pri = '';
					this.keys.pub = '';
					const enc = new JSEncrypt({
						default_key_size: this.keySize
					});
					// this.keys.pri = enc.getPrivateKey().replace("-----BEGIN RSA","-----BEGIN").replace("-----END RSA","-----END");
					this.keys.pri = enc.getPrivateKeyB64();
					this.keys.pub = enc.getPublicKeyB64();
				} catch (e) {
					console.log("err=", e);
				} finally {
					uni.hideLoading();
				}
			},
			copyPri() {
				this.copyData(this.keys.pri);
			},
			copyPub() {
				this.copyData(this.keys.pub);
			},
			encodeByPub() {
				let enc = new JSEncrypt()
				enc.setKey(this.keys.pub); // 设置公钥
				this.encode = enc.encryptLong(this.content);
			},
			decodeByPri() {
				// const enc = new JSEncrypt({default_key_size: this.keySize});
				let enc = new JSEncrypt();
				// enc.setPublicKey(this.keys.pub); // 设置公钥
				enc.setKey(this.keys.pri); // 设置私钥
				this.result = enc.decryptLong(this.encode);
			},
			copyEncode() {
				this.copyData(this.encode);
			},
			copyContent() {
				this.copyData(this.content);
			},
			copyData(data) {
				uni.setClipboardData({
					data: data,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: "success",
							duration: 1000
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.main {
			padding: 10px;
		}

		.btn-box {
			display: flex;
			justify-content: space-between;

			button {
				width: 45%;
			}
		}

		.btn {
			margin-top: 20upx;
		}
	}
</style>
