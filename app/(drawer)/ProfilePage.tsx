import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Avatar,
  Divider,
  IconButton,
  Switch,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { colors } from "react-native-elements";
import { Colors } from "@/constants/Colors";
import { useThemeContext } from "../context/ThemeContext";
import { useTheme } from 'react-native-paper';
import axiosInstance from "@/services/axiosInstance";



const ProfilePage: React.FC = () => {
  const { user, updateProfileData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const { colors } = useTheme();

  // Profile Fields
  const [name, setName] = useState(user.name);
  const [familyName, setFamilyName] = useState(user.familyName);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number);
  const [profileImage, setProfileImage] = useState(user.profileImage);
    // App Preferences
  const { isDarkMode, toggleDarkMode} = useThemeContext();
  const [language, changeLanguage] = useState("עברית");

    
  const navigation = useNavigation<any>();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcons
          name="menu"
          size={30}
          color={Colors.dark.primary}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
      ),
      headerLeft: () => null, // Hide the default header
    });
  }, [navigation]);

  
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
      Alert.alert("Permission Denied", "Please allow access to your camera and media library.");
      return false;
    }
    return true;
  };
  
  
  const uploadProfileImage = async (imageUri: string): Promise<string | null> => {
    console.log("Uploading image URI:", imageUri);
  
    try {
      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error('Failed to fetch the image. Response not OK.');
      }
  
      const blob = await response.blob();
      console.log("Blob created from image:", blob);
  
      // Prepare FormData to send with the request
      const formData = new FormData();
      formData.append("profileImage", blob, "profile.jpg");
  
      // Make the POST request to upload the image without the Authorization header
      const uploadResponse = await axiosInstance.post("/users/profileImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",   // Set content type to multipart/form-data for file upload
        },
      });
  
      // Handle the response from the server
      if (uploadResponse.status === 200 && uploadResponse.data?.filePath) {
        console.log("Image uploaded successfully:", uploadResponse.data.filePath);
        setProfileImage(uploadResponse.data.filePath);  // Update state with the uploaded image URL
        return uploadResponse.data.filePath;
      } else {
        console.error("Error uploading image:", uploadResponse);
        Alert.alert("Error", "Something went wrong during the upload.");
        return null;
      }
    } catch (error) {
      // Log and alert for any errors
      console.error("Error during image upload:", error);
      Alert.alert("Upload Error", "An error occurred while uploading the image.");
      return null;
    }
  };
  
  
  
  
  const handleChoosePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Please allow access to your camera and media library.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
  
    if (result.canceled) return;
  
    const uri = result.assets[0].uri;
    console.log("Picked image URI:", uri);
  
    setProfileImage(uri); // Set the image URI for preview
  
    // Upload the image to the backend
    // const uploadedImageUrl = await uploadProfileImage(uri);
    // if (uploadedImageUrl) {
    //   setProfileImage(uploadedImageUrl); // Set backend image URL after upload
    // }
  };
  
  
  
  
  
  

  const handleSaveProfile = async () => {
    try {
      const updatedUser = {
        ...user, // Keep other user properties
        name,
        familyName,
        email,
        phone_number: phoneNumber,
        profileImage, // The updated image URL from the backend
      };
  
      // Save the updated user to the backend
      await updateProfileData(updatedUser);
  
      // Close editing mode locally
      setIsEditing(false);
  
      // Show success message
      Alert.alert("הצלחה", "הפרופיל עודכן בהצלחה!");
    } catch (error) {
      console.error("שגיאה בעדכון פרופיל:", error);
      Alert.alert("שגיאה", "נכשל בעדכון הפרופיל. נסה שוב.");
    }
  };
  
  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.push("/Authentication/LoginPage");
  };

  return (
    
    <ScrollView contentContainerStyle={GlobalStyles.profileContainer}>
      {/* Header */}
      <View style={GlobalStyles.profileHeader}>
      {/* Avatar Section */}
      <View>
        <Avatar.Image
          size={100}
          source={{
            uri:
              profileImage ||
              "https://i.pinimg.com/originals/07/33/ba/0733ba760b29378474dea0fdbcb97107.png",
          }}
        />
        <TouchableOpacity
          style={GlobalStyles.profileEditIcon}
          onPress={handleChoosePhoto}
        >
          <MaterialIcons name="camera" size={24} color={Colors.dark.primary} />
        </TouchableOpacity>
      </View>

      {/* User Info Section */}
      <View style={GlobalStyles.profileUserName}>
        <Text style={GlobalStyles.profileUserName}>
          {name} {familyName}
        </Text>
        <Text style={GlobalStyles.profileUserName}>{email}</Text>
        <Button
          mode="contained"
          onPress={() => setIsEditing(true)}
        >
          ערוך פרופיל
        </Button>
      </View>
    </View>


      {/* Profile Edit View */}
      {isEditing && (
        <View>
          <Text variant="titleLarge">עריכת פרופיל</Text>
          <TextInput
            label="שם פרטי"
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={GlobalStyles.authInput}
          />
          <TextInput
            label="שם משפחה"
            mode="outlined"
            value={familyName}
            onChangeText={setFamilyName}
            style={GlobalStyles.authInput}
          />
          <TextInput
            label="אימייל"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={GlobalStyles.authInput}
            keyboardType="email-address"
          />
          <TextInput
            label="מספר טלפון"
            mode="outlined"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={GlobalStyles.authInput}
            keyboardType="phone-pad"
          />
          <Button
            mode="contained"
            onPress={handleSaveProfile}
            style={GlobalStyles.profileButton}
          >
            שמור שינויים
          </Button>
        </View>
      )}

      {/* Settings Section */}
      {!isEditing && (
        <View>
          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={() => router.push("/Profile/OrderHistoryPage")}
          >
            <IconButton icon="history" />
            <Text variant="titleMedium">היסטוריית הזמנות</Text>
          </TouchableOpacity>
          <Divider />

          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={() => router.push("/Profile/ReturnsPage")}
          >
            <IconButton icon="history" />
            <Text variant="titleMedium">החזרות</Text>
          </TouchableOpacity>
          <Divider />

          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={() => router.push("/Profile/PrivacyPolicyPage")}
          >
            <IconButton icon="file-document" />
            <Text variant="titleMedium">מדיניות פרטיות</Text>
          </TouchableOpacity>
          <Divider />

          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={() => router.push("/Profile/PrivacySettingsPage")}
          >
            <IconButton icon="security" />
            <Text variant="titleMedium">הגדרות פרטיות</Text>
          </TouchableOpacity>
          <Divider />


          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={toggleDarkMode}
          >
            <IconButton icon={isDarkMode ? "brightness-3" : "brightness-7"} />
            <Text variant="titleMedium">
            מצב כהה: {isDarkMode ? "פועל" : "כבוי"}
            </Text>

            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              style={{ margin: "auto" }}
            />
          </TouchableOpacity>
          <Divider />

          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={() =>
              changeLanguage(language === "עברית" ? "English" : "עברית")
            }
          >
            <IconButton icon="web" />
            <Text variant="titleMedium">שפה: {language}</Text>
          </TouchableOpacity>
          <Divider />

          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={handleLogout}
          >
            <IconButton icon="logout" />
            <Text variant="titleMedium">התנתק</Text>
          </TouchableOpacity>
          <Divider />
        </View>
      )}
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


export default ProfilePage;
