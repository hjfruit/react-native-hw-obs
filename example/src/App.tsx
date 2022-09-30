import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import { initWithSecurityToken, upload } from 'react-native-hw-obs';
import { launchImageLibrary } from 'react-native-image-picker';

export default function App() {
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
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    initWithSecurityToken({
      securityToken: '',
      accessKey: '',
      secretKey: '',
      endPoint: '',
    });
  }, []);

  return (
    <View style={styles.container}>
      <Button title="上传" onPress={onUpload}></Button>
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
