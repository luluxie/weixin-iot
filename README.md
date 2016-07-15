# 微信蓝牙设备模拟器

* `ble-simulator.js`  微信运动，微信蓝牙设备发现模拟器。可模拟微信运动步数上报，设备发现逻辑。

* `zb-simulator.js`  摇一摇周边模拟器。可模拟真实的iBeacon设备，在微信摇一摇周边中出现。

# 蓝牙协议模拟器

`ble-simulator.js`

基于对微信AirSync蓝牙协议的理解写的模拟器，主要用于演示BLE设备与微信的通讯原理，方便其它开发者快速了解和上手。

微信有专属的蓝牙`Service UUID`，同时还有指定的特征值要实现才能被微信识别和发现。如果是开发微信运动精简协议，还需要多两个特征值。

```javascript
// 微信蓝牙服务和特征值专属UUID
var WX_SERVICE_UUID = 'FEE7';
var WX_CHARC_UUID_WRITE = 'FEC7';
var WX_CHARC_UUID_INDICATE = 'FEC8';
var WX_CHARC_UUID_READ = 'FEC9';
// 微信运动精简协议专属UUID
var WERUN_PEDOMETER_UUID = 'FEA1';
var WERUN_TARGET_UUID = 'FEA2';
```

## 主要特性

微信运动
  - 支持模拟微信运动精简协议

设备发现
  - 支持模拟微信蓝牙近场发现

## 使用方法
### Step 1

    $ sudo node ble-simulator.js
### Step 2
打开AirSyncDebugger工具点击`扫描`蓝牙设备, 点击`精简协议`, 点击`记步器测试`。测试通过后设备即可被微信发现，同时也支持了微信运动的接入。

## 接入微信
如果只是调试蓝牙协议的话Step 1和Step 2即可。Step 3和Step 4也可以预先完成，此两步主要在微信硬件平台登记产品型号，和获得接口授权。Step 4会消耗`授权配额`，微信针对每个型号都有授权配额，认证前默认只有100个，需要后续免费申请才可获得更多。

### Step 3
要让微信运动可以添加该设备为数据源，还需要在微信硬件平台中录入该设备基本信息，图标，默认显示名称等。在申请到的公众号后台开通“设备功能”插件，即可以添加一款新设备。

公众号需要做过微信认证，如果只是临时开发调试用，也可以使用公众号测试账号：

    http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login

添加设备时，需要指明接入方案:
- 微信硬件云标准接入方案
  - 设备直连微信硬件云通道
  - 厂商云连接微信硬件云通道
- 平台基础接入方案

接入微信运动精简协议，选`平台基础接入方案`即可。 

### Step 4
登记成功后会得到一个微信硬件的`型号编码`即`PRODUCT_ID`，准备好公众号的`appid`,`access_token`,设备`MAC`地址列表等。

  1.通过调用微信的设备编号API接口，得到设备编号。请求参数中`PRODUCT_ID`即`型号编码`。

    https://api.weixin.qq.com/device/getqrcode?access_token=ACCESS_TOKEN&product_id=PRODUCT_ID

  2.通过调用微信的授权接口将设备`MAC`更新到设备编号上。

    https://api.weixin.qq.com/device/authorize_device?access_token=ACCESS_TOKEN

# 摇一摇模拟器

`zb-simulator.js`

快速模拟一个标准的iBeacon设备，运行时可以在微信`摇一摇>周边`中出现。需要在微信摇一摇网站注册设备，并得到`UUID`,`Major`,`Minor`等参数才可以被微信识别。

## 主要特性

微信摇一摇
  - 支持微信摇一摇周边

## 使用方法
### Step 1
在微信摇一摇周边网站注册新的iBeacon设备，等待审核。

    https://zb.weixin.qq.com/
  
审核通过后得到`UUID`,`Major`,`Minor`等参数，在zb-simulator.js中更新对应的三个参数。

```javascript
var uuid = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'; 
var major = XXXXX; // 0x0000 - 0xffff
var minor = XXXX; // 0x0000 - 0xffff
```

### Step 2

    $ sudo node zb-simulator.js
### Step 3
打开微信进入`摇一摇`, 等待`周边`页面出现后摇一摇手机。即可摇出模拟的设备。

## 依赖

推荐在Linux环境下运行，系统需要有蓝牙适配器和bluez蓝牙工具包。bleno库主要完成BLE设备的服务与特征值构建，在非Linux环境下运行时需要满足bleno的依赖条件。

Linux
* bluez
* libbluetooth-dev
* nodejs

Node.js modules
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
