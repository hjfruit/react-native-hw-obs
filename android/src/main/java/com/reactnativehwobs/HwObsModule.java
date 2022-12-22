package com.reactnativehwobs;

import androidx.annotation.NonNull;

import java.io.*;
import java.net.*;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.obs.services.ObsClient;
import com.obs.services.ObsConfiguration;
import com.obs.services.model.UploadFileRequest;
import com.obs.services.model.CompleteMultipartUploadResult;
import com.obs.services.model.ProgressListener;
import com.obs.services.model.ProgressStatus;
import com.obs.services.exception.ObsException;


@ReactModule(name = HwObsModule.NAME)
public class HwObsModule extends ReactContextBaseJavaModule {
    public static final String NAME = "HwObs";
    private static ObsClient obsClient;
    private ReactApplicationContext context;
    private static StringBuffer stringBuffer;

    public HwObsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        stringBuffer = new StringBuffer();
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void initWithSecurityToken(String securityToken, String accessKeyId, String accessKeySecret, String endPoint) {
        ObsConfiguration config = new ObsConfiguration();
        config.setSocketTimeout(30000);
        config.setConnectionTimeout(10000);
        config.setEndPoint(endPoint);
        obsClient = new ObsClient(accessKeyId, accessKeySecret, securityToken, config);
    }

    @ReactMethod
    public void upload(String bucketname, String objectname, String localfile, final Promise promise) {
        try {
            UploadFileRequest request = new UploadFileRequest(bucketname, objectname);
            URL fileURL = new URL(localfile);
            File uploadFile = new File(new URL(localfile).toURI());
            request.setUploadFile(uploadFile.getPath());
            request.setTaskNum(5);
            request.setPartSize(1024 * 1024);
            request.setEnableCheckpoint(true);

            request.setProgressListener(new ProgressListener() {
                @Override
                public void progressChanged(ProgressStatus progressStatus) {
                    long currentSize = progressStatus.getTransferredBytes();
                    long totalSize = progressStatus.getTotalBytes();
                    String str_currentSize = Long.toString(currentSize);
                    String str_totalSize = Long.toString(totalSize);
                    WritableMap onProgressValueData = Arguments.createMap();
                    onProgressValueData.putString("currentSize", str_currentSize);
                    onProgressValueData.putString("totalSize", str_totalSize);
                    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("uploadProgress", onProgressValueData);
                }
            });

            CompleteMultipartUploadResult result = obsClient.uploadFile(request);
            promise.resolve(result.getObjectUrl());
        } catch (ObsException e) {
            if (e != null) {
                e.printStackTrace();
                stringBuffer.append("\n\n");
                stringBuffer.append("Response Code:" + e.getResponseCode())
                    .append("\n\n")
                    .append("Error Message:" + e.getErrorMessage())
                    .append("\n\n")
                    .append("Error Code:" + e.getErrorCode())
                    .append("\n\n")
                    .append("Request ID:" + e.getErrorRequestId())
                    .append("\n\n")
                    .append("Host ID:" + e.getErrorHostId());
                promise.reject(stringBuffer.toString());
            }
        } catch (MalformedURLException e) {
            if (e != null) {
                e.printStackTrace();
                promise.reject(e);
            }
        } catch (URISyntaxException e) {
            if (e != null) {
                e.printStackTrace();
                promise.reject(e);
            }
        } catch (Exception e) {
            stringBuffer.append("\n\n");
            stringBuffer.append(e.getMessage());
            promise.reject(stringBuffer.toString());
        } finally {
            if (obsClient != null) {
                try {
                    obsClient.close();
                } catch (IOException e){}
            }
        }
    }
}
