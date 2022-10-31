// 阿拉伯数字转古代中文金额
export const convertToCnMoney = (money) => {
	//汉字的数字
	var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
	//基本单位
	var cnIntRadice = new Array('', '拾', '佰', '仟');
	//对应整数部分扩展单位
	var cnIntUnits = new Array('', '万', '亿', '兆');
	//对应小数部分单位
	var cnDecUnits = new Array('角', '分', '毫', '厘');
	//整数金额时后面跟的字符
	var cnInteger = '';
	//整型完以后的单位
	var cnIntLast = '';
	//最大处理的数字
	var maxNum = 999999999999999.9999;
	//金额整数部分
	var integerNum;
	//金额小数部分
	var decimalNum;
	//输出的中文金额字符串
	var chineseStr = '';
	//分离金额后用的数组，预定义
	var parts;
	if (money == '') {
		return '';
	}
	money = parseFloat(money);
	if (money >= maxNum) {
		//超出最大处理数字
		return '';
	}
	if (money == 0) {
		chineseStr = cnNums[0] + cnIntLast + cnInteger;
		return chineseStr;
	}
	//转换为字符串
	money = money.toString();
	if (money.indexOf('.') == -1) {
		integerNum = money;
		decimalNum = '';
	} else {
		parts = money.split('.');
		integerNum = parts[0];
		decimalNum = parts[1].substr(0, 4);
	}
	//获取整型部分转换
	if (parseInt(integerNum, 10) > 0) {
		var zeroCount = 0;
		var IntLen = integerNum.length;
		for (var i = 0; i < IntLen; i++) {
			var n = integerNum.substr(i, 1);
			var p = IntLen - i - 1;
			var q = p / 4;
			var m = p % 4;
			if (n == '0') {
				zeroCount++;
			} else {
				if (zeroCount > 0) {
					chineseStr += cnNums[0];
				}
				//归零
				zeroCount = 0;
				chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
			}
			if (m == 0 && zeroCount < 4) {
				chineseStr += cnIntUnits[q];
			}
		}
		chineseStr += cnIntLast + "圆";
	}
	//小数部分
	if (decimalNum != '') {
		var decLen = decimalNum.length;
		for (var i = 0; i < decLen; i++) {
			var n = decimalNum.substr(i, 1);
			if (n != '0') {
				chineseStr += cnNums[Number(n)] + cnDecUnits[i];
			} else if (n == '0') {
				chineseStr += cnNums[Number(n)];
			}
		}
	}
	if (chineseStr == '') {
		chineseStr += cnNums[0] + cnIntLast + cnInteger;
	} else if (decimalNum == '') {
		chineseStr += cnInteger + "整";
	}
	return chineseStr;
}

// 获取生肖年
export const getZodiac = (year) => {
	// const arr = ['猴','鸡','狗','猪','鼠','牛','虎','兔','龙','蛇','马','羊'];
	const arr = ['申猴', '酉鸡', '戌狗', '亥猪', '子鼠', '丑牛', '寅虎', '卯兔', '辰龙', '巳蛇', '午马', '未羊'];
	return arr[year % 12];
}


// 时间转换时间戳(秒)
export const getTimestampByDate = (dateTime) => {
	let date = new Date(); //时间对象
	if (dateTime) {
		// 格式替换一下
		var strtime = dateTime.toString().replace(/-/g, '/')
		date = new Date(strtime);
	}
	let mills = date.getTime();
	return Number(mills).toString(); //转换成时间戳
}

//格式化时间
function dateFormat(dat) {
	//获取年月日，时间
	var year = dat.getFullYear();
	var mon = (dat.getMonth() + 1) < 10 ? "0" + (dat.getMonth() + 1) : dat.getMonth() + 1;
	var data = dat.getDate() < 10 ? "0" + (dat.getDate()) : dat.getDate();
	var hour = dat.getHours() < 10 ? "0" + (dat.getHours()) : dat.getHours();
	var min = dat.getMinutes() < 10 ? "0" + (dat.getMinutes()) : dat.getMinutes();
	var seon = dat.getSeconds() < 10 ? "0" + (dat.getSeconds()) : dat.getSeconds();
	var newDate = year + "-" + mon + "-" + data + " " + hour + ":" + min + ":" + seon;
	return newDate;
}

// 时间戳(秒)转日期
export const getDateByTimestamp = (timestamp) => {
	let date = new Date(); //时间对象
	if (timestamp) {
		date = new Date(timestamp);
	}
	return dateFormat(date);
}


// 十进制转其他进制
export const baseTenToOther = (value, baseTo) => {
	return value.toString(baseTo);
}

// 进制转换
export const baseConversion = (value, baseFrom, baseTo) => {
	return parseInt(value, baseFrom).toString(baseTo);
}

// 日期加减几天，day-负减正加
export const getDateAddOrSubDay = (day, dateTime) => {
	let date = new Date(); //时间对象
	if (dateTime) {
		// 格式替换一下
		var strtime = dateTime.toString().replace(/-/g, '/')
		date = new Date(strtime);
	}
	date.setDate(date.getDate() + day);
	return dateFormat(date);
}

// 复制到剪切板
export const copyData = (data) => {
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
