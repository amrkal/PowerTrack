import React, { useState } from "react";
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
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { GlobalStyles } from "@/constants/GlobalStyles";

const ProfilePage: React.FC = () => {
  const { user, updateProfileData } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  // Profile Fields
  const [name, setName] = useState(user.name);
  const [familyName, setFamilyName] = useState(user.familyName);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number);
  const [profileImage, setProfileImage] = useState(user.profileImage);

  const handleProfileImageEdit = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Please allow access to your photos.");
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
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
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
          <IconButton icon="camera" size={10} />
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
          Edit Profile
        </Button>
      </View>
    </View>


      {/* Profile Edit View */}
      {isEditing && (
        <View>
          <Text variant="titleLarge">Edit Profile</Text>
          <TextInput
            label="First Name"
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={GlobalStyles.authInput}
          />
          <TextInput
            label="Last Name"
            mode="outlined"
            value={familyName}
            onChangeText={setFamilyName}
            style={GlobalStyles.authInput}
          />
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={GlobalStyles.authInput}
            keyboardType="email-address"
          />
          <TextInput
            label="Phone Number"
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
            Save Changes
          </Button>
        </View>
      )}

      {/* Settings Section */}
      {!isEditing && (
        <View>
          <TouchableOpacity style={GlobalStyles.settingsItem} onPress={() => router.push('/OrderHistoryPage')}>
            <IconButton icon="calendar" />
            <Text variant="titleMedium">order history</Text>
            
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity style={GlobalStyles.settingsItem}>
            <IconButton icon="logout" />
            <Text variant="titleMedium" onPress={handleLogout}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default ProfilePage;