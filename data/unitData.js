export const allUnits = {
	// 长度单位
	length: [{
			label: '千米 (km)',
			value: 'km',
			factor: 1
		},
		{
			label: '米 (m)',
			value: 'm',
			factor: 0.001
		},
		{
			label: '皮米 (pm)',
			value: 'pm',
			factor: 1e-15
		},
		{
			label: '纳米 (nm)',
			value: 'nm',
			factor: 1e-12
		},
		{
			label: '微米 (μm)',
			value: 'um',
			factor: 1e-9
		},
		{
			label: '厘米 (cm)',
			value: 'cm',
			factor: 0.00001
		},
		{
			label: '毫米 (mm)',
			value: 'mm',
			factor: 0.000001
		},
		{
			label: '光年 (ly)',
			value: 'ly',
			factor: 9460730000
		},
		{
			label: '英寸 (in)',
			value: 'in',
			factor: 0.0000254
		},
		{
			label: '英尺 (ft)',
			value: 'ft',
			factor: 0.0003048
		},
		{
			label: '码 (yd)',
			value: 'yd',
			factor: 0.0009144
		},
		{
			label: '英里 (mi)',
			value: 'mi',
			factor: 1.60934
		},
		{
			label: '海里 (nmi)',
			value: 'nmi',
			factor: 1.852
		},
		{
			label: '里 (市里)',
			value: 'li',
			factor: 0.5
		},
		{
			label: '丈 (市丈)',
			value: 'zhang',
			factor: 1 / 300
		}, // 约 0.003333333
		{
			label: '尺 (市尺)',
			value: 'chi',
			factor: 1 / 3000
		}, // 约 0.000333333
		{
			label: '寸 (市寸)',
			value: 'cun',
			factor: 1 / 30000
		}, // 约 0.000033333
		{
			label: '分 (市分)',
			value: 'fen',
			factor: 1 / 300000
		}
	],
	// 面积单位
	area: [
		// 公制单位
		{
			label: '平方千米 (km²)',
			value: 'km2',
			factor: 1000000
		},
		{
			label: '公顷 (ha)',
			value: 'ha',
			factor: 10000
		},
		{
			label: '公亩 (a)',
			value: 'a',
			factor: 100
		},
		{
			label: '平方米 (m²)',
			value: 'm2',
			factor: 1
		},
		{
			label: '平方分米 (dm²)',
			value: 'dm2',
			factor: 0.01
		},
		{
			label: '平方厘米 (cm²)',
			value: 'cm2',
			factor: 0.0001
		},
		{
			label: '平方毫米 (mm²)',
			value: 'mm2',
			factor: 0.000001
		},

		// 英制单位
		{
			label: '平方英里 (mi²)',
			value: 'mi2',
			factor: 2589988.11
		},
		{
			label: '英亩 (acre)',
			value: 'acre',
			factor: 4046.85642
		},
		{
			label: '鲁德 (rood)',
			value: 'rood',
			factor: 1011.714
		},
		{
			label: '平方码 (yd²)',
			value: 'yd2',
			factor: 0.836127
		},
		{
			label: '平方英尺 (ft²)',
			value: 'ft2',
			factor: 0.092903
		},
		{
			label: '平方英寸 (in²)',
			value: 'in2',
			factor: 0.00064516
		},

		// 市制单位
		{
			label: '顷',
			value: 'qing',
			factor: 66666.6667
		},
		{
			label: '亩',
			value: 'mu',
			factor: 666.666667
		},
		{
			label: '分',
			value: 'fen',
			factor: 66.6666667
		},
		{
			label: '厘',
			value: 'li',
			factor: 6.66666667
		},
		{
			label: '平方丈',
			value: 'sq_zhang',
			factor: 11.1111111
		},
		{
			label: '平方尺',
			value: 'sq_chi',
			factor: 0.111111111
		},
		{
			label: '平方寸',
			value: 'sq_cun',
			factor: 0.00111111111
		},
	],
	volume: [
		// 公制单位
		{
			label: '立方千米 (km³)',
			value: 'km3',
			factor: 1000000000
		},
		{
			label: '立方米 (m³)',
			value: 'm3',
			factor: 1
		},
		{
			label: '立方分米 (dm³)',
			value: 'dm3',
			factor: 0.001
		},
		{
			label: '升 (L)',
			value: 'L',
			factor: 0.001
		},
		{
			label: '分升 (dL)',
			value: 'dL',
			factor: 0.0001
		},
		{
			label: '厘升 (cL)',
			value: 'cL',
			factor: 0.00001
		},
		{
			label: '毫升 (mL)',
			value: 'mL',
			factor: 0.000001
		},
		{
			label: '立方厘米 (cm³)',
			value: 'cm3',
			factor: 0.000001
		},
		{
			label: '立方毫米 (mm³)',
			value: 'mm3',
			factor: 0.000000001
		},
		{
			label: '微升 (μL)',
			value: 'μL',
			factor: 0.000000001
		},

		// 英制单位
		{
			label: '立方码 (yd³)',
			value: 'yd3',
			factor: 0.764555
		},
		{
			label: '立方英尺 (ft³)',
			value: 'ft3',
			factor: 0.0283168
		},
		{
			label: '立方英寸 (in³)',
			value: 'in3',
			factor: 0.000016387
		},
		{
			label: '英制加仑 (imp gal)',
			value: 'imp_gal',
			factor: 0.00454609
		},
		{
			label: '英制夸脱 (imp qt)',
			value: 'imp_qt',
			factor: 0.0011365225
		},
		{
			label: '英制品脱 (imp pt)',
			value: 'imp_pt',
			factor: 0.00056826125
		},
		{
			label: '英制液盎司 (imp fl oz)',
			value: 'imp_floz',
			factor: 0.0000284130625
		},
		{
			label: '美制加仑 (gal)',
			value: 'us_gal',
			factor: 0.00378541
		},
		{
			label: '美制夸脱 (us qt)',
			value: 'us_qt',
			factor: 0.0009463525
		},
		{
			label: '美制品脱 (us pt)',
			value: 'us_pt',
			factor: 0.00047317625
		},
		{
			label: '美制液盎司 (us fl oz)',
			value: 'us_floz',
			factor: 0.00002957353
		},
		{
			label: '桶 (barrel)',
			value: 'bbl',
			factor: 0.158987294928
		}, // 石油桶

		// 市制单位
		{
			label: '石 (市石)',
			value: 'shi',
			factor: 0.1
		}, // 1石=100升=0.1m³
		{
			label: '斗 (市斗)',
			value: 'dou',
			factor: 0.01
		}, // 1斗=10升=0.01m³
		{
			label: '升 (市升)',
			value: 'sheng',
			factor: 0.001
		}, // 1市升=1公升
		{
			label: '合 (市合)',
			value: 'ge',
			factor: 0.0001
		}, // 1合=0.1升=0.0001m³
		{
			label: '勺 (市勺)',
			value: 'shao',
			factor: 0.00001
		}, // 1勺=0.01升=0.00001m³
		{
			label: '撮 (市撮)',
			value: 'cuo',
			factor: 0.000001
		} // 1撮=0.001升=0.000001m³
	],
	// 质量单位

	mass: [
		// 公制单位
		{
			label: '吨 (t)',
			value: 't',
			factor: 1000000
		},
		{
			label: '千克 (kg)',
			value: 'kg',
			factor: 1000
		},
		{
			label: '克 (g)',
			value: 'g',
			factor: 1
		},
		{
			label: '毫克 (mg)',
			value: 'mg',
			factor: 0.001
		},
		{
			label: '微克 (μg)',
			value: 'μg',
			factor: 0.000001
		},
		{
			label: '克拉 (ct)',
			value: 'ct',
			factor: 0.2
		},

		// 英制单位
		{
			label: '长吨 (LT)',
			value: 'long_ton',
			factor: 1016046.91
		},
		{
			label: '短吨 (ST)',
			value: 'short_ton',
			factor: 907184.74
		},
		{
			label: '英石 (st)',
			value: 'st',
			factor: 6350.288
		},
		{
			label: '磅 (lb)',
			value: 'lb',
			factor: 453.592
		},
		{
			label: '盎司 (oz)',
			value: 'oz',
			factor: 28.3495
		},
		{
			label: '打兰 (dr)',
			value: 'dr',
			factor: 1.77184375
		},
		{
			label: '格令 (gr)',
			value: 'gr',
			factor: 0.064798857
		},

		// 市制单位
		{
			label: '担',
			value: 'dan',
			factor: 50000
		},
		{
			label: '斤',
			value: 'jin',
			factor: 500
		},
		{
			label: '两',
			value: 'liang',
			factor: 50
		},
		{
			label: '钱',
			value: 'qian',
			factor: 5
		},
		{
			label: '分',
			value: 'fen',
			factor: 0.5
		},
		{
			label: '厘',
			value: 'li',
			factor: 0.05
		},

		// 特殊单位
		{
			label: '金衡盎司 (oz t)',
			value: 'oz_t',
			factor: 31.1034768
		},
		{
			label: '药衡盎司 (℥)',
			value: 'oz_ap',
			factor: 31.1034768
		}
	],
	// 温度单位（特殊处理）[1,5](@ref)
	temperature: [
		// 公制单位
		{
			label: '摄氏度 (°C)',
			value: 'c',
			factor: 0
		},
		{
			label: '开尔文 (K)',
			value: 'k',
			factor: 0
		},

		// 英制单位
		{
			label: '华氏度 (°F)',
			value: 'f',
			factor: 0
		},
		{
			label: '兰氏度 (°R)',
			value: 'r',
			factor: 0
		},

		// 历史/特殊单位
		{
			label: '列氏度 (°Ré)',
			value: 're',
			factor: 0
		},
		{
			label: '德莱尔度 (°D)',
			value: 'd',
			factor: 0
		},
		{
			label: '牛顿温标 (°N)',
			value: 'n',
			factor: 0
		},
		{
			label: '罗默度 (°Rø)',
			value: 'ro',
			factor: 0
		}
	],

	// 时间单位
	time: [
		// 标准时间单位
		{
			label: '秒 (s)',
			value: 's',
			factor: 1
		},
		{
			label: '毫秒 (ms)',
			value: 'ms',
			factor: 0.001
		},
		{
			label: '微秒 (μs)',
			value: 'us',
			factor: 1e-6
		},
		{
			label: '纳秒 (ns)',
			value: 'ns',
			factor: 1e-9
		},

		// 分钟级单位
		{
			label: '分钟 (min)',
			value: 'min',
			factor: 60
		},
		{
			label: '刻',
			value: 'ke',
			factor: 900
		}, // 中国传统时间单位，1刻=15分钟

		// 小时级单位
		{
			label: '小时 (h)',
			value: 'h',
			factor: 3600
		},
		{
			label: '时辰',
			value: 'chen',
			factor: 7200
		}, // 中国传统单位，1时辰=2小时

		// 日级单位
		{
			label: '天 (d)',
			value: 'd',
			factor: 86400
		},
		{
			label: '太阳日',
			value: 'sol',
			factor: 88775.244
		}, // 火星日

		// 周月级单位
		{
			label: '周 (wk)',
			value: 'wk',
			factor: 604800
		},

		// 年级单位
		{
			label: '年 (y)',
			value: 'year',
			factor: 31536000
		}, // 格里高利年365.2425天
		{
			label: '恒星年',
			value: 'sidereal_year',
			factor: 31558149.5
		}, // 地球真实公转周期
		{
			label: '回归年',
			value: 'tropical_year',
			factor: 31556925.2
		}, // 太阳周期年

		// 超长期单位
		{
			label: '年代',
			value: 'decade',
			factor: 315360000
		}, // 10年
		{
			label: '世纪',
			value: 'century',
			factor: 3153600000
		}, // 100年
		{
			label: '千禧年',
			value: 'millennium',
			factor: 31536000000
		}, // 1000年

		// 特殊时间单位
		{
			label: '普朗克时间',
			value: 'planck_time',
			factor: 5.391e-44
		},
		{
			label: '原子时间单位',
			value: 'au_time',
			factor: 2.41888e-17
		}
	],
	speed: [
		// 公制单位
		{
			label: '米/秒 (m/s)',
			value: 'mps',
			factor: 1
		},
		{
			label: '毫米/秒 (mm/s)',
			value: 'mmps',
			factor: 0.001
		},
		{
			label: '厘米/秒 (cm/s)',
			value: 'cmps',
			factor: 0.01
		},
		{
			label: '千米/时 (km/h)',
			value: 'kmph',
			factor: 0.277778
		}, // 1km/h = 0.2778m/s
		{
			label: '公里/秒 (km/s)',
			value: 'kmps',
			factor: 1000
		},

		// 英制单位
		{
			label: '英寸/秒 (in/s)',
			value: 'ips',
			factor: 0.0254
		},
		{
			label: '英尺/秒 (ft/s)',
			value: 'fps',
			factor: 0.3048
		},
		{
			label: '码/秒 (yd/s)',
			value: 'yps',
			factor: 0.9144
		},
		{
			label: '英里/时 (mph)',
			value: 'mph',
			factor: 0.44704
		}, // 1mph ≈ 0.447m/s
		{
			label: '英里/秒 (mi/s)',
			value: 'mips',
			factor: 1609.344
		},

		// 市制单位
		{
			label: '尺/秒 (ft/s)',
			value: 'fts',
			factor: 1 / 3.3
		}, // 1尺≈0.303m
		{
			label: '里/时 (里/h)',
			value: 'lih',
			factor: 500 / 3600
		}, // 1里=500米

		// 特殊单位
		{
			label: '节 (kn)',
			value: 'knot',
			factor: 0.514444
		}, // 1节=1.852km/h
		{
			label: '马赫 (Ma)',
			value: 'mach',
			factor: 343
		}, // 声速≈343m/s
		{
			label: '光速 (c)',
			value: 'light',
			factor: 299792458
		}
	],
	// 角度单位[5](@ref)
	angle: [
		// 基本角度单位
		{
			label: '度 (°)',
			value: 'deg',
			factor: 1
		},
		{
			label: '弧度 (rad)',
			value: 'rad',
			factor: 57.2957795
		}, // 精确换算因子
		{
			label: '秒 (")',
			value: 'sec_angle',
			factor: 1 / 3600
		}, // 精确值
		{
			label: '圈 (turn)',
			value: 'turn',
			factor: 360
		}, // 1圈=360°
		{
			label: '分 (\')',
			value: 'min_angle',
			factor: 1 / 60
		}, // 精确值

		// 工程与测量单位
		{
			label: '百分度 (gon)',
			value: 'gon',
			factor: 0.9
		}, // 1gon=0.9°
		{
			label: '密位 (NATO mil)',
			value: 'mil',
			factor: 0.05625
		}, // 北约标准 6400密位=360°
		{
			label: '直角',
			value: 'right_angle',
			factor: 90
		}, // 90°

		// 特殊单位
		{
			label: '时角 (h)',
			value: 'hour_angle',
			factor: 15
		}, // 1小时=15°
		{
			label: '点 (compass point)',
			value: 'point',
			factor: 11.25
		} // 1罗盘点=11.25°
	],
	// 电流单位（国际单位制）
	current: [
		// 公制单位（标准前缀）
		{
			label: '安培 (A)',
			value: 'A',
			factor: 1
		},
		{
			label: '毫安 (mA)',
			value: 'mA',
			factor: 0.001
		},
		{
			label: '皮安 (pA)',
			value: 'pA',
			factor: 1e-12
		},
		{
			label: '纳安 (nA)',
			value: 'nA',
			factor: 1e-9
		},
		{
			label: '微安 (μA)',
			value: 'uA',
			factor: 1e-6
		},
		{
			label: '千安 (kA)',
			value: 'kA',
			factor: 1000
		},
		{
			label: '兆安 (MA)',
			value: 'MA',
			factor: 1e6
		},

		// 电磁单位
		{
			label: '静电安培 (statA)',
			value: 'statA',
			factor: 3.3356e-10
		}, // CGS单位
		{
			label: '绝对安培 (abA)',
			value: 'abA',
			factor: 10
		} // CGS电磁单位
	],

	// 电压单位（国际单位制）
	voltage: [
		// 公制单位（标准前缀）
		{
			label: '伏特 (V)',
			value: 'V',
			factor: 1
		},
		{
			label: '千伏 (kV)',
			value: 'kV',
			factor: 1000
		},
		{
			label: '皮伏 (pV)',
			value: 'pV',
			factor: 1e-12
		},
		{
			label: '纳伏 (nV)',
			value: 'nV',
			factor: 1e-9
		},
		{
			label: '微伏 (μV)',
			value: 'uV',
			factor: 1e-6
		},
		{
			label: '毫伏 (mV)',
			value: 'mV',
			factor: 0.001
		},
		{
			label: '兆伏 (MV)',
			value: 'MV',
			factor: 1e6
		},

		// 电磁单位
		{
			label: '静伏 (statV)',
			value: 'statV',
			factor: 299.792458
		}, // CGS静电单位
		{
			label: '绝对伏特 (abV)',
			value: 'abV',
			factor: 1e-8
		}, // CGS电磁单位

		// 特殊单位
		{
			label: '电子伏特 (eV)',
			value: 'eV',
			factor: 1.602176634e-19
		} // 粒子物理单位
	],
	// 功率单位（补充能量单位）
	power: [{
			label: '瓦特 (W)',
			value: 'W',
			factor: 1
		},
		{
			label: '千瓦 (kW)',
			value: 'kW',
			factor: 1000
		},
		{
			label: '皮瓦 (pW)',
			value: 'pW',
			factor: 1e-12
		},
		{
			label: '纳瓦 (nW)',
			value: 'nW',
			factor: 1e-9
		},
		{
			label: '微瓦 (μW)',
			value: 'uW',
			factor: 1e-6
		},
		{
			label: '毫瓦 (mW)',
			value: 'mW',
			factor: 0.001
		},
		{
			label: '兆瓦 (MW)',
			value: 'MW',
			factor: 1e6
		},
		{
			label: '吉瓦 (GW)',
			value: 'GW',
			factor: 1e9
		},
		// 英制单位
		{
			label: '英尺磅/秒 (ft·lb/s)',
			value: 'ft_lb_s',
			factor: 1.35582
		},
		{
			label: '英制马力 (hp UK)',
			value: 'hp_uk',
			factor: 745.7
		}, // 原有公制马力
		{
			label: '英热单位/时 (BTU/h)',
			value: 'btu_hr',
			factor: 0.293071
		} // 常用供暖功率单位
	],

	data: [{
			label: '兆字节 (MB)',
			value: 'MB',
			factor: 1048576
		},
		{
			label: '千字节 (KB)',
			value: 'KB',
			factor: 1024
		},
		{
			label: '比特 (b)',
			value: 'b',
			factor: 0.125
		},
		{
			label: '字节 (B)',
			value: 'B',
			factor: 1
		},
		{
			label: '千兆字节 (GB)',
			value: 'GB',
			factor: 1073741824
		},
		{
			label: '太字节 (TB)',
			value: 'TB',
			factor: 1099511627776
		},
		{
			label: '拍字节 (PB)',
			value: 'PB',
			factor: Math.pow(1024, 5)
		},
		{
			label: '艾字节 (EB)',
			value: 'EB',
			factor: Math.pow(1024, 6)
		},
		{
			label: '泽字节 (ZB)',
			value: 'ZB',
			factor: Math.pow(1024, 7)
		},
		{
			label: '尧字节 (YB)',
			value: 'YB',
			factor: Math.pow(1024, 8)
		}
	],

	// 质量浓度与摩尔浓度的转换需要溶质分子量参数，此处的转换因子基于典型值。
	concentration: [
		// 摩尔浓度（公制）
		{
			label: '摩尔/升 (mol/L)',
			value: 'mol/L',
			factor: 1
		},
		{
			label: '毫摩尔/升 (mmol/L)',
			value: 'mmol/L',
			factor: 0.001
		},
		{
			label: '微摩尔/升 (μmol/L)',
			value: 'umol/L',
			factor: 1e-6
		},
		{
			label: '纳摩尔/升 (nmol/L)',
			value: 'nmol/L',
			factor: 1e-9
		},
		{
			label: '皮摩尔/升 (pmol/L)',
			value: 'pmol/L',
			factor: 1e-12
		},

		// 质量浓度
		{
			label: '克/升 (g/L)',
			value: 'g/L',
			factor: 1 / 0.001
		}, // 假设分子量为100g/mol
		{
			label: '毫克/升 (mg/L)',
			value: 'mg/L',
			factor: 1e-6
		},
		{
			label: '微克/升 (μg/L)',
			value: 'ug/L',
			factor: 1e-9
		},

		// 百分比浓度
		{
			label: '百分比 (质量/质量%)',
			value: 'wt_percent',
			factor: 10
		}, // 1%=10g/L(近似)
		{
			label: '百分比 (体积/体积%)',
			value: 'vol_percent',
			factor: 10
		},

		// 英制浓度单位
		{
			label: '磅/美加仑 (lb/US gal)',
			value: 'lb_gal_us',
			factor: 119.826
		}, // 约120 g/L
		{
			label: '磅/英加仑 (lb/imp gal)',
			value: 'lb_gal_imp',
			factor: 99.776
		}, // 约100 g/L

		// 特殊浓度单位
		{
			label: '百万分率 (ppm)',
			value: 'ppm',
			factor: 0.001
		}, // mg/L
		{
			label: '十亿分率 (ppb)',
			value: 'ppb',
			factor: 1e-6
		}, // μg/L
		{
			label: '万亿分率 (ppt)',
			value: 'ppt',
			factor: 1e-9
		}, // ng/L
		{
			label: '当量浓度 (N)',
			value: 'normality',
			factor: 1
		}, // 与mol/L同基准
		{
			label: '莫耳分率 (x)',
			value: 'mole_fraction',
			factor: 1 / 0.001
		} // 稀溶液近似
	],

	// 照度单位（光学）
	brightness: [
		// 亮度单位（光源单位面积发光强度）
		{
			label: '尼特 (nt)',
			value: 'nt',
			factor: 1
		},
		{
			label: '坎德拉/平方米 (cd/m²)',
			value: 'cd_m2',
			factor: 1
		},
		{
			label: '朗伯 (L)',
			value: 'lambert',
			factor: 3183.1
		},
		{
			label: '英尺朗伯 (fL)',
			value: 'foot_lambert',
			factor: 3.426259
		},

		// 光度学特殊单位
		{
			label: '斯托克斯 (sb)',
			value: 'sb',
			factor: 10000
		}, // 1sb=10⁴ cd/m²
		{
			label: '阿熙提 (asb)',
			value: 'apostilb',
			factor: 0.31831
		}, // π⁻¹ cd/m²

		// 天文光度单位
		{
			label: '星等/平方角秒 (mag/arcsec²)',
			value: 'mag_arcsec2',
			factor: 1.584e-11
		} // 转换为尼特
	],
	pressure: [
		// 公制单位
		{
			label: '帕斯卡 (Pa)',
			value: 'pa',
			factor: 1
		},
		{
			label: '百帕 (hPa)',
			value: 'hpa',
			factor: 100
		},
		{
			label: '千帕 (kPa)',
			value: 'kpa',
			factor: 1000
		},
		{
			label: '兆帕 (MPa)',
			value: 'mpa',
			factor: 1e6
		},
		{
			label: '巴 (bar)',
			value: 'bar',
			factor: 1e5
		},
		{
			label: '毫巴 (mbar)',
			value: 'mbar',
			factor: 100
		},

		// 英制单位
		{
			label: '磅力/平方英寸 (psi)',
			value: 'psi',
			factor: 6894.76
		},
		{
			label: '磅力/平方英尺 (psf)',
			value: 'psf',
			factor: 47.8803
		},
		{
			label: '英寸汞柱 (inHg)',
			value: 'inhg',
			factor: 3386.39
		},

		// 市制单位
		{
			label: '斤力/平方寸 (斤/in²)',
			value: 'jin_sq_in',
			factor: 7593.88
		}, // 1斤≈4.9N
		{
			label: '尺水柱 (ftH₂O)',
			value: 'ft_h2o',
			factor: 2989.07
		}, // 中国水利工程单位

		// 液柱压力单位
		{
			label: '毫米汞柱 (mmHg)',
			value: 'mmhg',
			factor: 133.322
		},
		{
			label: '厘米水柱 (cmH₂O)',
			value: 'cm_h2o',
			factor: 98.0665
		},
		{
			label: '米水柱 (mH₂O)',
			value: 'm_h2o',
			factor: 9806.65
		},

		// 大气压力单位
		{
			label: '标准大气压 (atm)',
			value: 'atm',
			factor: 101325
		},
		{
			label: '工程大气压 (at)',
			value: 'at',
			factor: 98066.5
		},

		// 特殊压力单位
		{
			label: '托 (Torr)',
			value: 'torr',
			factor: 133.322
		}, // 等于1mmHg
		{
			label: '皮兹 (pz)',
			value: 'pz',
			factor: 1000
		}, // 1kN/m²
		{
			label: '微巴 (μbar)',
			value: 'ubar',
			factor: 0.1
		}
	],

	force: [
		// 公制单位
		{
			label: '牛顿 (N)',
			value: 'N',
			factor: 1
		},
		{
			label: '毫牛顿 (mN)',
			value: 'mN',
			factor: 0.001
		},
		{
			label: '千牛顿 (kN)',
			value: 'kN',
			factor: 1000
		},
		{
			label: '兆牛顿 (MN)',
			value: 'MN',
			factor: 1e6
		},

		// 重力单位
		{
			label: '千克力 (kgf)',
			value: 'kgf',
			factor: 9.80665
		},
		{
			label: '公吨力 (tf)',
			value: 'tf',
			factor: 9806.65
		},
		{
			label: '克力 (gf)',
			value: 'gf',
			factor: 0.00980665
		},

		// 英制单位
		{
			label: '磅力 (lbf)',
			value: 'lbf',
			factor: 4.44822
		},
		{
			label: '盎司力 (ozf)',
			value: 'ozf',
			factor: 0.278014
		},
		{
			label: '英吨力 (tonf-UK)',
			value: 'uk_tonf',
			factor: 9964.02
		},
		{
			label: '美吨力 (tonf-US)',
			value: 'us_tonf',
			factor: 8896.44
		},

		// 市制单位
		{
			label: '斤力 (斤力)',
			value: 'jin',
			factor: 4.903325
		}, // 1斤力≈0.5kgf
		{
			label: '担力 (担力)',
			value: 'dan',
			factor: 490.3325
		}, // 1担=100斤
		{
			label: '引力 (引力)',
			value: 'yin',
			factor: 49033.25
		}, // 1引=1000斤

		// 特殊单位
		{
			label: '达因 (dyn)',
			value: 'dyn',
			factor: 1e-5
		}, // CGS单位制
		{
			label: '斯钦 (sn)',
			value: 'sthène',
			factor: 1000
		}, // 1千牛顿
		{
			label: '磅达 (pdl)',
			value: 'pdl',
			factor: 0.138255
		} // 英制单位
	],
	energy: [
		// 公制单位（国际标准）
		{
			label: '焦耳 (J)',
			value: 'J',
			factor: 1
		},
		{
			label: '千焦 (kJ)',
			value: 'kJ',
			factor: 1000
		},
		{
			label: '兆焦 (MJ)',
			value: 'MJ',
			factor: 1e6
		},
		{
			label: '瓦时 (Wh)',
			value: 'Wh',
			factor: 3600
		},
		{
			label: '千瓦时 (kWh)',
			value: 'kWh',
			factor: 3.6e6
		},

		// 英制单位
		{
			label: '英热单位 (BTU)',
			value: 'btu',
			factor: 1055.06
		},
		{
			label: '英尺磅力 (ft·lb)',
			value: 'ft_lb',
			factor: 1.35582
		},
		{
			label: '热化学卡路里 (cal_th)',
			value: 'cal_th',
			factor: 4.184
		},

		// 市制单位
		{
			label: '斤力米 (斤·m)',
			value: 'jin_m',
			factor: 4.903325
		}, // 1斤力·米
		{
			label: '担力米 (担·m)',
			value: 'dan_m',
			factor: 490.3325
		}, // 1担力·米
		{
			label: '尺斤力 (尺·斤)',
			value: 'chi_jin',
			factor: 1.6344
		}, // 1尺·斤力

		// 食物能量单位
		{
			label: '卡路里 (cal)',
			value: 'cal',
			factor: 4.184
		},
		{
			label: '千卡路里 (kcal)',
			value: 'kcal',
			factor: 4184
		},

		// 物理特殊单位
		{
			label: '电子伏特 (eV)',
			value: 'eV',
			factor: 1.602176634e-19
		},
		{
			label: '尔格 (erg)',
			value: 'erg',
			factor: 1e-7
		}, // CGS单位
		{
			label: '哈特里 (Ha)',
			value: 'hartree',
			factor: 4.3597447222071e-18
		}, // 原子物理

		// 工业单位
		{
			label: '吨TNT当量 (tTNT)',
			value: 't_tnt',
			factor: 4.184e9
		},
		{
			label: '桶油当量 (BOE)',
			value: 'boe',
			factor: 6.12e9
		} // 近似值
	],
	frequency: [
		// 公制单位（国际标准）
		{
			label: '赫兹 (Hz)',
			value: 'hz',
			factor: 1
		},
		{
			label: '千赫兹 (kHz)',
			value: 'khz',
			factor: 1000
		},
		{
			label: '兆赫兹 (MHz)',
			value: 'mhz',
			factor: 1e6
		},
		{
			label: '吉赫兹 (GHz)',
			value: 'ghz',
			factor: 1e9
		},
		{
			label: '太赫兹 (THz)',
			value: 'thz',
			factor: 1e12
		},

		// 英制/工程单位
		{
			label: '周每分钟 (CPM)',
			value: 'cpm',
			factor: 1 / 60
		},
		{
			label: '转每分钟 (RPM)',
			value: 'rpm',
			factor: 1 / 60
		},
		{
			label: '兆周每秒 (MC/s)',
			value: 'mcps',
			factor: 1e6
		}, // 传统无线电单位

		// 音乐声学单位
		{
			label: '音分',
			value: 'cent',
			factor: 1.0005778
		}, // 半音的1/100
		{
			label: '倍频程 (octave)',
			value: 'octave',
			factor: 2
		}, // 频率比值单位
		{
			label: '美尔 (mel)',
			value: 'mel',
			factor: 1.0
		}, // 心理声学比例

		// 中国市制单位
		{
			label: '息',
			value: 'xi',
			factor: 0.1
		}, // 中医脉诊，1息=0.1Hz
		{
			label: '晷漏刻',
			value: 'kegu',
			factor: 1 / 900
		}, // 古代计时频率（1刻=15分钟）

		// 专业领域单位
		{
			label: '波数 (cm⁻¹)',
			value: 'kayser',
			factor: 29979.2458
		}, // 光谱学单位
		{
			label: '巴德 (Bd)',
			value: 'baud',
			factor: 1
		}, // 符号率单位
		{
			label: '角频率 (rad/s)',
			value: 'rad_s',
			factor: 2 * Math.PI
		},

		// 自然频率单位
		{
			label: '原子频率单位',
			value: 'au_freq',
			factor: 6.579683e15
		}, // 哈特里频率
		{
			label: '核磁共振频率',
			value: 'nmr_freq',
			factor: 4.257e7
		} // 典型氢原子频率
	],
	flow: [
		// 公制体积流量
		{
			label: '升/秒 (L/s)',
			value: 'Ls',
			factor: 1
		},
		{
			label: '升/分钟 (L/min)',
			value: 'L_min',
			factor: 1 / 60
		},
		{
			label: '毫升/秒 (mL/s)',
			value: 'mL_s',
			factor: 0.001
		},
		{
			label: '立方米/秒 (m³/s)',
			value: 'm3_s',
			factor: 1000
		},
		{
			label: '立方米/小时 (m³/h)',
			value: 'm3_h',
			factor: 1000 / 3600
		},

		// 英制体积流量
		{
			label: '加仑(美)/秒 (gal(US)/s)',
			value: 'gal_us_s',
			factor: 3.78541
		},
		{
			label: '加仑(英)/秒 (gal(Imp)/s)',
			value: 'gal_imp_s',
			factor: 4.54609
		},
		{
			label: '立方英尺/秒 (ft³/s)',
			value: 'cfs',
			factor: 28.3168
		},
		{
			label: '桶(石油)/天 (bbl/d)',
			value: 'bpd',
			factor: 0.00184013
		},
		{
			label: '加仑(美)/分钟 (gpm)',
			value: 'gpm',
			factor: 0.0630902
		},

		// 市制流量单位
		{
			label: '升/时辰',
			value: 'L_chen',
			factor: 1 / 7200
		}, // 1时辰=2小时
		{
			label: '斗/时',
			value: 'dou_h',
			factor: 10 / 3600
		}, // 1斗=10L
		{
			label: '石/天',
			value: 'shi_d',
			factor: 100 / 86400
		}, // 1石=100L
		{
			label: '方/分',
			value: 'fang_min',
			factor: 1 / 60
		}, // 1方=1m³=1000L

		// 质量流量
		{
			label: '千克/秒 (kg/s)',
			value: 'kg_s',
			factor: 1
		}, // 假设密度=1g/mL
		{
			label: '吨/小时 (t/h)',
			value: 't_h',
			factor: 1000 / 3600
		},

		// 特殊领域
		{
			label: '标准立方英尺/分 (scfm)',
			value: 'scfm',
			factor: 0.472
		}, // 标准温度和压力
		{
			label: '西格斯比单位 (sg)',
			value: 'sverdrup',
			factor: 1e6
		}, // 海洋学单位(10⁶m³/s)
		{
			label: '水文学单位 (cms)',
			value: 'cumec',
			factor: 1000
		} // 等同m³/s
	],
	resistance: [
		// 公制单位
		{
			label: '欧姆 (Ω)',
			value: 'ohm',
			factor: 1
		},
		{
			label: '微欧 (μΩ)',
			value: 'uohm',
			factor: 1e-6
		},
		{
			label: '毫欧 (mΩ)',
			value: 'mohm',
			factor: 0.001
		},
		{
			label: '千欧 (kΩ)',
			value: 'kohm',
			factor: 1000
		},
		{
			label: '兆欧 (MΩ)',
			value: 'Mohm',
			factor: 1e6
		},
		{
			label: '吉欧 (GΩ)',
			value: 'Gohm',
			factor: 1e9
		},

		// 电磁单位
		{
			label: '绝对欧姆 (abΩ)',
			value: 'abohm',
			factor: 1e-9
		}, // CGS单位
		{
			label: '国际欧姆 (intΩ)',
			value: 'intohm',
			factor: 1.00049
		}, // 历史标准

		// 特殊单位
		{
			label: '波导阻抗 (Z₀)',
			value: 'z0',
			factor: 376.730
		}, // 真空阻抗 ≈377Ω
		{
			label: '阻抗量子 (Rₓ)',
			value: 'rk',
			factor: 25812.807
		}, // 冯·克利钦常数

		// 工程单位
		{
			label: '西门子倒数 (S⁻¹)',
			value: 'siemens_inv',
			factor: 1
		}, // 电导的倒数
		{
			label: '毫西门子倒数 (mS⁻¹)',
			value: 'mS_inv',
			factor: 1000
		},

		// 超导单位
		{
			label: '磁通量子/安培 (Φ₀/A)',
			value: 'flux_quantum',
			factor: 2.0678e-15
		}
	],
	decimal: [
		// 基本单位
		{
			label: '常数',
			value: 'decimal',
			factor: 1
		},

		// 百分等级单位
		{
			label: '百分 (%)',
			value: 'percent',
			factor: 100
		},
		{
			label: '千分 (‰)',
			value: 'permille',
			factor: 1000
		},
		{
			label: '万分 (‱)',
			value: 'permyriad',
			factor: 10000
		},
		{
			label: '十万分 (‱‱)',
			value: 'perhundredthousand',
			factor: 100000
		},

		// 国际标准比例单位
		{
			label: '百万分率 (ppm)',
			value: 'ppm',
			factor: 1e6
		},
		{
			label: '十亿分率 (ppb)',
			value: 'ppb',
			factor: 1e9
		},
		{
			label: '万亿分率 (ppt)',
			value: 'ppt',
			factor: 1e12
		},
		{
			label: '千万亿分率 (ppq)',
			value: 'ppq',
			factor: 1e15
		},

		// 工程比例单位
		{
			label: '分贝 (dB)',
			value: 'db',
			factor: 1
		}, // 对数单位，比例转换需额外计算
		{
			label: '贝尔 (B)',
			value: 'bel',
			factor: 10
		}, // 1B=10dB

		// 金融比例单位
		{
			label: '基点 (bp)',
			value: 'basispoint',
			factor: 10000
		},
		{
			label: '派帕 (pip)',
			value: 'pip',
			factor: 10000
		}, // 外汇交易单位

		// 中国市制比例单位
		{
			label: '厘',
			value: 'li',
			factor: 1000
		}, // 利率单位
		{
			label: '分',
			value: 'fen',
			factor: 100
		}, // 利率单位
		{
			label: '成',
			value: 'cheng',
			factor: 10
		}, // "十分之一"称为"一成"

		// 统计比例单位
		{
			label: '标准偏差 (σ)',
			value: 'stddev',
			factor: 1
		} // 统计标准化
	],
	damping: [
		// 力学阻尼单位
		{
			label: '牛顿秒/米 (N·s/m)',
			value: 'nsm',
			factor: 1
		},
		{
			label: '千牛秒/米 (kN·s/m)',
			value: 'knsm',
			factor: 1000
		},

		// 英制阻尼单位
		{
			label: '磅秒/英尺 (lbf·s/ft)',
			value: 'lsf',
			factor: 14.594
		},
		{
			label: '磅达秒/英尺 (pdl·s/ft)',
			value: 'psf',
			factor: 0.4536
		},
		{
			label: '千克力秒/米 (kgf·s/m)',
			value: 'kgf_s_m',
			factor: 9.80665
		},

		// 市制阻尼单位
		{
			label: '斤力秒/尺',
			value: 'jin_s_chi',
			factor: 14.7
		}, // 1斤力≈4.9N, 1尺≈0.333m
		{
			label: '担力秒/米',
			value: 'dan_s_m',
			factor: 490.332
		}, // 1担力≈490.3N
		{
			label: '两力秒/寸',
			value: 'liang_s_cun',
			factor: 1.471
		}, // 1两≈0.49N, 1寸≈0.033m

		// 电气阻尼单位
		{
			label: '欧姆秒 (Ω·s)',
			value: 'ohm_s',
			factor: 1
		},
		{
			label: '毫欧姆秒 (mΩ·s)',
			value: 'mohm_s',
			factor: 0.001
		},
		{
			label: '阻尼比 (ζ)',
			value: 'zeta',
			factor: 1
		}, // 无量纲单位

		// 声学阻尼单位
		{
			label: '瑞利 (rayl)',
			value: 'rayl',
			factor: 1
		}, // N·s/m³
		{
			label: '声欧姆 (acoustic ohm)',
			value: 'ac_ohm',
			factor: 1
		},

		// 特殊阻尼单位
		{
			label: '临界阻尼系数 (c₀)',
			value: 'c0',
			factor: 1
		},
		{
			label: '品质因数 (Q)',
			value: 'q_factor',
			factor: 1
		}, // 阻尼倒数
		{
			label: '对数衰减率 (δ)',
			value: 'log_dec',
			factor: 1
		} // 无量纲
	]
}