# React-Native-Obs

## 简介

1. 基于华为云 OBS 临时 token 模式封装的 ReactNative 桥接包
2. 默认集成断点续传功能
3. 上传文件进度监听返回

## 安装

```xml
// iOS info.plist
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

```xml
// Podfile 添加以下代码
post_install do |installer|
 installer.pods_project.targets.each do |target|
   target.build_configurations.each do |config|
     config.build_settings['ENABLE_BITCODE'] = 'NO'
   end
 end
end
```

```xml
// 在Xcode中修改
project => enable bitcode 选择 No
target => enable bitcode 选择 No
```

```sh
yarn add react-native-hw-obs
cd ios && pod install
```

## 使用

> 具体使用详见 example

1. 初始化客户端
2. 调用 upload 方法
3. 监听文件上传进度

```ts
import {
  initWithSecurityToken,
  upload,
  addEventListener,
  removeEventListener,
} from 'react-native-obs';

/**
 * 初始化客户端
 * @param securityToken 临时 token
 * @param accessKey ak
 * @param secretKey sk
 * @param endPoint 华为云地址, 不需要 http(s) 前缀
 */
function initWithSecurityToken(options: {
  securityToken: string;
  accessKey: string;
  secretKey: string;
  endPoint: string;
});

/**
 * 上传 obs
 * @param bucketName 桶名
 * @param localFile 文件 url
 * @param checkpoint 是否断点续传
 * @returns Promise<{fileId: string, fileUrl: string}> obs 文件地址
 */
async function upload(options: {
  bucketName: string;
  localFile: string;
  checkpoint: boolean;
});

/**
 * 上传进度监听
 * @param event 事件名 uploadProgress | downloadProgress
 * @param callback
 */
export function addEventListener(
  event: ReactNativeHWObsEvent,
  callback: (params: { currentSize: string; totalSize: string }) => void
);

/**
 * 移除事件监听
 * @param event 事件名 uploadProgress | downloadProgress
 */
export function removeEventListener(event: ReactNativeHWObsEvent);
```
