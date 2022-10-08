# React-Native-Obs

## 简介

1. 基于华为云 OBS 临时 token 模式封装的 ReactNative 桥接包
2. 默认集成断点续传功能

## 待实现

- [x] 上传进度事件实现
- [ ] 其他上传模式支持

## 安装

```xml
// iOS info.plist
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

```sh
yarn add react-native-hw-obs
cd ios && pod install
```

## 使用

1. 首先初始化客户端
2. 然后调用 upload 方法

```ts
import { initWithSecurityToken, upload } from 'react-native-obs';

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
 * @param bucketname 桶名
 * @param localfile 文件 url
 * @param checkpoint 是否断点续传
 * @returns Promise<{fileId: string, fileUrl: string}> obs 文件地址
 */
async function upload(options: {
  bucketname: string;
  localfile: string;
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
