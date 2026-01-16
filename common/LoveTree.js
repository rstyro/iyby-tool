/**
 * 文件名：LoveTree.js
 * 适配uni-app版本 - 优化版【新增画布快照+图片平移核心方法】
 */
class Common {

	random(min, max) {
		return min + Math.floor(Math.random() * (max - min + 1));
	}

	// 贝塞尔曲线
	bezier(cp, t) {
		let p1 = cp[0].mul((1 - t) * (1 - t));
		let p2 = cp[1].mul(2 * t * (1 - t));
		let p3 = cp[2].mul(t * t);
		return p1.add(p2).add(p3);
	}

	inheart(x, y, r) {
		// x^2+(y-(x^2)^(1/3))^2 = 1
		// http://www.wolframalpha.com/input/?i=x%5E2%2B%28y-%28x%5E2%29%5E%281%2F3%29%29%5E2+%3D+1

		const z = ((x / r) * (x / r) + (y / r) * (y / r) - 1) * ((x / r) * (x / r) + (y / r) * (y / r) - 1) * ((x /
			r) * (x / r) + (y / r) * (y / r) - 1) - (x / r) * (x / r) * (y / r) * (y / r) * (y / r);
		return z < 0;
	}
}

/**
 * 点 的加减乘除
 */
class Point {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	clone() {
		return new Point(this.x, this.y);
	}

	add(o) {
		let p = this.clone();
		p.x += o.x;
		p.y += o.y;
		return p;
	}

	sub(o) {
		let p = this.clone();
		p.x -= o.x;
		p.y -= o.y;
		return p;
	}

	div(n) {
		let p = this.clone();
		p.x /= n;
		p.y /= n;
		return p;
	}

	mul(n) {
		let p = this.clone();
		p.x *= n;
		p.y *= n;
		return p;
	}
}

// 心形
class Heart {
	constructor() {
		let points = [],
			x, y, t;
		for (let i = 10; i < 30; i += 0.2) {
			t = i / Math.PI;
			x = 16 * Math.pow(Math.sin(t), 3);
			y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
			points.push(new Point(x, y));
		}

		this.points = points;
		this.length = points.length;
	}

	get(i, scale) {
		return this.points[i].mul(scale || 1);
	}
}

// 种子
class Seed {
	constructor(tree, point, scale, color) {
		this.tree = tree;
		this._scale = scale || 1;
		this._color = color || '#FF0000';

		this.heart = {
			point: point,
			scale: this._scale,
			color: this._color,
			figure: new Heart(),
		}

		this.circle = {
			point: point,
			scale: this._scale,
			color: this._color,
			radius: 5,
		}

		// 记录当前显示的图形类型
		this.currentGraphic = 'heart'; // 'heart' 或 'circle'
	}

	draw() {
		if (this.currentGraphic === 'heart') {
			this.drawHeart();
			this.drawText();
		} else {
			this.drawCircle();
		}
	}

	setGraphic(type) {
		this.currentGraphic = type;
	}

	addPosition(x, y) {
		this.circle.point = this.circle.point.add(new Point(x, y));
	}

	canMove() {
		return this.circle.point.y < (this.tree.height + 20);
	}

	move(x, y) {
		this.clear();
		this.setGraphic('circle');
		this.draw();
		this.addPosition(x, y);
	}

	canScale() {
		return this.heart.scale > 0.2;
	}

	setHeartScale(scale) {
		this.heart.scale *= scale;
		this.circle.scale *= scale;
	}

	scale(scale) {
		this.clear();
		this.setHeartScale(scale);
		this.draw();
	}

	drawHeart() {
		let ctx = this.tree.ctx,
			heart = this.heart;
		let point = heart.point,
			color = heart.color,
			scale = heart.scale;

		ctx.save();
		ctx.setFillStyle(color);
		ctx.translate(point.x, point.y);
		ctx.beginPath();

		// 绘制心形
		for (let i = 0; i < heart.figure.length; i++) {
			let p = heart.figure.get(i, scale);
			if (i === 0) {
				ctx.moveTo(p.x, -p.y);
			} else {
				ctx.lineTo(p.x, -p.y);
			}
		}

		ctx.closePath();
		ctx.fill();
		ctx.restore();

		// 立即绘制
		ctx.draw(true);
	}

	drawCircle() {
		let ctx = this.tree.ctx,
			circle = this.circle;
		let point = circle.point,
			color = circle.color,
			scale = circle.scale,
			radius = circle.radius;

		ctx.save();
		ctx.setFillStyle(color);
		ctx.translate(point.x, point.y);
		ctx.scale(scale, scale);
		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.restore();

		// 立即绘制
		ctx.draw(true);
	}

	drawText() {
		let ctx = this.tree.ctx,
			heart = this.heart;
		let point = heart.point,
			color = heart.color,
			scale = heart.scale;

		ctx.save();
		ctx.setStrokeStyle(color);
		ctx.setFillStyle(color);
		ctx.translate(point.x, point.y);
		ctx.scale(scale, scale);

		// 文字下的线条
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(15, 15);
		ctx.lineTo(40, 15);
		ctx.stroke();

		ctx.setFontSize(12);
		ctx.fillText("戳我", 23, 16);
		ctx.restore();

		// 立即绘制
		ctx.draw(true);
	}

	clear() {
		let ctx = this.tree.ctx,
			circle = this.circle;
		let point = circle.point,
			scale = circle.scale,
			radius = 26;
		let w = (radius * scale);
		let h = (radius * scale);
		ctx.clearRect(point.x - w, point.y - h, 4 * w, 4 * h);
		ctx.draw(true);
	}

	// 判断点击是否在种子范围内
	isPointInside(x, y) {
		let point, radius;

		if (this.currentGraphic === 'heart') {
			// 对于心形，使用心形外接圆来近似检测
			point = this.heart.point;
			radius = 30 * this.heart.scale; // 心形的大致半径
		} else {
			// 对于圆形，使用圆形的参数
			point = this.circle.point;
			radius = this.circle.radius * this.circle.scale;
		}

		// 计算点击位置与种子中心的距离
		const dx = x - point.x;
		const dy = y - point.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		return distance < radius;
	}
}

// 底部横线，算是土地
class Footer {
	constructor(tree, width, height, speed) {
		this.tree = tree;
		this.point = new Point(tree.seed.heart.point.x, tree.height - height / 2);
		this.width = width;
		this.height = height;
		this.speed = speed || 2;
		this.length = 0;
	}

	draw() {
		let ctx = this.tree.ctx,
			point = this.point;
		let len = this.length / 2;

		ctx.save();
		ctx.setStrokeStyle('rgb(35, 31, 32)');
		ctx.setLineWidth(this.height);
		ctx.setLineCap('round');
		ctx.setLineJoin('round');
		ctx.translate(point.x, point.y);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(len, 0);
		ctx.lineTo(-len, 0);
		ctx.stroke();
		ctx.restore();

		if (this.length < this.width) {
			this.length += this.speed;
		}

		// 立即绘制
		ctx.draw(true);
	}
}

class Tree {
	constructor(ctx, width, height, opt) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.opt = opt || {};

		this.record = {};
		// 自适应半径，基于高度
		this.r = height * 0.4; // 原来是固定240，现在按比例

		this.initSeed();
		this.initFooter();
		this.initBranch();
		this.initBloom();

		// 动画状态
		this.animationStarted = false;
		// ========== 新增：快照相关属性 ==========
		this.snapshotPath = ''; // 画布快照的临时图片路径
		this.snapshotX = 0; // 快照图片的X轴偏移量（核心移动参数）
		this.snapshotY = 0; // 快照图片的Y轴偏移量
		this.isMoved = false; // 树是否已经完成移动
	}

	initSeed() {
		let seed = this.opt.seed || {};
		let x = seed.x || this.width / 2;
		let y = seed.y || this.height / 2 - this.height * 0.1; // 稍微上移
		let point = new Point(x, y);
		let color = seed.color || '#FF0000';
		// 根据屏幕大小调整种子缩放
		let baseScale = Math.min(this.width, this.height) / 700;
		let scale = (seed.scale || 1) * baseScale;

		this.seed = new Seed(this, point, scale, color);
	}

	initFooter() {
		let footer = this.opt.footer || {};
		let width = footer.width || this.width * 1.5; // 根据宽度调整
		let height = footer.height || Math.max(5, this.height * 0.007); // 按比例
		let speed = footer.speed || 2;
		this.footer = new Footer(this, width, height, speed);
	}

	initBranch() {
		let branchs = this.opt.branch || []
		this.branchs = [];
		this.addBranchs(branchs);
	}

	initBloom() {
		let bloom = this.opt.bloom || {};
		let cache = [],
			// 根据屏幕大小动态调整花朵数量
			num = bloom.num || Math.floor(this.width * this.height / 300),
			width = bloom.width || this.width,
			height = bloom.height || this.height,
			figure = this.seed.heart.figure;

		console.log(`生成花朵数量: ${num}`);
		for (let i = 0; i < num; i++) {
			cache.push(this.createBloom(width, height, this.r, figure));
		}
		this.blooms = [];
		this.bloomsCache = cache;
	}

	addBranch(branch) {
		this.branchs.push(branch);
	}

	addBranchs(branchs) {
		let s = this,
			b, p1, p2, p3, r, l, c;
		for (let i = 0; i < branchs.length; i++) {
			b = branchs[i];

			// 根据屏幕大小缩放坐标
			const scaleX = (this.width / 1100)*1;
			const scaleY = (this.height / 680)*1;
			// const scaleX = 1;
			// const scaleY = 1;

			p1 = new Point(b[0] * scaleX, b[1] * scaleY);
			p2 = new Point(b[2] * scaleX, b[3] * scaleY);
			p3 = new Point(b[4] * scaleX, b[5] * scaleY);
			r = b[6] * Math.min(scaleX, scaleY);
			l = b[7] * Math.min(scaleX, scaleY);
			c = b[8]
			s.addBranch(new Branch(s, p1, p2, p3, r, l, c));
		}
	}

	removeBranch(branch) {
		let branchs = this.branchs;
		for (let i = 0; i < branchs.length; i++) {
			if (branchs[i] === branch) {
				branchs.splice(i, 1);
			}
		}
	}

	canGrow() {
		return !!this.branchs.length;
	}

	grow() {
		let branchs = this.branchs;
		for (let i = 0; i < branchs.length; i++) {
			let branch = branchs[i];
			if (branch) {
				branch.grow();
			}
		}
		this.ctx.draw(true);
	}

	addBloom(bloom) {
		this.blooms.push(bloom);
	}

	removeBloom(bloom) {
		let blooms = this.blooms;
		for (let i = 0; i < blooms.length; i++) {
			if (blooms[i] === bloom) {
				blooms.splice(i, 1);
			}
		}

	}

	createBloom(width, height, radius, figure, color, alpha, angle, scale, place, speed) {
		let x, y;
		let common = new Common();
		while (true) {
			x = common.random(20, width - 10);
			y = common.random(20, height - 20);
			// 增加生成成功条件
			if (common.inheart(x - width / 2, height - (height - 40) / 2 - y, radius) ) {
				return new Bloom(this, new Point(x, y), figure, color, alpha, angle, scale, place, speed);
			}
		}
	}

	canFlower() {
		return !!this.blooms.length;
	}

	flower(num) {
		let s = this;
		// 每次开放更多花朵
		let bloomsToFlower = Math.min(num * 3, s.bloomsCache.length);
		let blooms = s.bloomsCache.splice(0, bloomsToFlower);
		for (let i = 0; i < blooms.length; i++) {
			s.addBloom(blooms[i]);
		}

		blooms = s.blooms;
		for (let j = 0; j < blooms.length; j++) {
			blooms[j].flower();
		}
		this.ctx.draw(true);
	}

	jump() {
		let s = this,
			blooms = s.blooms;
		// console.log("blooms.length==",blooms.length)
		if (blooms.length) {
			for (let i = 0; i < blooms.length; i++) {
				blooms[i].jump();
			}
		}
		if ((blooms.length && blooms.length < 3) || !blooms.length) {
			let bloom = this.opt.bloom || {},
				width = bloom.width || this.width,
				height = bloom.height || this.height,
				figure = this.seed.heart.figure;
			let r = 240;
			const common = new Common();
			for (let i = 0; i < common.random(1, 2); i++) {
				let createBloom = this.createBloom(width / 2 + width, height, r, figure, null, 1, null, 1,
					new Point(common.random(-100, 600), height), common.random(200, 300));
				blooms.push(createBloom);
			}
		}
	}

	// ========== 核心新增：生成画布快照（转临时图片） ==========
	createCanvasSnapshot() {
		const _this = this;
		return new Promise((resolve, reject) => {
			// 先完成当前画布的所有绘制
			_this.ctx.draw(true, () => {
				// uni-app 生成画布临时图片
				uni.canvasToTempFilePath({
					canvasId: 'loveTreeCanvas',
					width: _this.width,
					height: _this.height,
					destWidth: _this.width,
					destHeight: _this.height,
					quality: 1, // 图片质量 无损
					success: (res) => {
						_this.snapshotPath = res.tempFilePath;
						// console.log('画布快照生成成功', res.tempFilePath);
						resolve(res.tempFilePath);
					},
					fail: (err) => {
						console.error('画布快照生成失败', err);
						reject(err);
					}
				}, _this);
			});
		});
	}

	// ========== 核心新增：绘制快照图片（平移核心） ==========
	drawSnapshot() {
		if (!this.snapshotPath) return;
		const ctx = this.ctx;
		ctx.save();
		// 绘制快照图片，通过snapshotX控制平移位置，Y轴不动
		ctx.drawImage(this.snapshotPath, this.snapshotX, this.snapshotY, this.width, this.height);
		ctx.restore();
		ctx.draw(true);
	}

	// ========== 核心新增：清空整个画布 ==========
	clearAll() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.draw(true);
	}


	// ========== 修改核心：移动树到【右侧】- 原来向左，现在向右 ==========
	async moveTreeForText(targetOffset = 0) {
		if (this.isMoved) return;
		const moveStep = 5; // 每次移动的步长，越小越平滑
		const totalMove = targetOffset; // 要移动的总距离
		// 循环移动，直到到达目标位置
		while (Math.abs(this.snapshotX) < Math.abs(totalMove)) {
			this.clearAll(); // 清空画布
			this.snapshotX += moveStep; // ✅ 向右移动
			this.drawSnapshot(); // 绘制平移后的图片
			await new Promise(resolve => setTimeout(resolve, 16)); // 60帧流畅动画
		}
		// 修正最终位置，防止偏移误差
		this.snapshotX = totalMove;
		this.clearAll();
		this.drawSnapshot();
		this.isMoved = true;
		console.log('树向右平移完成，最终位置：', this.snapshotX);
	}

	// 检查点击是否在种子范围内
	checkClick(x, y) {
		return this.seed.isPointInside(x, y);
	}

	// 开始动画
	startAnimation() {
		this.animationStarted = true;
	}

	// 检查动画是否已开始
	isAnimationStarted() {
		return this.animationStarted;
	}
}

// 树枝
class Branch {
	constructor(tree, point1, point2, point3, radius, length, branchs) {
		this.tree = tree;
		this.point1 = point1;
		this.point2 = point2;
		this.point3 = point3;
		this.radius = radius;
		this.length = length || 100;
		this.len = 0;
		this.t = 1 / (this.length - 1);
		this.branchs = branchs || [];
	}

	// 树枝生长-贝塞尔曲线
	grow() {
		let s = this,p;
		const step = 0.5;
		if (s.len <= s.length) {
			p = new Common().bezier([s.point1, s.point2, s.point3], s.len * s.t);
			s.draw(p);
			s.len += step;
			s.radius *= 0.985;
		} else {
			s.tree.removeBranch(s);
			if (s.branchs && s.branchs.length > 0) {
				s.tree.addBranchs(s.branchs);
			}
		}
	}

	draw(p) {
		let s = this;
		let ctx = s.tree.ctx;
		ctx.save();
		ctx.beginPath();
		ctx.setFillStyle('rgb(35, 31, 32)');
		ctx.arc(p.x, p.y, s.radius, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
}

// 花盛开
class Bloom {
	constructor(tree, point, figure, color, alpha, angle, scale, place, speed) {
		let common = new Common();
		this.tree = tree;
		this.point = point;
		this.color = color || 'rgb(255,' + common.random(0, 255) + ',' + common.random(0, 255) + ')';
		this.alpha = alpha || common.random(0.3, 1);
		this.angle = angle || common.random(0, 360);
		this.scale = scale || 0.1;
		// ========给place加兜底默认值 ========
		this.place = place || new Point(common.random(0, tree.width), common.random(0, tree.height));
		this.speed = speed || common.random(100, 300);
		this.figure = figure;
		// 新增：随机左右摇摆的偏移量，让飘落更自然
		this.xOffset = common.random(-0.5, 0.5);
	}

	flower() {
		let s = this;
		s.draw();
		s.scale += 0.1;
		if (s.scale > 1.2) {
			s.tree.removeBloom(s);
		}
	}

	draw() {
		let s = this,
			ctx = s.tree.ctx,
			figure = s.figure;
		ctx.save();
		ctx.setFillStyle(s.color);
		ctx.setGlobalAlpha(s.alpha);
		ctx.translate(s.point.x, s.point.y);
		ctx.scale(s.scale, s.scale);
		ctx.rotate(s.angle * Math.PI / 180);
		ctx.beginPath();

		// 绘制心形花瓣
		for (let i = 0; i < figure.length; i++) {
			let p = figure.get(i);
			if (i === 0) {
				ctx.moveTo(p.x, -p.y);
			} else {
				ctx.lineTo(p.x, -p.y);
			}
		}

		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	// 花掉落
	jump() {
		let s = this,
			height = s.tree.height;
		// 1. 花瓣超出画布立即移除，避免残留
		if (s.point.x < -20 || s.point.y > height + 20) {
			s.tree.removeBloom(s);
		} else {
			if (s.place && s.point && s.place.x === s.point.x && s.place.y === s.point.y) {
				console.log("place和point相同，直接移除花瓣", s.point);
				s.tree.removeBloom(s);
				return;
			}
			// console.log("jump-else1==",s.place.x,s.place.y,s.point.x,s.point.y,s.tree.width,s.tree.height,s.speed)
			s.draw();
			s.point = s.place.sub(s.point).div(s.speed).add(s.point);
			s.angle += 0.06;
			s.speed = Math.max(1, s.speed - 1);
		}
	}


}




export {
	Tree,
	Point,
	Common,
}