import * as React from 'react';
import { useState } from 'react';

import { StyleSheet, View, Button, Text, SafeAreaView } from 'react-native';
import {
  addEventListener,
  initWithSecurityToken,
  ReactNativeHWObsEvent,
  upload,
} from 'react-native-hw-obs';
import { launchImageLibrary } from 'react-native-image-picker';

const bucketName = 'fruits-public';
const endPoint = 'obs.cn-southwest-2.myhuaweicloud.com';
const ak = 'KUQMDDIRO00SFNRCO572';
const sk = 'Cx4j8RxY3uMoznqcj6w3BLp3iyunw9TaJrQobXJe';
const st =
  'gg5jbi1zb3V0aHdlc3QtMkuUeyJhY2Nlc3MiOiJLVVFNRERJUk8wMFNGTlJDTzU3MiIsIm1ldGhvZHMiOlsidG9rZW4iXSwicG9saWN5Ijp7IlZlcnNpb24iOiIxLjEiLCJTdGF0ZW1lbnQiOlt7IkFjdGlvbiI6WyJvYnM6b2JqZWN0OioiXSwiUmVzb3VyY2UiOlsib2JzOio6KjpvYmplY3Q6KiJdLCJFZmZlY3QiOiJBbGxvdyJ9XX0sInJvbGUiOltdLCJyb2xldGFnZXMiOltdLCJ0aW1lb3V0X2F0IjoxNjcxNzA1OTc2NDAwLCJ1c2VyIjp7ImRvbWFpbiI6eyJpZCI6IjBhZDEzZjU0MjUwMDBmMjYwZjMyYzAwMGJkMmFkMDAwIiwibmFtZSI6Imh3ODAwMTM5OTkifSwiaWQiOiIwYWQxM2Y1NTJlODBmNTM3MWZlOGMwMDA1MGNiMWNkMCIsIm5hbWUiOiJodzgwMDEzOTk5IiwicGFzc3dvcmRfZXhwaXJlc19hdCI6IiJ9fRUGHNhcekLxfBHtlSwnxDtp5mTNaZ6lYtXjiGCUx9rLrTVhwQjCIKV-LyHTdfHmBXoG2wu4ER1xTZY2GyThcKe2IvjTOlfj5k9VFdU70u-UcRMEAISRklBsCmSgE1pqdGkO-slQ8M_bHbazyfwY7lesk4pAocldnc5gmFzseCp_xfmDCbXj4ra5vYQ1yD8nomNBCDEtMNzVkpVEERpHVV3xSSmxKVdTsoB2xLrA_Y5oAT16qnMFNSy8Wgovfy0pgHOUpGmNDXVRbXWCKDeX5HCJOCUIBndyXv2GgdCQRt38Zl4Ov3cfZxVsVxXmRu4ESxR4G2QgOvMzTitkkn7i6og=';

export default function App() {
  const [source, setSource] = useState<string>();

  const onUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'mixed',
      });
      const data = await upload({
        bucketName,
        localFile: result.assets?.[0]?.uri || '',
      });
      console.log(data);
      const fileUrl = data.fileUrl;
      setSource(`https://${fileUrl}`);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    initWithSecurityToken({
      securityToken: st,
      accessKey: ak,
      secretKey: sk,
      endPoint,
    });
    addEventListener(ReactNativeHWObsEvent.uploadProgress, (params) => {
      const { currentSize, totalSize } = params;
      console.log(params);
      console.log(Number(currentSize) / Number(totalSize));
    });
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Button title="上传" onPress={onUpload}></Button>
        <Text>{source}</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
