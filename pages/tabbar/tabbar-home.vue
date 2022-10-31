<template>
	<view class="content">
		<uni-section title="加解密相关" type="line" titleFontSize="18px">
			<uni-card @click="toHashEncrypt">
				<view class="eti">消息摘要算法支持:</view>
				<text class="uni-body">MD5、SHA、HMAC、PBKDF2</text>
			</uni-card>
			
			<uni-card @click="toSymmetryEncrypt">
				<view class="eti">对称加密算法支持:</view>
				<text class="uni-body">AES、DES、3DES(Triple DES)、RC4、Rabbit</text>
			</uni-card>
			
			<uni-card @click="toRsaEncrypt">
				<view class="eti">非对称加密算法支持:</view>
				<text class="uni-body">RSA</text>
			</uni-card>
			
			<uni-card @click="toBase64Encrypt">
				<view class="eti">其他常用的编码支持:</view>
				<text class="uni-body">Base64</text>
			</uni-card>
			
		</uni-section>

		<uni-section title="转换相关工具" type="line" titleFontSize="18px">
			<uni-grid :column="2" :show-border="false" :square="false" @change="converChange">
				<uni-grid-item v-for="(item ,index) in converList" :index="index" :key="index">
					<uni-card>
						<text class="uni-body">{{item}}</text>
					</uni-card>
				</uni-grid-item>
			</uni-grid>
		</uni-section>

		<uni-section title="其他工具" type="line" titleFontSize="18px">
			<uni-grid :column="2" :show-border="false" :square="false" @change="otherChange">
				<uni-grid-item v-for="(item ,index) in otherList" :index="index" :key="index">
					<uni-card>
						<text class="uni-body">{{item}}</text>
					</uni-card>
				</uni-grid-item>
			</uni-grid>
		</uni-section>

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
				canClick:true,
				converList: ['进制相互转换', '数字转古代中文', '时间戳转日期', '日期时间计算器'],
				otherList: ['亲戚关系计算器', '二维码生成解析', '生肖查询', '节日头像合成', '氛围跑马灯']
			};
		},
		// onLoad：第一次创建页面执行
		onLoad() {
			console.log("?????");
		},
		// onShow：每次进入页面都会执行
		onShow() {
			// this.testCrypto();
			// this.testRelation();
			console.log(convertToCnMoney(1111131294.34));

			let value = 24;
			// 10 进制转16
			console.log(baseTenToOther(value, 2));
			console.log(baseTenToOther(value, 8));
			console.log(baseTenToOther(value, 16));

			console.log("特殊：",baseConversion('1000112312311134643643262461', 10, 36));
			console.log(baseConversion(24, 10, 8));
			console.log(baseConversion(24, 10, 16));

			// 生肖
			console.log(getZodiac(2023));

			// 时间戳
			console.log(getTimestampByDate());
			console.log(getTimestampByDate(2023));
			console.log(getTimestampByDate('2023-10-10'));
			console.log(getTimestampByDate('2023-10-10 12:10:01'));
			console.log(getTimestampByDate('2023-01-01 08:00:00'));
			console.log(getDateByTimestamp(1666315175417));
			console.log(getDateByTimestamp(1672531200000));
			console.log(getDateByTimestamp(1696911001000));
			console.log(getDateByTimestamp());
			console.log(getDateAddOrSubDay(-3));
			console.log(getDateAddOrSubDay(-25, '2022-10-21 12:10:10'));


		},
		methods: {
			testCrypto() {
				let enc = new Encrypt({
					default_key_size: 512
				});
				const pri = enc.getPrivateKey();
				const pub = enc.getPublicKey();
				console.log("crypt.getPrivateKey():", pri);
				console.log("crypt.getPublicKey():", pub);
				let encode = enc.encryptLong("rstyro");
				let decode = enc.decryptLong(encode);

				console.log("encode:", encode);
				console.log("decode:", decode);


				// AES 
				var encrypted = CryptoJS.AES.encrypt("Message", "111");
				var decrypted = CryptoJS.AES.decrypt(encrypted.toString(), "111");
				console.log("encrypted AES加密：", encrypted.toString());
				console.log("encrypted AES解密：", decrypted.toString(CryptoJS.enc.Utf8));
				//AES 有参数的写法，key可选：128位对应16个字节（8位一个字节）、192位对应24个字节、256位对应32个字节
				var key = CryptoJS.enc.Utf8.parse("1234567891012345");
				// 向量16个字节，ECB模式不需要向量参数
				var iv = CryptoJS.enc.Utf8.parse("1234567891012345");
				var encryptedIv = CryptoJS.AES.encrypt("Message", key, {
					iv: iv,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7
				});
				var decryptedIv = CryptoJS.AES.decrypt(encryptedIv.toString(), key, {
					iv: iv,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7
				});
				let aesEncodeBase64Str = encryptedIv.toString();
				let aesEncodeHexStr = encryptedIv.ciphertext.toString();
				console.log("encrypted AES参数BASE64加密：", aesEncodeBase64Str);
				console.log("encrypted AES参数Hex加密：", aesEncodeHexStr);
				// 如果是hex,先解析后转base64才能解密
				var decryptedIv2 = CryptoJS.AES.decrypt(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(
					aesEncodeHexStr)), key, {
					iv: iv,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7
				});
				console.log("encrypted AES向量解密1：", decryptedIv.toString(CryptoJS.enc.Utf8));
				console.log("encrypted AES向量解密2：", decryptedIv2.toString(CryptoJS.enc.Utf8));

				

				// TripleDES
				var encrypted2 = CryptoJS.TripleDES.encrypt("Message", "Secret Passphrase");
				var decrypted2 = CryptoJS.TripleDES.decrypt(encrypted2, "Secret Passphrase");
				console.log("encrypted TripleDES加密：", encrypted2.toString());
				console.log("encrypted TripleDES解密：", decrypted2.toString(CryptoJS.enc.Utf8));

				// Rabbit
				var encrypted3 = CryptoJS.Rabbit.encrypt("Message", "Secret Passphrase");
				var decrypted3 = CryptoJS.Rabbit.decrypt(encrypted3, "Secret Passphrase");
				console.log("encrypted Rabbit加密：", encrypted3.toString());
				console.log("encrypted Rabbit解密：", decrypted3.toString(CryptoJS.enc.Utf8));

				// RC4, RC4Drop
				var encrypted4 = CryptoJS.RC4.encrypt("Message", "Secret Passphrase");
				var decrypted4 = CryptoJS.RC4.decrypt(encrypted4, "Secret Passphrase");
				console.log("encrypted RC4加密：", encrypted4.toString());
				console.log("encrypted RC4解密：", decrypted4.toString(CryptoJS.enc.Utf8));

				var encrypted5 = CryptoJS.RC4Drop.encrypt("Message", "Secret Passphrase", {
					drop: 3072 / 4
				});
				var decrypted5 = CryptoJS.RC4Drop.decrypt(encrypted5, "Secret Passphrase", {
					drop: 3072 / 4
				});
				console.log("encrypted RC4Drop加密：", encrypted5.toString());
				console.log("encrypted RC4Drop解密：", decrypted5.toString(CryptoJS.enc.Utf8));

				// Base64
				let base64en = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse("Message"));
				console.log("Base64加密：", base64en);
				const base64De = CryptoJS.enc.Base64.parse(base64en).toString(CryptoJS.enc.Utf8);
				console.log("Base64 解密：", base64De);


				//RSA
				// const nodeRsa = new NodeRSA({b: 512});
				// const text = 'Hello RSA!';
				// const rsaEn = nodeRsa.encrypt(text, 'base64');
				// console.log('encrypted: ', rsaEn);
				// const rsaDe = nodeRsa.decrypt(rsaEn, 'utf8');
				// console.log('decrypted: ', rsaDe);
			},
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
			encryptChange(e) {
				let { index} = e.detail;
				console.log('你点击了第几个：', index);
			},
			converChange(e) {
				let { index} = e.detail;
				console.log('你点击了第几个：', index);
			},
			otherChange(e) {
				let { index} = e.detail;
				console.log('你点击了第几个：', index);
			},
			toHashEncrypt(){
				this.toPage('/pages/tabbar/tools/hash-encrypt');
			},
			toSymmetryEncrypt(){
				this.toPage('/pages/tabbar/tools/symmetry-encrypt');
			},
			toRsaEncrypt(){
				this.toPage('/pages/tabbar/tools/rsa-encrypt');
			},
			toBase64Encrypt(){
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
		.eti{
			height: 34upx;
			line-height: 34upx;
		}
	}
</style>
