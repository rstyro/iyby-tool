// 方法重复提交
export class OnceExecutor {
	constructor() {
		this.executionMap = new Map();
	}

	/**
	 * 同步方法装饰器（自动缓存结果）
	 * @param {string} methodId 唯一方法标识
	 * @param {Function} fn 目标方法 
	 * @returns {Function} 包装后的方法
	 */
	wrapSync(methodId, fn) {
		if (typeof fn !== 'function') {
			throw new Error('必须传入函数类型');
		}

		const executor = this;
		return function(...args) {
			const record = executor._getRecord(methodId);

			// 已生成直接返回结果
			if (record.generated) return record.result;
			console.log(`[${methodId}] 开始执行，参数:`, args);
			try {
				// 同步执行并缓存结果
				record.result = fn.apply(this, args);
				record.generated = true;
				return record.result;
			} catch (error) {
				// 异常时重置状态
				record.generated = false;
				throw error;
			}
		};
	}

	/**
	 * 异步方法装饰器（自动Promise复用）
	 * @param {string} methodId 唯一方法标识
	 * @param {Function} fn 目标异步方法
	 * @returns {Function} 包装后的异步方法
	 */
	wrapAsync(methodId, fn) {
		if (typeof fn !== 'function') {
			throw new Error('必须传入函数类型');
		}

		const executor = this;
		return async function(...args) {
			const record = executor._getRecord(methodId);

			// 已有缓存结果
			if (record.generated) {
				console.log(`[${methodId}] 使用缓存`);
				return record.result;
			}

			// 正在执行中，返回同一个Promise
			console.log(`[${methodId}] 正在执行中，返回同一个Promise`);
			if (record.promise) {
				return record.promise;
			}

			// 创建新Promise
			record.promise = (async () => {
				try {
					console.log(`[${methodId}] 开始执行，参数:`, args);
					const result = await fn.apply(this, args);
					record.result = result; // 缓存结果
					record.generated = true; // 标记已生成
					return result;
				} catch (error) {
					console.error(`[${methodId}] 执行失败:`, error);
					record.promise = null; // 失败时允许重试
					throw error;
				}
			})();

			return record.promise;
		};
	}

	// 重置状态（支持批量）
	reset(methodIds = []) {
		if (methodIds.length === 0) {
			// 打印所有 key 并清空 executionMap
			const keys = Array.from(this.executionMap.keys());
			console.log("清除所有缓存，当前缓存的 key 列表:", keys);
			this.executionMap.clear();
			return;
		}
		console.log("清除缓存需要删除的 key 列表:", methodIds);
		methodIds.forEach(id => {
			this.executionMap.delete(id);
		});
	}

	// 私有方法：获取执行记录
	_getRecord(methodId) {
		if (!this.executionMap.has(methodId)) {
			this.executionMap.set(methodId, {
				generated: false,
				result: null,
				promise: null
			});
		}
		return this.executionMap.get(methodId);
	}
}