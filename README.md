# 微信蓝牙协议模拟器
基于对微信AirSync蓝牙协议的理解写的模拟器，主要用于调试硬件设备与微信的蓝牙通讯，方便其它开发者快速了解和上手。

## 主要特性
* 支持模拟微信蓝牙近场发现
* 支持模拟微信运动精简协议

## 使用方法
### Step 1
    sudo node ble-simulator.js
### Step 2
打开AirSyncDebugger工具点击`扫描`蓝牙设备, 点击`精简协议`, 点击`记步器测试`。测试通过后设备即可被微信发现，同时也支持了微信运动的接入。
### Step 3
要让微信运动可以添加该设备为数据源，还需要在微信硬件平台中录入该设备基本信息，图标，默认显示名称等。在申请到的公众号后台开通“设备功能”插件，即可以添加一款新设备。

公众号需要做过微信认证，如果只是临时开发调试用，也可以使用公众号测试账号：

    http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login

### Step 4
登记成功后会得到一个微信硬件的`型号编码`即`PRODUCT_ID`，准备好公众号的`appid`,`access_token`,设备`MAC`地址列表等。

  1.通过调用微信的设备编号API接口，得到设备编号。`PRODUCT_ID`即`型号编码`。

    https://api.weixin.qq.com/device/getqrcode?access_token=ACCESS_TOKEN&product_id=PRODUCT_ID

  2.通过调用微信的授权接口将设备`MAC`更新到设备编号上。

    https://api.weixin.qq.com/device/authorize_device?access_token=ACCESS_TOKEN

## 依赖

推荐在Linux环境下运行，系统需要有蓝牙适配器和bluez蓝牙工具包。bleno库主要完成BLE设备的服务与特征值构建，在非Linux环境下运行时需要满足bleno的依赖条件。

* bluez
* libbluetooth-dev
* nodejs
* bleno
* bleadvertise

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
AirSyncDebugger是微信提供的蓝牙协议调试工具。
