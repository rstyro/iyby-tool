/**
 * 文件名：LoveTree.js
 * 优化版 - 修复环境检测和Image构造函数问题
 */

// 用WeakMap存储 Seed实例 -> Tree实例 的映射关系，解除循环引用
const seedTreeMap = new WeakMap();
const branchTreeMap = new WeakMap();

// 更准确的环境检测
const isWeChatMiniProgram = typeof wx !== 'undefined' && wx.createCanvasContext && !(typeof window !== 'undefined' &&
	window.document);
const isH5 = typeof window !== 'undefined' &&
	window &&
	window.document &&
	typeof window.document.createElement === 'function';

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

		seedTreeMap.set(this, tree);
		this.currentGraphic = 'heart';
	}

	getTree() {
		return seedTreeMap.get(this);
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
		let ctx = this.getTree().ctx,
			heart = this.heart;
		let point = heart.point,
			color = heart.color,
			scale = heart.scale;

		ctx.save();
		ctx.setFillStyle(color);
		ctx.translate(point.x, point.y);
		ctx.beginPath();

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
	}

	drawCircle() {
		let ctx = this.getTree().ctx,
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
	}

	drawText() {
		let ctx = this.getTree().ctx,
			heart = this.heart;
		let point = heart.point,
			color = heart.color,
			scale = heart.scale;

		ctx.save();
		ctx.setStrokeStyle(color);
		ctx.setFillStyle(color);
		ctx.translate(point.x, point.y);
		ctx.scale(scale, scale);

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(15, 15);
		ctx.lineTo(40, 15);
		ctx.stroke();

		ctx.setFontSize(12);
		ctx.fillText("戳我", 23, 16);
		ctx.restore();
	}

	clear() {
		let ctx = this.getTree().ctx,
			circle = this.circle;
		let point = circle.point,
			scale = circle.scale,
			radius = 26;
		let w = (radius * scale);
		let h = (radius * scale);
		ctx.clearRect(point.x - w, point.y - h, 4 * w, 4 * h);
	}

	isPointInside(x, y) {
		let point, radius;

		if (this.currentGraphic === 'heart') {
			point = this.heart.point;
			radius = 30 * this.heart.scale;
		} else {
			point = this.circle.point;
			radius = this.circle.radius * this.circle.scale;
		}

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

		ctx.draw(true);
	}
}

class Tree {
	constructor(ctx, width, height, opt) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.opt = opt || {};

		// 环境标识
		this.isWeChatMiniProgram = isWeChatMiniProgram;
		this.isH5 = isH5;

		console.log('Tree初始化，环境:', this.isWeChatMiniProgram ? '小程序' : (this.isH5 ? 'H5' : '其他'));

		this.record = {};
		this.r = height * 0.4;

		// 精灵图相关（仅小程序使用）
		this.spriteImage = null;
		this.spriteLoaded = false;
		this.spriteWidth = 40;
		this.spriteHeight = 40;

		// 仅在微信小程序环境预加载精灵图
		if (this.isWeChatMiniProgram) {
			this.loadSpriteImageForMiniProgram();
		}

		this.initSeed();
		this.initFooter();
		this.initBranch();
		this.initBloom();

		this.animationStarted = false;
		this.snapshotPath = '';
		this.snapshotX = 0;
		this.snapshotY = 0;
		this.isMoved = false;
		this.heartPathCache = [];
		this.ctx.save();
	}

	// 微信小程序专用：加载心形精灵图
	loadSpriteImageForMiniProgram() {
		const _this = this;

		// 创建简单的心形图片base64（非常小的红色心形）
		// 这里使用一个更小的base64图片来避免加载问题
		const spriteBase64 =
			'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDM2LjY2NjdDMzAgMzAgMzUuNSAyMi4zMzMzIDM1LjUgMTYuNjY2N0MzNS41IDEyLjMzMzMgMzEuNjY2NyA4LjUgMjcuMzMzMyA4LjVDMjUgOC41IDIyLjgzMzMgOS41IDIxLjE2NjcgMTEuMTY2N0MyMC42NjY3IDExLjY2NjcgMjAuMzMzMyAxMi4xNjY3IDIwIDEyLjY2NjdDMTkuNjY2NyAxMi4xNjY3IDE5LjMzMzMgMTEuNjY2NyAxOC44MzMzIDExLjE2NjdDMTcuMTY2NyA5LjUgMTUgOC41IDEyLjY2NjcgOC41QzguMzMzMzMgOC41IDQuNSAxMi4zMzMzIDQuNSAxNi42NjY3QzQuNSAyMi4zMzMzIDEwIDMwIDIwIDM2LjY2NjdaIiBmaWxsPSIjRUY0MDJGIiBmaWxsLW9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4=';

		// 微信小程序环境使用wx.createImage
		if (typeof wx !== 'undefined' && wx.createImage) {
			try {
				const wxImg = wx.createImage();
				wxImg.src = spriteBase64;
				wxImg.onload = function() {
					_this.spriteImage = wxImg;
					_this.spriteLoaded = true;
					console.log('心形精灵图加载成功(小程序)');
				};
				wxImg.onerror = function(e) {
					console.error('心形精灵图加载失败(小程序):', e);
					_this.spriteLoaded = false;
				};
			} catch (error) {
				console.error('创建图片对象失败:', error);
				this.spriteLoaded = false;
			}
		} else {
			console.warn('当前环境不支持wx.createImage');
			this.spriteLoaded = false;
		}
	}

	initSeed() {
		let seed = this.opt.seed || {};
		let x = seed.x || this.width / 2;
		let y = seed.y || this.height / 2 - this.height * 0.1;
		let point = new Point(x, y);
		let color = seed.color || '#FF0000';
		let baseScale = Math.min(this.width, this.height) / 700;
		let scale = (seed.scale || 1) * baseScale;

		this.seed = new Seed(this, point, scale, color);
	}

	initFooter() {
		let footer = this.opt.footer || {};
		let width = footer.width || this.width * 1.5;
		let height = footer.height || Math.max(5, this.height * 0.007);
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
			// 小程序环境下减少花朵数量以提升性能
			num = bloom.num || (this.isWeChatMiniProgram ?
				Math.floor(this.width * this.height / 600) : // 小程序进一步减少数量
				Math.floor(this.width * this.height / 300)), // H5保持原数量
			width = bloom.width || this.width,
			height = bloom.height || this.height,
			figure = this.seed.heart.figure;

		console.log(`生成花朵数量: ${num} (${this.isWeChatMiniProgram ? '小程序' : 'H5'})`);
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

			const scaleX = (this.width / 1100) * 1;
			const scaleY = (this.height / 680) * 1;

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
			if (common.inheart(x - width / 2, height - (height - 40) / 2 - y, radius)) {
				return new Bloom(this, new Point(x, y), figure, color, alpha, angle, scale, place, speed);
			}
		}
	}

	canFlower() {
		return !!this.blooms.length;
	}

	// 优化花朵动画
	flower(num) {
		let s = this;
		s.ctx.save();

		// 根据环境调整每次开放的花朵数量
		const batchSize = this.isWeChatMiniProgram ?
			Math.min(num, s.bloomsCache.length) : // 小程序减少批次
			Math.min(num * 2, s.bloomsCache.length); // H5保持原逻辑

		let blooms = s.bloomsCache.splice(0, batchSize);
		for (let i = 0; i < blooms.length; i++) {
			s.addBloom(blooms[i]);
		}

		blooms = s.blooms;
		for (let j = 0; j < blooms.length; j++) {
			blooms[j].flower();
		}
		s.ctx.restore();

		this.ctx.draw(true);
	}

	jump() {
		let s = this,
			blooms = s.blooms;
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
			let r = this.height * 0.4;
			const common = new Common();
			for (let i = 0; i < common.random(1, 2); i++) {
				let createBloom = this.createBloom(width / 2 + width, height, r, figure, null, 1, null, 1,
					new Point(common.random(-100, 600), height), common.random(200, 300));
				blooms.push(createBloom);
			}
		}
	}

	createCanvasSnapshot() {
		const _this = this;
		return new Promise((resolve, reject) => {
			_this.ctx.draw(true, () => {
				uni.canvasToTempFilePath({
					canvasId: 'loveTreeCanvas',
					width: _this.width,
					height: _this.height,
					destWidth: _this.width,
					destHeight: _this.height,
					quality: 1,
					success: (res) => {
						_this.snapshotPath = res.tempFilePath;
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

	drawSnapshot() {
		if (!this.snapshotPath) return;
		const ctx = this.ctx;
		ctx.save();
		ctx.drawImage(this.snapshotPath, this.snapshotX, this.snapshotY, this.width, this.height);
		ctx.restore();
		ctx.draw(true);
	}

	clearAll() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.draw(true);
	}

	async moveTreeForText(targetOffset = 0) {
		if (this.isMoved) return;
		const moveStep = 5;
		const totalMove = targetOffset;
		while (Math.abs(this.snapshotX) < Math.abs(totalMove)) {
			this.clearAll();
			this.snapshotX += moveStep;
			this.drawSnapshot();
			await new Promise(resolve => setTimeout(resolve, 16));
		}
		this.snapshotX = totalMove;
		this.clearAll();
		this.drawSnapshot();
		this.isMoved = true;
	}

	checkClick(x, y) {
		return this.seed.isPointInside(x, y);
	}

	startAnimation() {
		this.animationStarted = true;
	}

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

		branchTreeMap.set(this, tree);
	}

	getTree() {
		return branchTreeMap.get(this);
	}

	grow() {
		let s = this,
			p;
		const step = 0.5;
		if (s.len <= s.length) {
			p = new Common().bezier([s.point1, s.point2, s.point3], s.len * s.t);
			s.draw(p);
			s.len += step;
			s.radius *= 0.985;
		} else {
			this.getTree().removeBranch(s);
			if (s.branchs && s.branchs.length > 0) {
				this.getTree().addBranchs(s.branchs);
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

// 花盛开 - 优化版：小程序使用精灵图，H5使用路径
class Bloom {
	constructor(tree, point, figure, color, alpha, angle, scale, place, speed) {
		let common = new Common();
		this.tree = tree;
		this.point = point;

		// 生成随机颜色
		if (color) {
			this.color = color;
		} else {
			// 小程序环境使用固定颜色（精灵图是固定的）
			if (tree.isWeChatMiniProgram) {
				this.color = '#FF0000'; // 红色，与精灵图颜色一致
			} else {
				// H5环境使用随机颜色
				this.color = 'rgb(255,' + common.random(0, 255) + ',' + common.random(0, 255) + ')';
			}
		}

		this.alpha = alpha || common.random(0.3, 1);
		this.angle = angle || common.random(0, 360);
		if (this.tree.isWeChatMiniProgram) {
			this.scale = scale || 0.1;
		}else{
			this.scale = scale || 0.1;
		}
		this.place = place || new Point(common.random(0, tree.width), common.random(0, tree.height));
		this.speed = speed || common.random(100, 300);
		this.figure = figure;
		this.xOffset = common.random(-0.5, 0.5);
	}

	flower() {
		let s = this;
		s.draw();
		if (this.tree.isWeChatMiniProgram) {
			s.scale += 0.2;
		}
		s.scale += 0.1;
		if (s.scale > 1) {
			s.tree.removeBloom(s);
		}
	}

	// 统一的draw方法
	draw() {
		// 小程序环境且精灵图已加载，则使用精灵图
		if (this.tree.isWeChatMiniProgram && this.tree.spriteLoaded && this.tree.spriteImage) {
			this.drawWithSprite();
		} else {
			// 其他情况（包括H5和小程序精灵图未加载）使用路径绘制
			this.drawWithPath();
		}
	}

	// H5环境：使用路径绘制
	drawWithPath() {
		let ctx = this.tree.ctx;
		ctx.save();
		ctx.setGlobalAlpha(this.alpha);
		ctx.translate(this.point.x, this.point.y);
		ctx.scale(this.scale, this.scale);
		ctx.rotate(this.angle * Math.PI / 180);

		// 使用全局路径缓存
		if (!Heart.prototype.pathCache) {
			Heart.prototype.pathCache = [];
			const points = this.figure.points;
			for (let i = 0; i < points.length; i++) {
				Heart.prototype.pathCache.push({
					x: points[i].x,
					y: points[i].y
				});
			}
		}

		ctx.beginPath();
		Heart.prototype.pathCache.forEach((p, i) => {
			i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
		});

		ctx.closePath();
		ctx.setFillStyle(this.color);
		ctx.fill();
		ctx.restore();
	}

	// 小程序环境：使用精灵图绘制
	drawWithSprite() {
		if (!this.tree.spriteImage) {
			// 精灵图未加载，降级为路径绘制
			this.drawWithPath();
			return;
		}

		let ctx = this.tree.ctx;
		ctx.save();
		ctx.setGlobalAlpha(this.alpha);
		ctx.translate(this.point.x, this.point.y);
		ctx.rotate(this.angle * Math.PI / 180);

		// 计算绘制尺寸
		const drawWidth = this.tree.spriteWidth * this.scale;
		const drawHeight = this.tree.spriteHeight * this.scale;

		try {
			// 绘制精灵图（居中绘制）
			ctx.drawImage(
				this.tree.spriteImage,
				0, 0,
				this.tree.spriteWidth, this.tree.spriteHeight,
				-drawWidth / 2, -drawHeight / 2,
				drawWidth, drawHeight
			);
		} catch (e) {
			// 精灵图绘制失败，降级为简单圆形
			console.warn('精灵图绘制失败，降级为圆形', e);
			ctx.beginPath();
			ctx.setFillStyle(this.color);
			ctx.arc(0, 0, 5 * this.scale, 0, 2 * Math.PI);
			ctx.fill();
		}

		ctx.restore();
	}

	// 花掉落
	jump() {
		let s = this,
			height = s.tree.height;
		if (s.point.x < -20 || s.point.y > height + 20) {
			s.tree.removeBloom(s);
		} else {
			if (s.place && s.point && s.place.x === s.point.x && s.place.y === s.point.y) {
				s.tree.removeBloom(s);
				return;
			}
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