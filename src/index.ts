import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import CryptoJS from 'crypto-js';

const LINKING_ERROR =
  `The package 'react-native-hw-obs' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const HwObs = NativeModules.HwObs
  ? NativeModules.HwObs
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

let endPoint = '';

const mergeFileUrl = (
  bucketName: string,
  endPoint: string,
  fileName: string
) => {
  return `${bucketName}.${endPoint}/${fileName}`;
};

/**
 * 获取文件后缀名
 * @param fileName 包含后缀的文件名
 * @returns 文件后缀名
 */
const getFileSuffix = (fileName: string) => {
  return fileName.split('.').pop()?.toLowerCase();
};

const getObjectName = (uri: string) => {
  const fileId = CryptoJS.SHA256(uri).toString();
  const suffix = getFileSuffix(uri);
  return `${fileId.slice(0, 2)}/${fileId}.${suffix}`;
};

/**
 * 初始化客户端
 * @param options
 * securityToken 临时 token
 * accessKey ak
 * secretKey sk
 * endPoint 华为云地址
 */
export function initWithSecurityToken(options: {
  securityToken: string;
  accessKey: string;
  secretKey: string;
  endPoint: string;
}) {
  endPoint = options.endPoint;
  if (endPoint.includes('http')) {
    console.error('endPoint格式错误');
    return;
  }
  const hwEndPoint = `http://${options.endPoint}`;
  HwObs.initWithSecurityToken(
    options.securityToken,
    options.accessKey,
    options.secretKey,
    hwEndPoint
  );
}

/**
 * 上传 obs
 * @param options
 * bucketName 桶名
 * objectName 对象名
 * fileName 文件名（用于存储地址，建议唯一）
 * localFile 文件地址
 * checkpoint 是否断点续传
 * @returns Promise<{fileId: string, fileUrl: string}> obs 文件地址
 */
export const upload = (options: {
  bucketName: string;
  localFile: string;
  checkpoint: boolean;
}) => {
  return new Promise(
    (resolve: (value: { fileUrl: string }) => void, reject) => {
      const objectName = getObjectName(options.localFile);
      HwObs.upload(
        options.bucketName,
        objectName,
        options.localFile,
        options.checkpoint
      )
        .then(() => {
          resolve({
            fileUrl: mergeFileUrl(options.bucketName, endPoint, objectName),
          });
        })
        .catch((err: any) => {
          reject(err);
        });
    }
  );
};

let subscription: any;

export enum ReactNativeHWObsEvent {
  'uploadProgress' = 'uploadProgress',
  'downloadProgress' = 'downloadProgress',
}

/**
 * 上传进度监听
 * @param event 事件名 uploadProgress | downloadProgress
 * @param callback
 */
export function addEventListener(
  event: ReactNativeHWObsEvent,
  callback: (params: { currentSize: string; totalSize: string }) => void
) {
  const Emitter =
    Platform.OS === 'ios' ? new NativeEventEmitter(HwObs) : DeviceEventEmitter;
  switch (event) {
    case ReactNativeHWObsEvent.uploadProgress:
      subscription = Emitter.addListener('uploadProgress', (e) => callback(e));
      break;
    case ReactNativeHWObsEvent.downloadProgress:
      subscription = Emitter.addListener('downloadProgress', (e) =>
        callback(e)
      );
      break;
    default:
      break;
  }
}

/**
 * 移除事件监听
 * @param event 事件名 uploadProgress | downloadProgress
 */
export function removeEventListener(event: ReactNativeHWObsEvent) {
  switch (event) {
    case ReactNativeHWObsEvent.uploadProgress:
      subscription.remove();
      break;
    case ReactNativeHWObsEvent.downloadProgress:
      subscription.remove();
      break;
    default:
      break;
  }
}
