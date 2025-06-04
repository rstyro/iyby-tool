import Vue from 'vue';
let vm = new Vue();

// 转大写
export function toUpperCase(arg) {
	return arg && arg.toUpperCase();
}
