#import "HwObs.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNHwObsSpec.h"
#endif

@implementation HwObs
RCT_EXPORT_MODULE()

- (void)startObserving {
    _hasListeners = YES;
}

- (void)stopObserving {
    _hasListeners = NO;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"uploadProgress", @"downloadProgress"];
}

RCT_EXPORT_METHOD(initWithSecurityToken:(NSString *)securityToken
                  accessKey:(NSString *)accessKey
                  secretKey:(NSString *)secretKey
                  endPoint:(NSString *)endPoint) {
    // 初始化身份验证
    OBSStaticCredentialProvider *credentialProvider = [[OBSStaticCredentialProvider alloc] initWithAccessKey:accessKey secretKey:secretKey];
    credentialProvider.securityToken = securityToken;
    // 初始化服务配置
    OBSServiceConfiguration *conf = [[OBSServiceConfiguration alloc] initWithURLString:endPoint credentialProvider:credentialProvider];
    // 初始化
    _client  = [[OBSClient alloc] initWithConfiguration:conf];
}

RCT_EXPORT_METHOD(upload:(NSString *)bucketname
                  objectname:(NSString *)objectname
                  localfile:(NSString *)localfile
                  checkpoint:(BOOL *)checkpoint
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    _client.configuration.maxConcurrentUploadRequestCount = 5;
    _client.configuration.uploadSessionConfiguration.HTTPMaximumConnectionsPerHost = 10;

    NSURL *localUrl = [NSURL URLWithString:localfile];

    OBSUploadFileRequest *request = [[OBSUploadFileRequest alloc]initWithBucketName:bucketname objectKey:objectname uploadFilePath:localUrl.path];
    request.partSize = [NSNumber numberWithInteger: 1024*1024];
    request.enableCheckpoint = *(checkpoint);

    request.uploadProgressBlock = ^(int64_t bytesSent, int64_t totalBytesSent, int64_t totalBytesExpectedToSend) {
        if (self.hasListeners) {
            [self sendEventWithName:@"uploadProgress" body:@{
                @"currentSize": [NSString stringWithFormat:@"%lld",totalBytesSent],
                @"totalSize": [NSString stringWithFormat:@"%lld",totalBytesExpectedToSend]}];
        }
    };

    OBSBFTask *task = [_client uploadFile:request completionHandler:^(OBSUploadFileResponse *response, NSError *error) {
        if (!error) {
            resolve(@"success");
        } else {
            reject(@"Error", error.localizedDescription, error);
        }
    }];
}


// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeHwObsSpecJSI>(params);
}
#endif

@end
