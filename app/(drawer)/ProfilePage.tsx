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
  
  const handleProfileImageEdit = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("הרשאה נדחתה", "נא לאפשר גישה לתמונות שלך.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setProfileImage(result.assets[0].uri);
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
        profileImage,
      };
  
      // Save to the backend without updating the global context
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
          onPress={handleProfileImageEdit}
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
            onPress={() => router.push("../Profile/OrderHistoryPage")}
          >
            <IconButton icon="history" />
            <Text variant="titleMedium">היסטוריית הזמנות</Text>
          </TouchableOpacity>
          <Divider />


          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={() => router.push("../Profile/PrivacyPolicyPage")}
          >
            <IconButton icon="file-document" />
            <Text variant="titleMedium">מדיניות פרטיות</Text>
          </TouchableOpacity>
          <Divider />

          <TouchableOpacity
            style={GlobalStyles.settingsItem}
            onPress={() => router.push("../Profile/PrivacySettingsPage")}
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
              style={{ marginLeft: "auto" }}
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
