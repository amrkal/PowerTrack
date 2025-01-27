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
  Switch,
} from "react-native-paper";

import { useUser } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { AntDesign, MaterialIcons, createIconSetFromFontello } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { colors } from "react-native-elements";
import { Colors } from "@/constants/Colors";
import { useThemeContext } from "../context/ThemeContext";
import { useTheme } from 'react-native-paper';
import axiosInstance from "@/services/axiosInstance";
import { ActionSheetIOS, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";





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
  const theme = useTheme();
  const navigation = useNavigation<any>();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AntDesign
          name="bars"
          size={25}
          color={Colors.dark.primary}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
      ),
      headerLeft: () => null, // Hide the default header
    });
  }, [navigation]);

  
  // Utility Functions
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      Alert.alert("Permissions Required", "Please allow camera and media library access.");
      return false;
    }
    return true;
  };


  const uploadProfileImage = async (imageUri: string): Promise<{ filePath: string } | undefined> => {
    try {
      const formData = new FormData();
  
      // Append the file using the correct format for React Native
      formData.append("profileImage", {
        uri: imageUri,              // Local URI of the image
        name: "profile.jpg",        // The file name (can be dynamic)
        type: "image/jpeg",         // MIME type
      } as any); // Casting to 'any' to avoid TypeScript issues
  
      const response = await axiosInstance.post("/users/profileImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        console.log("Upload successful:", response.data);
        return response.data; // { filePath: 'http://your-backend/uploads/filename.jpg' }
      } else {
        console.error("Upload failed:", response.data);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  
  
  
  

  const handleChoosePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ["Take Photo", "Choose from Library", "Cancel"], cancelButtonIndex: 2 },
        async (buttonIndex) => {
          if (buttonIndex === 0) await launchCamera();
          if (buttonIndex === 1) await launchImageLibrary();
        }
      );
    } else {
      Alert.alert("Select Option", "Choose a photo source", [
        { text: "Camera", onPress: launchCamera },
        { text: "Gallery", onPress: launchImageLibrary },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };
  

  const launchCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await uploadProfileImage(uri);
    }
  };

  const launchImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.2,
    });
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri); // Preview the image
      await uploadProfileImage(uri); // Upload to backend
    }
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
            uri:  "https://i.pinimg.com/originals/07/33/ba/0733ba760b29378474dea0fdbcb97107.png",
            // profileImage  ||
          }}
        />
        <TouchableOpacity
          style={GlobalStyles.profileEditIcon}
          onPress={handleChoosePhoto}
        >
          <AntDesign name="camera" size={24} color={Colors.dark.primary} />
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
            <AntDesign name="calendar" size={25} color={theme.colors.primary}  />
            <Text style= {GlobalStyles.settingsItemText}>היסטוריית הזמנות</Text>
          </TouchableOpacity>
          <Divider />

          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={() => router.push("/Profile/ReturnsPage")}
          >
            <AntDesign name="retweet" size={25} color={theme.colors.primary} />
            <Text style= {GlobalStyles.settingsItemText}>החזרות</Text>
          </TouchableOpacity>
          <Divider />

          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={() => router.push("/Profile/PrivacyPolicyPage")}
          >
            <AntDesign name="filetext1" size={25} color={theme.colors.primary}  />
            <Text style= {GlobalStyles.settingsItemText}>מדיניות פרטיות</Text>
          </TouchableOpacity>
          <Divider />

          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={() => router.push("/Profile/PrivacySettingsPage")}
          >
            <AntDesign name= "lock" size={25} color={theme.colors.primary} />
            <Text style= {GlobalStyles.settingsItemText}>הגדרות פרטיות</Text>
          </TouchableOpacity>
          <Divider />


          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={toggleDarkMode}
          >
            <AntDesign
              name={(isDarkMode ? "star" : "bulb1") as keyof typeof AntDesign.glyphMap}
              size={25}
              color={theme.colors.primary}
            />
            <Text style= {GlobalStyles.settingsItemText}>
              מצב כהה: {isDarkMode ? "פועל" : "כבוי"}
            </Text>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
          </TouchableOpacity>
          <Divider />

          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={() =>
              changeLanguage(language === "עברית" ? "English" : "עברית")
            }
          >
            <AntDesign name="earth" size={25} color={theme.colors.primary}  />
            <Text style= {GlobalStyles.settingsItemText}>שפה: {language}</Text>
          </TouchableOpacity>
          <Divider />

          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={handleLogout}
          >
            <AntDesign name="logout" size={25} color={theme.colors.primary}  />
            <Text style= {GlobalStyles.settingsItemText}>התנתק</Text>
          </TouchableOpacity>
          <Divider />
        </View>
      )}
    </ScrollView>

  );
};



export default ProfilePage;
