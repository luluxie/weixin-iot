var util = require('util');
var bleno = require('bleno');
// 在微信摇一摇周边后台 https://zb.weixin.qq.com 注册后得到的设备信息
var uuid = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'; 
var major = XXXXX; // 0x0000 - 0xffff
var minor = XXXX; // 0x0000 - 0xffff
var measuredPower = -59; // -128 - 127
//蓝牙设备名称，与微信内显示的名称无关
var DEVICE_NAME = '摇一摇设备';
// 在运行环境变量中设置设备名称
process.env['BLENO_DEVICE_NAME'] = DEVICE_NAME;

console.log('bleno - iBeacon');

bleno.on('stateChange', function(state) {
	console.log('on -> stateChange: ' + state);

	if (state === 'poweredOn') {
		bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower);
	} else {
		bleno.stopAdvertising();
	}
});

bleno.on('advertisingStart', function() {
	console.log('on -> advertisingStart');
});

bleno.on('advertisingStop', function() {
	console.log('on -> advertisingStop');
});
