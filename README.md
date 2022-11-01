# iyby-tool
- 小程序工具库

### 一、jsencrypt.js 处理
- jsncrypt代码里面含有window、document、navigator对象
- 因为在小程序中没有这些对象,所以需要处理


**问题1：**
```js
// 找到如下代码，大概2624行：
if (j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
} else if (j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
} else { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
}


// 修改为： 只保留最后的else分支即可
BigInteger.prototype.am = am3;
dbits = 28;

```


**问题2：**
```js
// 找到下面代码注释上，大概2754
if (window.crypto && window.crypto.getRandomValues) {
  // Extract entropy (2048 bits) from RNG if available
  var z = new Uint32Array(256);
  window.crypto.getRandomValues(z);
  for (t = 0; t < z.length; ++t) {
    rng_pool[rng_pptr++] = z[t] & 255;
  }
}

// 改为如下：
var getRandomValues = function (array) {
    for (var i = 0, l = array.length; i < l; i++) {
        array[i] = Math.floor(Math.random() * 256);
    }    return array;
}
var z = new Uint32Array(256);
getRandomValues(z);

```


**问题3：**
- 兼容window.removeEventListener、window.detachEvent，直接将所有的监听事件注释即可

```js
// 代码块1 注释如下代码
if (window.removeEventListener) {
    window.removeEventListener("mousemove", onMouseMoveListener_1, false);
}
else if (window.detachEvent) {
    window.detachEvent("onmousemove", onMouseMoveListener_1);
}


// 代码块2
if (window.addEventListener) {
    window.addEventListener("mousemove", onMouseMoveListener_1, false);
}
else if (window.attachEvent) {
    window.attachEvent("onmousemove", onMouseMoveListener_1);
}

// 代码块3 ，没有window对象，这个也注释上
window.JSEncrypt = JSEncrypt
```
### 二、crypto-js
- 这个不能装最新版本的，最新版本的用到了`window.crypto.getRandomValues`
- 在小程序中没有window对象，所以没法用。
- 只能用3.3.0版本的才可以


```js
npm install crypto-js@3.3.0 -S
```