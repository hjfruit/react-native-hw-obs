// import { encodeURI } from 'js-base64';
// const signer = require('./api-signer.js');

// const projectId = 'Oaf556037a80f2d72fccc000a511a79f';
// let timer: NodeJS.Timer;

// export interface ImageWatermarkParams {
//   g: string;
//   x: number;
//   y: number;
//   voffset: number;
//   align: number;
//   order: number;
//   t: number;
//   interval: number;
//   image: string;
//   P: number;
//   text: string;
//   size: number;
//   type: string;
//   color: string;
//   shadow: number;
//   fill: number;
//   rotate: number;
//   [key: string]: any;
// }

// interface ObsObjInfo {
//   bucket: string;
//   location: string;
//   object: string;
// }

// interface VideoWatermarkParams {
//   dx: string;
//   dy: string;
//   referpos: string;
//   timeline_start: string;
//   timeline_duration: string;
//   image_process: string;
//   width: string;
//   height: string;
//   base: string;
// }

// interface WatermarkRequest {
//   input: string;
//   text_context: string;
//   image_watermark: Partial<VideoWatermarkParams>;
//   text_watermark: Partial<VideoWatermarkParams>;
// }

// const transformBaseField: Array<keyof ImageWatermarkParams> = ['text', 'type'];

// /**
//  * 解析URL提取obs信息
//  */
// const parseUrl = (url: string) => {
//   let bucketName = '';
//   let endPoint = '';
//   let objectName = '';
//   url = url.replace(/^https?\:\/\//i, '');
//   const bucketReg = /.+(?=.obs)/;
//   const bucketNames = url.match(bucketReg);
//   if (bucketNames?.length) {
//     bucketName = bucketNames[0] ?? '';
//   }
//   const endReg = /(?<=.obs).+(?=.com)/;
//   const endPoints = url.match(endReg);
//   if (endPoints?.length) {
//     endPoint = endPoints[0] ?? '';
//   }
//   if (endPoint) {
//     endPoint = `obs${endPoint}.com`;
//   }
//   const objectReg = /(?<=com\/).+/;
//   const objectNames = url.match(objectReg);
//   if (objectNames?.length) {
//     objectName = objectNames[0] ?? '';
//   }
//   return { bucketName, endPoint, objectName };
// };

// /**
//  * 图片添加水印功能
//  */
// export const imageAddWatermark = (
//   url: string,
//   params: Partial<ImageWatermarkParams> = {}
// ) => {
//   transformBaseField.forEach((key) => {
//     if (params[key]) {
//       params[key] = encodeURI(params[key]);
//     }
//   });
//   if (params['image']) {
//     const data = parseUrl(params['image']);
//     const { bucketName, objectName } = data;
//     params['image'] = encodeURI(`${bucketName}/${objectName}`);
//   }
//   const arr = Object.keys(params).map((key) => {
//     return `${key}_${params[key]}`;
//   });
//   return `${url}?x-image-process=image/watermark,${arr.join(',')}`;
// };

// /**
//  * 获取 API 签名
//  * @param ak ak
//  * @param sk sk
//  */
// const getSignature = (
//   ak: string,
//   sk: string,
//   params: {
//     method: string;
//     uri: string;
//     headers?: { [key: string]: any };
//     body?: string;
//   }
// ) => {
//   const sig = new signer.Signer();
//   sig.Key = ak;
//   sig.Secret = sk;
//   var r = new signer.HttpRequest(params.method, params.uri);
//   r.headers = params?.headers;
//   r.body = params?.body;
//   const opt = sig.Sign(r);
//   return opt.headers;
// };

// /**
//  * 创建水印模板并返回模板id
//  * @param endPoint endPoint
//  * @param ak ak
//  * @param sk sk
//  * @returns template_id
//  */
// const createTemplate = async (ak: string, sk: string, endPoint: string) => {
//   try {
//     const uri = `https://${endPoint}/v1/${projectId}/template/watermark`;
//     let headers = { 'X-Project_Id': projectId };
//     const method = 'POST';
//     headers = getSignature(ak, sk, { method, uri, headers });
//     const response = await fetch(uri, { method, headers });
//     const res = await response.json();
//     return res?.template_id;
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * 获取已经创建的水印模板
//  * @param ak ak
//  * @param sk sk
//  * @param endPoint endPoint
//  * @returns template_id
//  */
// const getTemplate = async (
//   ak: string,
//   sk: string,
//   st: string,
//   endPoint: string
// ) => {
//   try {
//     let uri = `mpc.cn-north-4.myhuaweicloud.com/v1/${projectId}/template/watermark?page=1&pageSize=100`;
//     // let uri =
//     // 'mpc.cn-north-4.myhuaweicloud.com/v1/03896e5b71e144c1ac63cf2bc0ca437f/template/watermark';
//     let headers: any = {
//       'X-Project_Id': '03896e5b71e144c1ac63cf2bc0ca437f',
//       'Content-Type': 'application/json;charset=UTF-8',
//       // 'X-Sdk-Content-Sha256': 'UNSIGNED-PAYLOAD',
//       'X-Security-Token': st,
//       'x-amz-date': new Date().toUTCString(),
//     };
//     const method = 'GET';
//     headers = getSignature(
//       // 'HIT04Y8JJGXBBS4RLIZL',
//       // 'm6OaHAo9e4fhORl8mOB9Ejiiyl37GPV0jKi8UESX',
//       ak,
//       sk,
//       {
//         method,
//         uri,
//         headers,
//       }
//     );
//     console.log('headers: ', headers);
//     const response = await fetch(`https://${uri}`, {
//       method,
//       headers,
//     });
//     let res = await response.json();
//     if (res?.templates?.length) {
//       return res.templates[0].template_id;
//     } else {
//       return undefined;
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * 创建转码任务，并返回任务id
//  * @param ak ak
//  * @param sk sk
//  * @param endPoint endPoint
//  * @param input ObsObjInfo
//  * @param output ObsObjInfo
//  * @param trans_template_id template_id
//  * @param watermarks WatermarkRequest
//  * @returns task_id
//  */
// const createTranscoding = async (
//   ak: string,
//   sk: string,
//   endPoint: string,
//   input: ObsObjInfo,
//   output: ObsObjInfo,
//   trans_template_id: string,
//   watermarks: Partial<WatermarkRequest>
// ) => {
//   try {
//     const wm: any = watermarks;
//     if (watermarks.input) {
//       const { bucketName, endPoint, objectName } = parseUrl(watermarks.input);
//       wm.input = { bucket: bucketName, location: endPoint, object: objectName };
//     }
//     const uri = `https://${endPoint}/v1/${projectId}/transcodings`;
//     let headers = { 'X-Project_Id': projectId };
//     const method = 'POST';
//     const body = JSON.stringify({
//       input,
//       output,
//       trans_template_id,
//       watermarks: wm,
//     });
//     headers = getSignature(ak, sk, { method, uri, headers, body });
//     const response = await fetch(uri, {
//       method,
//       headers,
//       body,
//     });
//     const res = await response.json();
//     return res?.task_id;
//   } catch (error) {
//     console.error('error: ', error);
//     throw error;
//   }
// };

// /**
//  * 获取转码任务结果，返回转码后URL
//  * @param ak ak
//  * @param sk sk
//  * @param endPoint endPoint
//  * @param task_id task_id
//  * @param callback callback
//  */
// const getTaskData = (
//   ak: string,
//   sk: string,
//   endPoint: string,
//   task_id: number,
//   callback: (fileUrl: string) => any
// ) => {
//   timer = setTimeout(() => {
//     const uri = `https://${endPoint}/v1/${projectId}/transcodings?${new URLSearchParams(
//       { task_id: task_id.toString() }
//     )}`;
//     const method = 'GET';
//     let headers = { 'X-Project_Id': projectId };
//     headers = getSignature(ak, sk, { method, uri, headers });
//     fetch(uri, { method, headers })
//       .then((response) => response.json())
//       .then((res) => {
//         clearTimeout(timer);
//         const data = res.data?.task_array || [];
//         if (data.length && typeof callback === 'function') {
//           if (data[0].status === 'SUCCEEDED') {
//             callback('');
//           }
//           if (data[0].status === 'FAILED') {
//             getTaskData(ak, sk, endPoint, task_id, callback);
//           }
//         }
//       });
//   }, 1000);
// };

// /**
//  * 视频添加水印
//  * @param arg arg
//  */
// export const videoAddWatermark = async (arg: {
//   ak: string;
//   sk: string;
//   st: string;
//   url: string;
//   watermarks: Partial<WatermarkRequest>;
//   taskId?: number;
//   callback: (fileUrl: string) => any;
// }) => {
//   try {
//     const { ak, sk, st, url, taskId, watermarks, callback } = arg;
//     const { bucketName, endPoint, objectName } = parseUrl(url);
//     let task_id = taskId;
//     if (!task_id) {
//       let template_id = await getTemplate(ak, ak, st, endPoint);
//       if (!template_id) {
//         template_id = await createTemplate(ak, sk, endPoint);
//       }
//       const input = {
//         bucket: bucketName,
//         location: endPoint,
//         object: objectName,
//       };
//       const output = {
//         bucket: bucketName,
//         location: endPoint,
//         object: 'watermark',
//       };
//       task_id = await createTranscoding(
//         ak,
//         sk,
//         endPoint,
//         input,
//         output,
//         template_id,
//         watermarks
//       );
//     }
//     // 发起心跳，当有结果回调函数
//     if (task_id) {
//       getTaskData(ak, sk, endPoint, task_id, callback);
//     }
//     return task_id;
//   } catch (error) {
//     console.error('error: ', error);
//     return error;
//   }
// };
