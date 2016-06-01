# 微信蓝牙协议模拟器
基于对微信AirSync蓝牙协议的理解写的模拟器，主要用于调试硬件设备与微信的蓝牙通讯，方便其它开发者快速了解和上手。

## 主要特性
* 支持模拟微信蓝牙近场发现
* 支持模拟微信运动精简协议

## 使用方法
    sudo node ble-simulator.js

## 依赖
* bluez
* libbluetooth-dev
* nodejs
* bleno
* bleadvertise
推荐在Linux环境下运行，系统需要有蓝牙适配器和bluez蓝牙工具包。bleno库主要完成BLE设备的服务与特征值构建，在非Linux环境下运行时需要满足bleno的依赖条件。

## 测试环境

代码已经在以下环境运行测试通过

### 软件环境
* bluez 版本 4.101
* nodejs 版本 4.4.5
* bleno 版本 0.4.0
* bleadvertise 版本 0.1.1

### 硬件环境

 | 参数
------------- | -----------
平台 | Raspberry Pi 2 Model B
OS | Ubuntu 14.04.4
内核 | 3.18.0-20-rpi2
蓝牙模块 | CSR Bluetooth 4.0 USB module
 
## 备注
AirSyncDebugger是微信提供的蓝牙协议调试工具
