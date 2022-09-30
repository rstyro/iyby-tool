<template>
	<view class="content">
		页面 - 1
	</view>
</template>

<script>
	import {md5,rsaEncode} from '@/utils/CryptoUtils.js';
	import Encrypt from 'encryptlong';
	
export default {
	data() {
		return {
			title: 'Hello'
		};
	},
	// onLoad：第一次创建页面执行
	onLoad() {
		console.log('md5加密:' + md5("rstyro")); 
		// const encode = rsaEncode("rstyrorstyrorst1yrorst11yrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorstyrorsty111rorstyrorstyrorstyrorsty1111111111rorstyrorstyrorstyrorstyrorstyrorstyro");
		// console.log('rsa加密:' + encode); 
		// console.log('rsa解密密:' + rsaDecode(encode)); 
		      // console.log('md5加密:' + CryptoUtils.mdCrtpto('123456')); 
		      // console.log('sha256加密:' + shaCrypto('123456')); 
		      // console.log('base64加密:' + baseCrypto('123456')); 
		      // console.log('base64加密:' + sha1Crypto('123456')); 
		      // console.log('sha1加密:' + sha1Crypto('123456')); 
		      // const  salt="fesdb13632twfs;'." //盐
		      // //超复杂加密-基本不可破解
		      // console.log("超级加密:"+shaCrypto(sha1Crypto((baseCrypto(mdCrtpto(salt + "1234567" + salt))))))
			  
		let enc = new Encrypt({default_key_size: 512});
		const pri = enc.getPrivateKey();
		const pub = enc.getPublicKey();
		console.log("crypt.getPrivateKey():",pri);
		console.log("crypt.getPublicKey():",pub);
		
		// let encode = enc.encryptLong("rstyro");
		// let decode = enc.decryptLong(encode);
		
		// console.log("encode:",encode);
		// console.log("decode:",decode);
		
		// let enc2 = new Encrypt();
		// enc2.setPublicKey(pub);
		
		// let encode2 = enc2.encryptLong("rstyro");
		// // let decode2 = enc2.decryptLong(encode2);
		// console.log("encode:",encode2);
		// // console.log("decode2:",decode2);
		
		// let enc3 = new Encrypt();
		// enc3.setPrivateKey(pri);
		// console.log("decode2:",enc3.decryptLong(encode2));
		
		// let enc3Encode = enc3.encryptLong("enc3加密");
  //       console.log("加密:",enc3Encode);
		
		// let enc4 = new Encrypt();
		// enc4.setPublicKey(pub);
  //       console.log("decode4解:",enc4.decryptLong(enc3Encode));
	},
	// onShow：每次进入页面都会执行
	onShow(){
		
	},
	methods: {
		
	}
};
</script>

<style>
.content {
	text-align: center;
	height: 400upx;
	margin-top: 200upx;
}
</style>
