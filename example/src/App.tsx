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

export default function App() {
  const [source, setSource] = useState<string>();

  const onUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
      });
      const data = await upload({
        bucketname: '',
        localfile: result.assets?.[0]?.uri || '',
        checkpoint: true,
      });
      console.log(data);
      setSource(data.fileUrl);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    addEventListener(ReactNativeHWObsEvent.uploadProgress, (params) => {
      const { currentSize, totalSize } = params;
      console.log(params);
      console.log(Number(currentSize) / Number(totalSize));
    });
    initWithSecurityToken({
      securityToken: '',
      accessKey: '',
      secretKey: '',
      endPoint: '',
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
