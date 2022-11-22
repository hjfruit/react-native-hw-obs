// import CryptoJS from 'crypto-js';

// const Algorithm = 'SDK-HMAC-SHA256';
// const HeaderXDate = 'X-Sdk-Date';
// const HeaderAuthorization = 'Authorization';
// const HeaderContentSha256 = 'x-sdk-content-sha256';

// function hmacsha256(key, message) {
//   return CryptoJS.HmacSHA256(message, key).toString(CryptoJS.enc.Hex);
// }

// function HexEncodeSHA256Hash(body) {
//   return CryptoJS.SHA256(body);
// }

// const hexTable = new Array(256);
// for (var i = 0; i < 256; ++i)
//   hexTable[i] = '%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase();

// const noEscape = [
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0, // 0 - 15
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0, // 16 - 31
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   1,
//   1,
//   0, // 32 - 47
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0, // 48 - 63
//   0,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1, // 64 - 79
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   0,
//   0,
//   0,
//   0,
//   1, // 80 - 95
//   0,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1, // 96 - 111
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   1,
//   0,
//   0,
//   0,
//   1,
//   0, // 112 - 127
// ];

// function urlEncode(str) {
//   if (typeof str !== 'string') {
//     if (typeof str === 'object') str = String(str);
//     else str += '';
//   }
//   var out = '';
//   var lastPos = 0;

//   for (var i = 0; i < str.length; ++i) {
//     var c = str.charCodeAt(i);

//     // ASCII
//     if (c < 0x80) {
//       if (noEscape[c] === 1) continue;
//       if (lastPos < i) out += str.slice(lastPos, i);
//       lastPos = i + 1;
//       out += hexTable[c];
//       continue;
//     }

//     if (lastPos < i) out += str.slice(lastPos, i);

//     // Multi-byte characters ...
//     if (c < 0x800) {
//       lastPos = i + 1;
//       out += hexTable[0xc0 | (c >> 6)] + hexTable[0x80 | (c & 0x3f)];
//       continue;
//     }
//     if (c < 0xd800 || c >= 0xe000) {
//       lastPos = i + 1;
//       out +=
//         hexTable[0xe0 | (c >> 12)] +
//         hexTable[0x80 | ((c >> 6) & 0x3f)] +
//         hexTable[0x80 | (c & 0x3f)];
//       continue;
//     }
//     // Surrogate pair
//     ++i;

//     if (i >= str.length) throw new Error('ERR_INVALID_URI');

//     var c2 = str.charCodeAt(i) & 0x3ff;

//     lastPos = i + 1;
//     c = 0x10000 + (((c & 0x3ff) << 10) | c2);
//     out +=
//       hexTable[0xf0 | (c >> 18)] +
//       hexTable[0x80 | ((c >> 12) & 0x3f)] +
//       hexTable[0x80 | ((c >> 6) & 0x3f)] +
//       hexTable[0x80 | (c & 0x3f)];
//   }
//   if (lastPos === 0) return str;
//   if (lastPos < str.length) return out + str.slice(lastPos);
//   return out;
// }

// export function HttpRequest(method, url, headers, body) {
//   if (method === undefined) {
//     this.method = '';
//   } else {
//     this.method = method;
//   }
//   if (url === undefined) {
//     this.host = '';
//     this.uri = '';
//     this.query = {};
//   } else {
//     this.query = {};
//     var host, path;
//     var i = url.indexOf('://');
//     if (i !== -1) {
//       url = url.substr(i + 3);
//     }
//     var i = url.indexOf('?');
//     if (i !== -1) {
//       var query_str = url.substr(i + 1);
//       url = url.substr(0, i);
//       var spl = query_str.split('&');
//       for (var i in spl) {
//         var kv = spl[i];
//         var index = kv.indexOf('=');
//         var key, value;
//         if (index >= 0) {
//           key = kv.substr(0, index);
//           value = kv.substr(index + 1);
//         } else {
//           key = kv;
//           value = '';
//         }
//         if (key !== '') {
//           key = decodeURI(key);
//           value = decodeURI(value);
//           if (this.query[key] === undefined) {
//             this.query[key] = [value];
//           } else {
//             this.query[key].push(value);
//           }
//         }
//       }
//     }
//     var i = url.indexOf('/');
//     if (i === -1) {
//       host = url;
//       path = '/';
//     } else {
//       host = url.substr(0, i);
//       path = url.substr(i);
//     }
//     this.host = host;
//     this.uri = decodeURI(path);
//   }
//   if (headers === undefined) {
//     this.headers = {};
//   } else {
//     this.headers = headers;
//   }
//   if (body === undefined) {
//     this.body = '';
//   } else {
//     this.body = body;
//   }
// }

// function findHeader(r, header) {
//   for (var k in r.headers) {
//     if (k.toLowerCase() === header.toLowerCase()) {
//       return r.headers[k];
//     }
//   }
//   return null;
// }

// function CanonicalRequest(r, signedHeaders) {
//   var hexencode = findHeader(r, HeaderContentSha256);
//   if (hexencode === null) {
//     var data = RequestPayload(r);
//     hexencode = HexEncodeSHA256Hash(data);
//   }
//   return (
//     r.method +
//     '\n' +
//     CanonicalURI(r) +
//     '\n' +
//     CanonicalQueryString(r) +
//     '\n' +
//     CanonicalHeaders(r, signedHeaders) +
//     '\n' +
//     signedHeaders.join(';') +
//     '\n' +
//     hexencode
//   );
// }

// function CanonicalURI(r) {
//   var pattens = r.uri.split('/');
//   var uri = [];
//   for (var k in pattens) {
//     var v = pattens[k];
//     uri.push(urlEncode(v));
//   }
//   var urlpath = uri.join('/');
//   if (urlpath[urlpath.length - 1] !== '/') {
//     urlpath = urlpath + '/';
//   }
//   //r.uri = urlpath
//   return urlpath;
// }

// function CanonicalQueryString(r) {
//   var keys = [];
//   for (var key in r.query) {
//     keys.push(key);
//   }
//   keys.sort();
//   var a = [];
//   for (var i in keys) {
//     var key = urlEncode(keys[i]);
//     var value = r.query[keys[i]];
//     if (Array.isArray(value)) {
//       value.sort();
//       for (var iv in value) {
//         a.push(key + '=' + urlEncode(value[iv]));
//       }
//     } else {
//       a.push(key + '=' + urlEncode(value));
//     }
//   }
//   return a.join('&');
// }

// function CanonicalHeaders(r, signedHeaders) {
//   var headers = {};
//   for (var key in r.headers) {
//     headers[key.toLowerCase()] = r.headers[key];
//   }
//   var a = [];
//   for (var i in signedHeaders) {
//     var value = headers[signedHeaders[i]];
//     a.push(signedHeaders[i] + ':' + value.trim());
//   }
//   return a.join('\n') + '\n';
// }

// function SignedHeaders(r) {
//   var a = [];
//   for (var key in r.headers) {
//     a.push(key.toLowerCase());
//   }
//   a.sort();
//   return a;
// }

// function RequestPayload(r) {
//   return r.body;
// }

// function StringToSign(canonicalRequest, t) {
//   var bytes = HexEncodeSHA256Hash(canonicalRequest);
//   return Algorithm + '\n' + t + '\n' + bytes;
// }

// function SignStringToSign(stringToSign, signingKey) {
//   return hmacsha256(signingKey, stringToSign);
// }

// function AuthHeaderValue(signature, Key, signedHeaders) {
//   return `${Algorithm} Access=${Key}, SignedHeaders=${signedHeaders.join(
//     ';'
//   )}, Signature=${signature}`;
// }

// function twoChar(s) {
//   if (s >= 10) {
//     return '' + s;
//   } else {
//     return '0' + s;
//   }
// }

// function getTime() {
//   var date = new Date();
//   return (
//     '' +
//     date.getUTCFullYear() +
//     twoChar(date.getUTCMonth() + 1) +
//     twoChar(date.getUTCDate()) +
//     'T' +
//     twoChar(date.getUTCHours()) +
//     twoChar(date.getUTCMinutes()) +
//     twoChar(date.getUTCSeconds()) +
//     'Z'
//   );
// }

// export function Signer() {
//   this.Key = '';
//   this.Secret = '';
// }

// Signer.prototype.Sign = function (r) {
//   var headerTime = findHeader(r, HeaderXDate);
//   if (headerTime === null) {
//     headerTime = getTime();
//     r.headers[HeaderXDate] = headerTime;
//   }
//   if (r.method !== 'PUT' && r.method !== 'PATCH' && r.method !== 'POST') {
//     r.body = '';
//   }
//   var queryString = CanonicalQueryString(r);
//   if (queryString !== '') {
//     queryString = '?' + queryString;
//   }
//   var options = {
//     hostname: r.host,
//     path: encodeURI(r.uri) + queryString,
//     method: r.method,
//     headers: r.headers,
//   };
//   if (findHeader(r, 'host') === null) {
//     r.headers.host = r.host;
//   }
//   var signedHeaders = SignedHeaders(r);
//   var canonicalRequest = CanonicalRequest(r, signedHeaders);
//   var stringToSign = StringToSign(canonicalRequest, headerTime);
//   var signature = SignStringToSign(stringToSign, this.Secret);
//   options.headers[HeaderAuthorization] = AuthHeaderValue(
//     signature,
//     this.Key,
//     signedHeaders
//   );
//   return options;
// };
