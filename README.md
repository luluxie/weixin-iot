

# 微信蓝牙协议模拟器
微信AirSync蓝牙协议模拟器，用于调试硬件设备与微信的蓝牙通讯，便于开发者快速了解和上手。

## 主要特性
支持模拟微信蓝牙近场发现
支持模拟微信AirSync协议
支持模拟微信运动精简协议

## Usage
sudo node ble-simulator.js

## 测试环境

已在以下环境下运行测试通过
 
[软件环境]
bluez:			版本 4.101
nodejs:			版本 4.4.5
bleno: 			版本 0.4.0
bleadvertise:	版本 0.1.1

[硬件平台]
Raspberry Pi 2 Model B
OS: 		Ubuntu 14.04.4
内核: 		3.18.0-20-rpi2
蓝牙模块: 	CSR Bluetooth 4.0 USB module
 
## 备注
AirSyncDebugger: 是微信提供的蓝牙协议调试工具
