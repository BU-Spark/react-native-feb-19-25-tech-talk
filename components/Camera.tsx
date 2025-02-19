import { CameraCapturedPicture, CameraType, CameraView } from "expo-camera";
import { PropsWithChildren, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from 'expo-file-system';

type Props = PropsWithChildren<{
  lastPhotosURI: string[];
  setLastPhotosURI: (lastPhotosURI: string[]) => void;
}>;

export function Camera({ lastPhotosURI, setLastPhotosURI }: Props) {
  const [facing, setFacing] = useState<CameraType>("back");
  let cameraRef: CameraView;

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const logImageFileSize = async (uri: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        const fileSizeMB = fileInfo.size ? fileInfo.size / (1024 * 1024) : 0;
        console.log(`Image size: ${fileSizeMB.toFixed(2)} MB`);
      } else {
        console.warn('File does not exist at the given URI.');
      }
    } catch (error) {
      console.error('Error fetching file info:', error);
    }
  };

  const takePicture = async () => {
    const photo = await cameraRef.takePictureAsync(
      { quality: 0.1 },
    );
    if (photo) {
      // I want to log the size of the photo in mb. i only have base64 and uri strings of photos
      if (photo.base64) console.log("photo size in mb: ", photo.base64.length / 1024 / 1024);
      else if (photo.uri) logImageFileSize(photo.uri);
      else console.log("size not found");
      onPictureSaved(photo);
    }
    else console.log("No photo taken");
  };

  const onPictureSaved = (photo: CameraCapturedPicture) => {
    setLastPhotosURI(
      lastPhotosURI.length > 2
        ? [...lastPhotosURI.slice(1, 3), photo.uri]
        : [...lastPhotosURI, photo.uri],
    );
  };

  return (
    <View>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={(ref) => {
          if (ref) cameraRef = ref;
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <Button title="Take Photo" onPress={takePicture} />
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    height: 290,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
