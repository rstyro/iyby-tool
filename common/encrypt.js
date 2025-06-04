import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';
import config from '@/common/config.js';

const {
	backPublicKey,
	mePrivateKey,
	aesIv
} = config

/*
 * RSA 加密（使用后端公钥）
 * @param {string} data 待加密数据
 * @returns {string} Base64 编码的加密结果
 */
export function rsaEncrypt(data) {
	try {
		// 初始化 RSA 实例
		const rsaEncryptor = new JSEncrypt();
		rsaEncryptor.setPublicKey('-----BEGIN PUBLIC KEY-----' + backPublicKey + '-----END PUBLIC KEY-----');
		return rsaEncryptor.encrypt(data)
	} catch (error) {
		console.error('RSA 加密失败:', error)
		return null
	}
}

/**
 * RSA 解密（使用前端私钥）
 * @param {string} encryptedData Base64 编码的加密数据
 * @returns {string} 解密后的原始数据
 */
export function rsaDecrypt(encryptedData) {
	try {
		const rsaDecryptor = new JSEncrypt();
		rsaDecryptor.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----' + mePrivateKey + '-----END RSA PRIVATE KEY-----');
		let data = rsaDecryptor.decrypt(encryptedData);
		return data;
	} catch (error) {
		console.error('RSA 解密失败:', error)
		return null
	}
}

/**
 * AES 加密（CBC 模式，PKCS7 填充）
 * @param {string} data 待加密数据
 * @param {string} aesKey 加密密钥
 * @returns {string} Base64 编码的加密结果
 */
export function aesEncrypt(data, aesKey) {
	try {
		const key = CryptoJS.enc.Utf8.parse(aesKey)
		const iv = CryptoJS.enc.Utf8.parse(aesIv)
		const encrypted = CryptoJS.AES.encrypt(data, key, {
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.toString()
	} catch (error) {
		console.error('AES 加密失败:', error)
		return null
	}
}

/**
 * AES 解密
 * @param {string} encryptedData Base64 编码的加密数据
 * @param {string} aesKey 解密密钥
 * @returns {string} 解密后的原始数据
 */
export function aesDecrypt(encryptedData, aesKey) {
	try {
		const key = CryptoJS.enc.Utf8.parse(aesKey)
		const iv = CryptoJS.enc.Utf8.parse(aesIv)
		const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		})
		return decrypted.toString(CryptoJS.enc.Utf8)
	} catch (error) {
		console.error('AES 解密失败:', error)
		return null
	}
}

/**
 * 生成随机 AES 密钥
 * @param {number} length 密钥长度（默认 16）
 * @returns {string} 随机生成的密钥
 */
export function generateAesKey(length = 16) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let key = ''
	for (let i = 0; i < length; i++) {
		key += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return key
}

//随机生成aes 密钥
export function genAesKey(keySize = 128) {
	return CryptoJS.lib.WordArray.random(keySize/8).toString();
}


// 使用示例：
// 1. 生成随机 AES 密钥
// const aesKey = generateAesKey()
// 
// 2. 加密流程：
// const encryptedAesKey = rsaEncrypt(aesKey) // 用 RSA 加密 AES 密钥
// const encryptedData = aesEncrypt(JSON.stringify(data), aesKey) // 用 AES 加密数据
// 
// 3. 解密流程：
// const decryptedAesKey = rsaDecrypt(encryptedAesKey) // 用 RSA 解密 AES 密钥
// const decryptedData = aesDecrypt(encryptedData, decryptedAesKey) // 用 AES 解密数据