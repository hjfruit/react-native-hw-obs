#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <OBS/OBS.h>

@interface HwObs : RCTEventEmitter <RCTBridgeModule>

@property OBSClient *client;
@property OBSServiceConfiguration *clientConfiguration;
@property bool hasListeners;

@end
