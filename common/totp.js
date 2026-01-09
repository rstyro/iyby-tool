import CryptoJS from 'crypto-js'

// Base32 编解码实现
class Base32 {
	static chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
	static lookup = new Map()

	static init() {
		if (Base32.lookup.size === 0) {
			for (let i = 0; i < Base32.chars.length; i++) {
				Base32.lookup.set(Base32.chars.charAt(i), i)
			}
		}
	}

	// Base32 解码（参考Java的密钥是十六进制，但我们要处理Base32）
	static decode(encoded) {
		this.init()

		// 清理输入：移除空格、连字符，转为大写
		encoded = encoded.toUpperCase().replace(/[\s\-=]/g, '')

		const bytes = []
		let buffer = 0
		let bufferLength = 0

		for (let i = 0; i < encoded.length; i++) {
			const c = encoded.charAt(i)
			if (!Base32.lookup.has(c)) {
				throw new Error('无效的Base32字符: ' + c)
			}

			buffer = (buffer << 5) | Base32.lookup.get(c)
			bufferLength += 5

			if (bufferLength >= 8) {
				bytes.push((buffer >> (bufferLength - 8)) & 0xff)
				bufferLength -= 8
				buffer &= (1 << bufferLength) - 1
			}
		}

		// 处理剩余位（如果有）
		if (bufferLength > 0) {
			buffer <<= (8 - bufferLength)
			bytes.push(buffer & 0xff)
		}

		return new Uint8Array(bytes)
	}

	// Base32 编码
	static encode(data) {
		this.init()

		let encoded = ''
		let buffer = 0
		let bits = 0

		for (let i = 0; i < data.length; i++) {
			buffer = (buffer << 8) | (data[i] & 0xff)
			bits += 8

			while (bits >= 5) {
				encoded += Base32.chars.charAt((buffer >> (bits - 5)) & 0x1f)
				bits -= 5
			}
		}

		// 处理剩余的位
		if (bits > 0) {
			buffer <<= (5 - bits)
			encoded += Base32.chars.charAt(buffer & 0x1f)
		}

		// 添加填充字符
		while (encoded.length % 8 !== 0) {
			encoded += '='
		}

		return encoded
	}

	// 生成随机密钥
	static generateSecret(bytes = 20) {
		const array = new Uint8Array(bytes)

		if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
			crypto.getRandomValues(array)
		} else {
			// 兼容性处理
			for (let i = 0; i < bytes; i++) {
				array[i] = Math.floor(Math.random() * 256)
			}
		}

		return Base32.encode(array)
	}

	// 将Base32密钥转换为十六进制字符串
	static toHex(encoded) {
		const bytes = this.decode(encoded)
		return Array.from(bytes)
			.map(b => b.toString(16).padStart(2, '0'))
			.join('')
			.toUpperCase()
	}
}

// TOTP 算法实现（参考Java代码）
class TOTP {
	// 数字幂数组，用于计算10的n次方
	static DIGITS_POWER = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000]

	// 算法标识
	static HMAC_SHA1 = 'SHA1'
	static HMAC_SHA256 = 'SHA256'
	static HMAC_SHA512 = 'SHA512'

	// 默认设置
	static DEFAULT_DIGITS = 6
	static DEFAULT_TIME_STEP = 30
	static DEFAULT_START_TIME = 0
	static DEFAULT_TIME_WINDOW = 1

	/**
	 * 将十六进制字符串转换为字节数组
	 * @param {string} hex 十六进制字符串
	 * @returns {Uint8Array} 字节数组
	 */
	static hexStr2Bytes(hex) {
		const bytes = []
		for (let i = 0; i < hex.length; i += 2) {
			bytes.push(parseInt(hex.substr(i, 2), 16))
		}
		return new Uint8Array(bytes)
	}

	/**
	 * 将字节数组转换为十六进制字符串
	 * @param {Uint8Array} bytes 字节数组
	 * @returns {string} 十六进制字符串
	 */
	static bytes2HexStr(bytes) {
		return Array.from(bytes)
			.map(b => b.toString(16).padStart(2, '0'))
			.join('')
			.toUpperCase()
	}

	/**
	 * 将长整型时间计数器转换为16字符的十六进制字符串
	 * @param {number} time 时间计数器
	 * @returns {string} 16字符十六进制字符串
	 */
	static timeToHexString(time) {
		let hex = time.toString(16).toUpperCase()
		// 填充至16字符（64位）
		while (hex.length < 16) {
			hex = '0' + hex
		}
		return hex
	}

	/**
	 * 计算HMAC
	 * @param {string} crypto 算法：SHA1, SHA256, SHA512
	 * @param {Uint8Array} keyBytes 密钥字节数组
	 * @param {Uint8Array} text 消息字节数组
	 * @returns {Uint8Array} HMAC结果
	 */
	static hmacSha(crypto, keyBytes, text) {
		// 将Uint8Array转换为CryptoJS需要的格式
		const keyWordArray = CryptoJS.lib.WordArray.create(keyBytes.buffer)
		const textWordArray = CryptoJS.lib.WordArray.create(text.buffer)

		let hmac
		switch (crypto.toUpperCase()) {
			case 'SHA256':
				hmac = CryptoJS.HmacSHA256(textWordArray, keyWordArray)
				break
			case 'SHA512':
				hmac = CryptoJS.HmacSHA512(textWordArray, keyWordArray)
				break
			case 'SHA1':
			default:
				hmac = CryptoJS.HmacSHA1(textWordArray, keyWordArray)
				break
		}

		// 将CryptoJS的WordArray转换回Uint8Array
		const hex = hmac.toString(CryptoJS.enc.Hex)
		return this.hexStr2Bytes(hex)
	}

	/**
	 * 生成TOTP（核心方法，参考Java实现）
	 * @param {string} key - 十六进制密钥字符串
	 * @param {string} time - 十六进制时间字符串
	 * @param {number} returnDigits - 返回的位数
	 * @param {string} crypto - 算法：SHA1, SHA256, SHA512
	 * @returns {string} TOTP值
	 */
	static generateTOTPFromHex(key, time, returnDigits = 6, crypto = 'SHA1') {
		// 参数验证
		if (returnDigits < 1 || returnDigits > 8) {
			throw new Error('TOTP位数必须在1到8之间')
		}

		if (!key || !time) {
			throw new Error('密钥和时间参数不能为空')
		}

		// 时间字符串填充至16字符
		let paddedTime = time
		while (paddedTime.length < 16) {
			paddedTime = '0' + paddedTime
		}

		try {
			const msg = this.hexStr2Bytes(paddedTime)
			const k = this.hexStr2Bytes(key)
			const hash = this.hmacSha(crypto, k, msg)

			// 动态截断：取最后一字节的低4位作为偏移量
			const offset = hash[hash.length - 1] & 0x0f

			// 从偏移位置取4字节，按大端序组合为整数
			const binary = ((hash[offset] & 0x7f) << 24) |
				((hash[offset + 1] & 0xff) << 16) |
				((hash[offset + 2] & 0xff) << 8) |
				(hash[offset + 3] & 0xff)

			// 取模得到指定位数的TOTP值
			const otp = binary % this.DIGITS_POWER[returnDigits]

			// 格式化为指定位数字符串，不足位补零
			return otp.toString().padStart(returnDigits, '0')

		} catch (error) {
			console.error('TOTP生成失败:', error)
			throw new Error('TOTP生成失败: ' + error.message)
		}
	}

	/**
	 * 从Base32密钥生成TOTP（这是我们主要使用的方法）
	 * @param {string} base32Key - Base32编码的密钥
	 * @param {Object} options - 选项
	 * @returns {Object} {code, expiresIn, algorithm, digits, period}
	 */
	static generate(base32Key, options = {}) {
		try {
			const {
				algorithm = 'SHA1',
					digits = 6,
					period = 30,
					timestamp = Date.now()
			} = options

			// 1. 清理并解码Base32密钥
			const cleanKey = base32Key
				.replace(/\s/g, '')
				.replace(/[^A-Z2-7]/gi, '')
				.toUpperCase()

			if (cleanKey.length < 16) {
				throw new Error('密钥长度太短，至少需要16个字符')
			}

			const keyBytes = Base32.decode(cleanKey)

			// 2. 计算时间计数器（参考Java代码）
			const currentTime = Math.floor(timestamp / 1000)
			const timeStep = Math.floor((currentTime - this.DEFAULT_START_TIME) / period)

			// 3. 将时间计数器转换为十六进制字符串
			const timeHex = this.timeToHexString(timeStep)

			// 4. 将密钥字节数组转换为十六进制字符串
			const keyHex = this.bytes2HexStr(keyBytes)

			// 5. 生成TOTP
			const code = this.generateTOTPFromHex(
				keyHex,
				timeHex,
				digits,
				algorithm
			)

			// 6. 计算剩余时间
			const expiresIn = period - (currentTime % period)

			return {
				code,
				expiresIn,
				algorithm,
				digits,
				period
			}

		} catch (error) {
			console.error('TOTP生成失败:', error)
			throw error
		}
	}

	/**
	 * 验证TOTP代码，考虑时间偏移容错
	 * @param {string} base32Key - Base32编码的密钥
	 * @param {string} code - 要验证的代码
	 * @param {Object} options - 选项
	 * @returns {boolean} 验证是否成功
	 */
	static verify(base32Key, code, options = {}) {
		try {
			const {
				algorithm = 'SHA1',
					digits = 6,
					period = 30,
					timeWindow = 1
			} = options

			const currentTime = Math.floor(Date.now() / 1000)
			const currentTimeStep = Math.floor((currentTime - this.DEFAULT_START_TIME) / period)

			// 检查当前时间步及其前后时间窗口内的步数
			for (let i = -timeWindow; i <= timeWindow; i++) {
				const timeStep = currentTimeStep + i
				const timeHex = this.timeToHexString(timeStep)

				// 清理并解码Base32密钥
				const cleanKey = base32Key
					.replace(/\s/g, '')
					.replace(/[^A-Z2-7]/gi, '')
					.toUpperCase()

				const keyBytes = Base32.decode(cleanKey)
				const keyHex = this.bytes2HexStr(keyBytes)

				try {
					const totp = this.generateTOTPFromHex(keyHex, timeHex, digits, algorithm)
					if (totp === code) {
						return true
					}
				} catch (error) {
					// 忽略单个时间步的错误，继续验证其他步数
					continue
				}
			}

			return false

		} catch (error) {
			console.error('TOTP验证失败:', error)
			return false
		}
	}

	/**
	 * 生成随机密钥
	 * @param {string} algorithm - 算法：SHA1, SHA256, SHA512
	 * @returns {string} Base32编码的密钥
	 */
	static generateSecret(algorithm = 'SHA1') {
		let bytes = 20 // SHA1 默认

		switch (algorithm.toUpperCase()) {
			case 'SHA256':
				bytes = 32 // SHA256 推荐32字节
				break
			case 'SHA512':
				bytes = 64 // SHA512 推荐64字节
				break
		}

		return Base32.generateSecret(bytes)
	}

	/**
	 * 计算密钥强度
	 * @param {string} secret - Base32密钥
	 * @returns {string} 强度等级: weak, medium, strong
	 */
	static getSecretStrength(secret) {
		try {
			const cleanSecret = secret
				.replace(/\s/g, '')
				.replace(/[^A-Z2-7]/gi, '')
				.toUpperCase()

			const bits = cleanSecret.length * 5 // Base32每个字符5位

			if (bits < 80) return 'weak'
			if (bits < 128) return 'medium'
			return 'strong'
		} catch {
			return 'weak'
		}
	}

	/**
	 * 测试函数：验证算法是否正确（使用RFC 6238测试向量）
	 */
	static test() {
		console.log('TOTP算法测试')
		console.log('============')

		// RFC 6238 测试向量（十六进制密钥）
		const seed20 = '3132333435363738393031323334353637383930' // 20字节密钥（SHA1）
		const seed32 = '3132333435363738393031323334353637383930313233343536373839303132' // 32字节密钥（SHA256）
		const seed64 = '3132333435363738393031323334353637383930' +
			'3132333435363738393031323334353637383930' +
			'3132333435363738393031323334353637383930' +
			'31323334' // 64字节密钥（SHA512）

		// 测试时间点（Unix时间戳）
		const testTime = [59, 1111111109, 1111111111, 1234567890, 2000000000, 20000000000]

		// 预期的TOTP值（8位）
		const expectedSHA1 = [
			'94287082', '07081804', '14050471', '89005924', '69279037', '65353130'
		]

		const expectedSHA256 = [
			'46119246', '68084774', '67062674', '91819424', '90698825', '77737706'
		]

		const expectedSHA512 = [
			'90693936', '25091201', '99943326', '93441116', '38618901', '47863826'
		]

		console.log('RFC 6238 测试向量验证结果:')
		console.log('+---------------+------------------+----------+----------+---------+')
		console.log('| 时间(秒)      |  T值(十六进制)   |  TOTP值  | 算法     | 结果    |')
		console.log('+---------------+------------------+----------+----------+---------+')

		let allPassed = true

		for (let i = 0; i < testTime.length; i++) {
			const timeValue = testTime[i]
			const T = Math.floor((timeValue - this.DEFAULT_START_TIME) / this.DEFAULT_TIME_STEP)
			const steps = this.timeToHexString(T)

			const fmtTime = timeValue.toString().padStart(11, ' ')

			// 测试SHA1
			const totpSHA1 = this.generateTOTPFromHex(seed20, steps, 8, 'SHA1')
			const sha1Result = totpSHA1 === expectedSHA1[i] ? '✓' : '✗'
			if (sha1Result === '✗') allPassed = false

			console.log(`| ${fmtTime} | ${steps} | ${totpSHA1} | SHA1     | ${sha1Result}     |`)

			// 测试SHA256
			const totpSHA256 = this.generateTOTPFromHex(seed32, steps, 8, 'SHA256')
			const sha256Result = totpSHA256 === expectedSHA256[i] ? '✓' : '✗'
			if (sha256Result === '✗') allPassed = false

			console.log(`| ${fmtTime} | ${steps} | ${totpSHA256} | SHA256   | ${sha256Result}     |`)

			// 测试SHA512
			const totpSHA512 = this.generateTOTPFromHex(seed64, steps, 8, 'SHA512')
			const sha512Result = totpSHA512 === expectedSHA512[i] ? '✓' : '✗'
			if (sha512Result === '✗') allPassed = false

			console.log(`| ${fmtTime} | ${steps} | ${totpSHA512} | SHA512   | ${sha512Result}     |`)
			console.log('+---------------+------------------+----------+----------+---------+')
		}

		if (allPassed) {
			console.log('\n所有测试通过！算法实现正确。')
		} else {
			console.log('\n部分测试失败！请检查算法实现。')
		}

		// 测试Base32密钥生成和验证
		console.log('\nBase32密钥测试:')
		console.log('================')

		const base32Secret = Base32.generateSecret(20)
		console.log('生成的Base32密钥:', base32Secret)

		// 转换为十六进制进行验证
		const hexKey = Base32.toHex(base32Secret)
		console.log('对应的十六进制密钥:', hexKey)

		// 生成当前TOTP
		const currentTime = Math.floor(Date.now() / 1000)
		const currentTimeStep = Math.floor((currentTime - this.DEFAULT_START_TIME) / this.DEFAULT_TIME_STEP)
		const currentSteps = this.timeToHexString(currentTimeStep)

		const generatedTOTP = this.generateTOTPFromHex(hexKey, currentSteps, 6, 'SHA1')
		console.log('生成的TOTP:', generatedTOTP)

		// 验证
		const isValid = this.verify(base32Secret, generatedTOTP)
		console.log('验证结果:', isValid ? '通过 ✓' : '失败 ✗')

		return allPassed
	}
}

// URI解析工具
class OTPURI {
	
	static parse(uri) {
	  if (!uri.startsWith('otpauth://')) {
	    throw new Error('无效的OTP Auth URI')
	  }
	  
	  // 先对整个URI进行解码
	  const decodedUri = decodeURIComponent(uri);
	  // console.log("解码后的完整URI:", decodedUri);
	  
	  // 解析URI
	  const match = decodedUri.match(/otpauth:\/\/(totp|hotp)\/([^?]+)\?(.+)/i)
	  if (!match) {
	    throw new Error('URI格式不正确')
	  }
	  
	  const [, type, label, query] = match
	  
	  // 使用更安全的方式解析查询参数
	  const params = {}
	  const pairs = query.split('&')
	  
	  for (let i = 0; i < pairs.length; i++) {
	    const pair = pairs[i]
	    const equalIndex = pair.indexOf('=')
	    
	    if (equalIndex === -1) {
	      continue
	    }
	    
	    const key = pair.substring(0, equalIndex)
	    let value = pair.substring(equalIndex + 1)
	    
	    // 特殊处理：如果key是secret，且value以"=..."结尾，检查是否需要合并
	    if (key === 'secret') {
	      // 检查后续的parts是否有被错误分割的
	      for (let j = i + 1; j < pairs.length; j++) {
	        const nextPair = pairs[j]
	        // 如果下一个参数以=开头，可能是被错误分割的secret值
	        if (nextPair.startsWith('=')) {
	          value += '&' + nextPair
	          i = j // 跳过这个已处理的片段
	        } else {
	          break
	        }
	      }
	    }
	    
	    params[key] = value
	  }
	  // console.log("解析的参数键:", Object.keys(params))
	  // console.log("algorithm参数:", params.algorithm)
	  // console.log("secret参数长度:", params.secret?.length)
	  // console.log("完整secret:", params.secret)
	  
	  // 规范化算法参数
	  let algorithm = (params.algorithm || 'SHA1').toUpperCase()
	  // 处理 HMACSHA512, HMACSHA256, HMACSHA1 等格式
	  if (algorithm.startsWith('HMAC')) {
	    algorithm = algorithm.replace('HMAC', '')
	  }
	  
	  const result = {
	    type: type.toLowerCase(),
	    // secret已经是解码后的，只需要清理格式
	    secret: params.secret ? params.secret.replace(/\s/g, '').toUpperCase() : '',
	    issuer: params.issuer || '',
	    algorithm: algorithm,
	    digits: parseInt(params.digits) || 6,
	    period: parseInt(params.period) || 30,
	    counter: parseInt(params.counter) || 0
	  }
	  
	  // 解析标签（account和issuer）
	  const decodedLabel = decodeURIComponent(label)
	  // console.log("解码后的label:", decodedLabel)
	  
	  const colonIndex = decodedLabel.indexOf(':')
	  if (colonIndex !== -1) {
	    const labelIssuer = decodedLabel.substring(0, colonIndex)
	    const labelAccount = decodedLabel.substring(colonIndex + 1)
	    
	    // 如果params中没有issuer，使用label中的
	    if (!result.issuer && labelIssuer) {
	      result.issuer = labelIssuer
	    }
	    result.account = labelAccount
	  } else {
	    result.account = decodedLabel
	  }
	  
	  // 如果params中有issuer参数，优先使用它
	  if (params.issuer) {
	    result.issuer = params.issuer
	  }
	  
	  // 验证必需参数
	  if (!result.secret) {
	    throw new Error('缺少必需参数: secret')
	  }
	  
	  // 验证算法
	  if (!['SHA1', 'SHA256', 'SHA512'].includes(result.algorithm)) {
	    throw new Error(`不支持的算法: ${result.algorithm}，支持的算法: SHA1, SHA256, SHA512`)
	  }
	  
	  // 验证位数
	  if (result.digits < 1 || result.digits > 8) {
	    throw new Error(`无效的位数: ${result.digits}，必须是1-8之间的整数`)
	  }
	  
	  // 验证时间步长
	  if (result.period <= 0) {
	    throw new Error(`无效的时间步长: ${result.period}，必须是正整数`)
	  }
	  
	  return result
	}

	static generate(options) {
		const {
			type = 'totp',
				issuer = '',
				account,
				secret,
				algorithm = 'SHA1',
				digits = 6,
				period = 30,
				counter = 0
		} = options

		if (!account || !secret) {
			throw new Error('账户名和密钥是必需的')
		}

		let label = encodeURIComponent(account)
		if (issuer) {
			label = `${encodeURIComponent(issuer)}:${label}`
		}

		let uri = `otpauth://${type}/${label}?secret=${secret}`

		if (issuer) uri += `&issuer=${encodeURIComponent(issuer)}`
		if (algorithm !== 'SHA1') uri += `&algorithm=${algorithm}`
		if (digits !== 6) uri += `&digits=${digits}`
		if (period !== 30) uri += `&period=${period}`
		if (type === 'hotp' && counter !== 0) uri += `&counter=${counter}`

		return uri
	}
}

// 支持的算法
const SUPPORTED_ALGORITHMS = [{
		value: 'SHA1',
		label: 'SHA1',
		desc: '最广泛的兼容性'
	},
	{
		value: 'SHA256',
		label: 'SHA256',
		desc: '更高的安全性'
	},
	{
		value: 'SHA512',
		label: 'SHA512',
		desc: '最高安全性'
	}
]

export {
	Base32,
	TOTP,
	OTPURI,
	SUPPORTED_ALGORITHMS
}