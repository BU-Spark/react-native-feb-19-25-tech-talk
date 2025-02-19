import { Image, StyleSheet, Platform, View, Button, Text, TouchableOpacity, Alert } from "react-native";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { useCameraPermissions } from "expo-camera";
import { Camera } from "@/components/Camera";
import { Footer } from "@/components/Footer";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD4LOnTg21X0IKsh2Ab7bM32HtcCzPrWz8",
  authDomain: "se-asad-is-special.firebaseapp.com",
  projectId: "se-asad-is-special",
  storageBucket: "se-asad-is-special.appspot.com",
  messagingSenderId: "445933065747",
  appId: "1:445933065747:web:4177f3ecf5ae91cf4791e6"
};

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [lastPhotosURI, setLastPhotosURI] = useState<string[]>([]);

  const app = initializeApp(firebaseConfig);


  const uploadImageToFirebase = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob(); // Convert local URI to Blob

      const storage = getStorage();
      const fileName = `image_${Date.now()}.jpg`; // Generate a unique name
      const storageRef = ref(storage, `images/${fileName}`);

      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      console.log("File uploaded successfully:", downloadURL);
      setLastPhotosURI((prevURIs) => prevURIs.filter((item) => item !== uri));
      Alert.alert("Success", "Photo uploaded successfully.");
      return downloadURL; // Return the download URL
    } catch (error : any) {
      Alert.alert("Upload Failed", `Photo not uploaded: ${error.message || error}`);
      console.error("Error uploading image:", error);
      return null;
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          Welcome to the React Native Tech Talk!
        </ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">How we made this app</ThemedText>
        <ThemedText>
          This app was built using the template on the Expo website:
          https://docs.expo.dev/tutorial/create-your-first-app/{" "}
        </ThemedText>
        <ThemedText>
          Next we installed expo-camera, a package that allows you to access the
          camera on the device that is running the app. Then we made edits to
          the content on the pages in each tab so you can see what React Native
          and Expo can do!
        </ThemedText>
        <ThemedText>
          We have creted two components for you to see how you can create
          reusable elements that take in Props that allow them to share data and
          dynamically update: Camera and Footer. For Camera, we share an array
          and method that allows us to record the location of the photos taken
          with the camera that we can then use in the page that creates the
          Camera component. For Footer, we pass in two props: textColor and
          backgroundColor. Update these values in app/(tabs)/index.tsx and
          app/(tabs)/explore.tsx to see how props can help us customize
          components!
        </ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. To access developer tools{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "press cmd + d on a simulator or shake your device.",
              android: "press cmd + m on a simulator or shake your device.",
              web: "press F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Using your camera</ThemedText>
        <ThemedText>
          We are accessing your camera using expo-camera which also handles
          camera permissions. Pictures are saved to your local cache and we can
          access them to show you the last photos you've taken.
        </ThemedText>
      </ThemedView>
      <Camera
        lastPhotosURI={lastPhotosURI}
        setLastPhotosURI={setLastPhotosURI}
      ></Camera>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Last 3 photos you've taken:</ThemedText>
        {lastPhotosURI.length > 0 ? (
          lastPhotosURI.map((lastPhotoURI: string) => {
            return (
              <View key={lastPhotoURI}>
                <Image
                  source={{ uri: lastPhotoURI }}
                  style={styles.lastPhoto}
                />
                {lastPhotoURI && <TouchableOpacity style={styles.button} onPress={()=>uploadImageToFirebase(lastPhotoURI)}>
                  <Text style={styles.text}>Send Picture to Spark</Text>
                </TouchableOpacity>}
              </View>
            );
          })
        ) : (
          <ThemedText>
            Take a photo using the Take Photo button to see the picture
            here!{" "}
          </ThemedText>
        )}
      </ThemedView>
      <Footer textColor="blue" backgroundColor="white" />
    </ParallaxScrollView>
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 290,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  lastPhoto: {
    height: 290,
    bottom: 0,
    left: 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
