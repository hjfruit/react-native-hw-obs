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
const ak = 'U6771BW7B1QDD78UB1NX';
const sk = 'HH64iAxMDK5iSTeHTsWNt1H7CPtGBGPWWEU6HTC9';
const st =
  'gg5jbi1zb3V0aHdlc3QtMkuYeyJhY2Nlc3MiOiJVNjc3MUJXN0IxUURENzhVQjFOWCIsIm1ldGhvZHMiOlsidG9rZW4iXSwicG9saWN5Ijp7IlZlcnNpb24iOiIxLjEiLCJTdGF0ZW1lbnQiOlt7IkFjdGlvbiI6WyJvYnM6b2JqZWN0OioiXSwiUmVzb3VyY2UiOlsib2JzOio6KjpvYmplY3Q6KiJdLCJFZmZlY3QiOiJBbGxvdyJ9XX0sInJvbGUiOltdLCJyb2xldGFnZXMiOltdLCJ0aW1lb3V0X2F0IjoxNjcyMDQ0OTk4NDkwLCJ1c2VyIjp7ImRvbWFpbiI6eyJpZCI6IjBhZDEzZjU0MjUwMDBmMjYwZjMyYzAwMGJkMmFkMDAwIiwibmFtZSI6Imh3ODAwMTM5OTkifSwiaWQiOiIwYWQxM2Y1NTJlODBmNTM3MWZlOGMwMDA1MGNiMWNkMCIsIm5hbWUiOiJodzgwMDEzOTk5IiwicGFzc3dvcmRfZXhwaXJlc19hdCI6IiJ9fWZ0_p5sTU6LA6MM37A9WnMNmHQUzg94GWw1Xu9_NWto-SY3NI0PbZ7_Qb0yy8Yk7_84ctqbiMUpWMjNVr1QI5KCQkPkpXX5T0o7bPLpsizP_1Mak0V3R3B_P_sAEXo5unO7qv4mNPbnDtrGOY3hGChjUm_CxbayUZCn5GrztigeCy1TvEySiY-nqh1TxVhGZi531Oom_qu1LeJJnbLnhcnYWveGZ4eBUBP8P5zTid6BRxPdJdcAin71fFNYGJ3I02vKBTkewWGtBAmmxuSMyB7cVEVs9x6jfYEiCpyscbnxi0TFWL5iFvxTNeLgj1o7PUrsL2SGrbbeS7L9R3ez-Ek=';

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
