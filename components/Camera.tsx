import { CameraCapturedPicture, CameraType, CameraView } from "expo-camera";
import { PropsWithChildren, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

  const takePicture = async () => {
    const photo = await cameraRef.takePictureAsync();
    onPictureSaved(photo);
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
          cameraRef = ref;
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
