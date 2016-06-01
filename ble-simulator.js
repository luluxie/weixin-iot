/*
 * 已在以下环境下运行测试通过
 * 
 * [软件环境]
 * bluez:		版本 4.101
 * nodejs:		版本 4.4.5
 * bleno: 		版本 0.4.0
 * bleadvertise:	版本 0.1.1
 * 
 * [硬件环境]
 * 平台:		Raspberry Pi 2 Model B
 * OS: 		Ubuntu 14.04.4
 * 内核: 	3.18.0-20-rpi2
 * 蓝牙模块: 	CSR Bluetooth 4.0 USB module
 * 
 * [Usage]
 * sudo node ble-simulator.js
 * 
 * [备注]
 * AirSyncDebugger是微信提供的蓝牙协议调试工具
 * 
 */

var util = require('util');
var bleno = require('bleno');
var parser = require('bleadvertise');

// 微信蓝牙设备专属UUID <------------------------------------[重要] 
var WX_SERVICE_UUID = 'FEE7';
var WX_CHARC_UUID_WRITE = 'FEC7';
var WX_CHARC_UUID_INDICATE = 'FEC8';
var WX_CHARC_UUID_READ = 'FEC9';

// 微信运动精简协议专属UUID
var WERUN_PEDOMETER_UUID = 'FEA1';
var WERUN_TARGET_UUID = 'FEA2';

// 蓝牙广播COMPANY IDENTIFIER，设备厂商在BLUETOOTH SIG申请的公司编号
var DEVICE_COMPANY_ID = '013A';
// 蓝牙广播LOCAL NAME，AirSyncDebugger显示该名称
var BLE_LOCAL_NAME = 'WeChat BLE';
// 蓝牙设备名称，与微信内显示的名称无关
var DEVICE_NAME = '微信互联硬件';
// 设备MAC地址 <-------------------------------------------[重要] 
var DEVICE_MAC_ADDR = '001A7DDA710A';

// 在运行环境变量中设置设备名称
process.env['BLENO_DEVICE_NAME'] = DEVICE_NAME;

var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;

// ///////////////////////////////////////////////////////// START
// 定义Write特征值
var WxWriteOnlyChar = function() {
	WxWriteOnlyChar.super_.call(this, {
		uuid : WX_CHARC_UUID_WRITE, // 0xFEC7
		properties : [ 'write', 'writeWithoutResponse' ]
	});
};

util.inherits(WxWriteOnlyChar, BlenoCharacteristic);

WxWriteOnlyChar.prototype.onWriteRequest = function(data, offset,
		withoutResponse, callback) {
	console.log('WxWriteOnlyChar write request: 0x' + data.toString('hex') + ' '
			+ offset + ' ' + withoutResponse);
	callback(this.RESULT_SUCCESS);
};
// 定义Write特征值 --END

// 定义Indicate特征值
var WxIndicateOnlyChar = function() {
	WxIndicateOnlyChar.super_.call(this, {
		uuid : WX_CHARC_UUID_INDICATE, // 0xFEC8
		properties : [ 'indicate' ]
	});
};

util.inherits(WxIndicateOnlyChar, BlenoCharacteristic);
// 定义Indicate特征值 --END

// 定义Read特征值
var WxStaticReadOnlyChar = function() {
	WxStaticReadOnlyChar.super_.call(this, {
		uuid : WX_CHARC_UUID_READ, // 0xFEC9
		properties : [ 'read' ],
		// 设备MAC地址 <------------------------------------------[重要] 
		value : new Buffer(DEVICE_MAC_ADDR, 'hex')
	});
};

util.inherits(WxStaticReadOnlyChar, BlenoCharacteristic);
// 定义Read特征值 --END
// ///////////////////////////////////////////////////////// END

/////////////////////////////////////////////////////////// START
// 定义微信运动计步器特征值
var WeRunPedoMeterChar = function() {
	WeRunPedoMeterChar.super_.call(this, {
		uuid : WERUN_PEDOMETER_UUID,
		properties : [ 'read', 'indicate' ],
		// 返回计步器数据，此处为示例仅返回固定值:0x01 0x102700
		// 数据格式: XX(flag) XXXX..(value, Little-Endian)
		// FLAG: 0x01：步数（必选） 0x02：距离单位m（可选） 0x04：卡路里（可选）
		// VALUE: 步数，距离，卡路里
		value : new Buffer('01' + '102700', 'hex')
	});
};

util.inherits(WeRunPedoMeterChar, BlenoCharacteristic);

// onSubscribe
WeRunPedoMeterChar.prototype.onSubscribe = function(maxValueSize,
		updateValueCallback) {
	console.log('WeRunPedoMeterChar subscribe');
	this.changeInterval = setInterval(function() {
		// 返回计步器数据，此处为示例仅返回固定值:0x01 0x102700
		var data = new Buffer('01' + '102700', 'hex');
		console.log('WeRunPedoMeterChar update value: 0x' + data.toString('hex'));
		updateValueCallback(data);
		this.counter++;
	}.bind(this), 1000);
};
// onUnsubscribe
WeRunPedoMeterChar.prototype.onUnsubscribe = function() {
	console.log('WeRunPedoMeterChar unsubscribe');
	if (this.changeInterval) {
		clearInterval(this.changeInterval);
		this.changeInterval = null;
	}
};
// onIndicate
WeRunPedoMeterChar.prototype.onIndicate = function() {
	console.log('WeRunPedoMeterChar on indicate');
};
// 定义微信运动计步器特征值 --END

// 定义微信运动运动目标特征值
var WeRunTargetChar = function() {
	WeRunTargetChar.super_.call(this, {
		uuid : WERUN_TARGET_UUID,
		properties : [ 'read', 'indicate', 'write' ],
		// 返回运动目标，此处示例返回目标值为1万步:0x01 0x102700
		// 数据格式: XX(flag) XXXX..(value, Little-Endian)
		// FLAG: 0x01：步数（必选）
		// VALUE: 步数
		value : new Buffer('01' + '102700', 'hex')
	});
};

util.inherits(WeRunTargetChar, BlenoCharacteristic);

// onWrite
WeRunTargetChar.prototype.onWriteRequest = function(data, offset,
		withoutResponse, callback) {
	console.log('WeRunTargetChar write request: 0x' + data.toString('hex') + ' '
			+ offset + ' ' + withoutResponse);
	callback(this.RESULT_SUCCESS);
};
// onSubscribe
WeRunTargetChar.prototype.onSubscribe = function(maxValueSize,
		updateValueCallback) {
	console.log('WeRunTargetChar subscribe');
	this.changeInterval = setInterval(function() {
		// 返回运动目标，此处示例返回目标值为1万步:0x01 0x102700
		var data = new Buffer('01' + '102700', 'hex');
		console.log('WeRunTargetChar update value: 0x' + data.toString('hex'));
		updateValueCallback(data);
		this.counter++;
	}.bind(this), 1000);
};
// onUnsubscribe
WeRunTargetChar.prototype.onUnsubscribe = function() {
	console.log('WeRunTargetChar unsubscribe');
	if (this.changeInterval) {
		clearInterval(this.changeInterval);
		this.changeInterval = null;
	}
};
// onIndicate
WeRunTargetChar.prototype.onIndicate = function() {
	console.log('WeRunTargetChar on indicate');
};
// 定义微信运动运动目标特征值 --END
// ///////////////////////////////////////////////////////// END

function WxBLEService() {
	WxBLEService.super_.call(this, {
		uuid : WX_SERVICE_UUID,
		characteristics : [ 
		                    new WxWriteOnlyChar(), 
		                    new WxIndicateOnlyChar(),
		                    new WxStaticReadOnlyChar(),
		                    // 添加微信运动精简协议特征值
		                    new WeRunPedoMeterChar(), new WeRunTargetChar() ]
	});
}

util.inherits(WxBLEService, BlenoPrimaryService);

bleno.on('stateChange', function(state) {
	console.log('\r\n');
	console.log('------------------------------------------------------------------');
	console.log('MAC=' + bleno.address + ', DevName=' + DEVICE_NAME + ', LocalName=' + BLE_LOCAL_NAME);
	console.log('------------------------------------------------------------------');
	console.log('on -> stateChange ' + state);
	if (state === 'poweredOn') {
		// 拼装广播数据包
		var data = {
			// 蓝牙flags设置不正确会导致微信或AirSyncDebugger连接不成功	 <------------------------------[重要] 
			flags : [0x04],
			// 在广播的服务UUIDs中加入微信专属UUID:0xFEE7 <------------------------------------------[重要] 
			incompleteUUID16 : [ WX_SERVICE_UUID ],
			// LOCAL NAME，AirSyncDebugger中扫描到的名称
			completeName : BLE_LOCAL_NAME,
			// 微信蓝牙协议Manufacturer Data固定结尾格式: XXXX(2 bytes) XXXXXXXXXXXX(6 bytes) <------[重要] 
			mfrData : new Buffer(DEVICE_COMPANY_ID + DEVICE_MAC_ADDR, 'hex')
		};
		var advertisementData = parser.serialize(data);
		bleno.startAdvertisingWithEIRData(advertisementData, null);
	} else {
		bleno.stopAdvertising();
	}
});

bleno.on('advertisingStart', function(error) {
	console.log('on -> advertisingStart '
			+ (error ? 'error' + error : 'success'));
	if (!error) {
		// 此处示例仅添加了微信必须的Service，可在此添加更多的业务Service
		bleno.setServices([ new WxBLEService() ]);
		// bleno.setServices([ new WxBLEService(), new OtherService() ]);
	}
});
