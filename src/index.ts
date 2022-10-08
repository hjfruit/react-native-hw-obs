import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import sha256 from 'sha256';

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

const getFilesuffix = (fileName: string) => {
  return fileName.split('.').pop()?.toLowerCase();
};

const createObjectname = (uri: string) => {
  return sha256(uri);
};

const mergeFileUrl = (
  bucketname: string,
  endPoint: string,
  fileName: string
) => {
  return `${bucketname}.${endPoint}/${fileName}`;
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
 * bucketname 桶名
 * objectname 对象名
 * localfile 文件地址
 * checkpoint 是否断点续传
 * @returns Promise<{fileId: string, fileUrl: string}> obs 文件地址
 */
export const upload = (options: {
  bucketname: string;
  localfile: string;
  checkpoint: boolean;
}) => {
  return new Promise(
    (resolve: (value: { fileId: String; fileUrl: string }) => void, reject) => {
      const objectname = createObjectname(options.localfile);
      const suffix = getFilesuffix(options.localfile);
      const fileName = `${objectname.slice(0, 2)}/${objectname}.${suffix}`;
      HwObs.upload(
        options.bucketname,
        fileName,
        options.localfile,
        options.checkpoint
      )
        .then(() => {
          resolve({
            fileId: objectname,
            fileUrl: mergeFileUrl(options.bucketname, endPoint, fileName),
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
