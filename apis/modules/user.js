// 用户相关api
const http = uni.$u.http;

// 注册账号
export function register(params){
	return http.post('/user/register', params)
}

// h5登录
export function login(params,headers={}){
	return http.post('/user/login', params,{
		header: headers
	})
}


// 判断用户是否登录
export function isLogin(params){
	return http.get('/user/isLogin', {params})
}

// 获取用户信息
export function getUserInfo(params,config = {}){
	return http.get('/user/getUserInfo', {
		 params: params,
		...config
	})
}

// 获取系统信息
export function getNoticePage(params,pageNum=1){
	return http.get('/user/notice/getNoticePage?pageSize=30&pageNum='+pageNum, {params})
}

