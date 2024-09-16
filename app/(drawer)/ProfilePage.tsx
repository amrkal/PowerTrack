import React, { useState } from 'react';
import { View, Image, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { GlobalStyles } from '../../constants/GlobalStyles';
import { useUser } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerResult, ImagePickerAsset } from 'expo-image-picker';
import { router } from 'expo-router';


const ProfilePage: React.FC = () => {
  const { user, updateProfileData } = useUser(); // Get user and updateProfileData from context
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(user.name);
  const [familyName, setFamilyName] = useState<string>(user.familyName);
  const [email, setEmail] = useState<string>(user.email);
  const [city, setCity] = useState<string>(user.city);
  const [zipCode, setZipCode] = useState<string>(user.zip_code);
  const [address, setAddress] = useState<string>(user.address);
  const [profileImage, setProfileImage] = useState<string>(user.profileImage); // Handle profile image

  const handleSaveProfile = async () => {
    const updatedUser = { ...user, name, familyName, email, city, zip_code: zipCode, address, profileImage };
    await updateProfileData(updatedUser);
    setIsEditing(false); // Stay on profile page after saving
  };

  const handleLogout = async () => {
    await AsyncStorage.clear(); // Clear user data from storage
    router.push('/Authentication/LoginPage'); // Redirect to login page
  };

  // Function to select image from gallery or take a new one
  const handleProfileImageEdit = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to allow access to your photos to update the profile picture.');
      return;
    }

    const options = ['Pick from Gallery', 'Take a New Photo', 'Cancel'];
    const choice = await new Promise<string>((resolve) => {
      Alert.alert('Profile Picture', 'Choose an option', [
        { text: options[0], onPress: () => resolve(options[0]) },
        { text: options[1], onPress: () => resolve(options[1]) },
        { text: options[2], onPress: () => resolve(options[2]) },
      ]);
    });

    let result: ImagePickerResult;
    
    if (choice === options[0]) {
      // Open the image library
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else if (choice === options[1]) {
      // Open the camera
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      return; // Cancel was selected
    }

    // Handle successful image picking
    if (!result.canceled && result.assets) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri); // Update profile picture with the selected image's URI
    }
  };

  return (
    <ScrollView contentContainerStyle={GlobalStyles.scrollContainer}>
      <View style={GlobalStyles.container}>
        <View style={GlobalStyles.header}>
          <Image
            style={GlobalStyles.profileImage}
            source={{
              uri: profileImage || 'https://i.pinimg.com/originals/07/33/ba/0733ba760b29378474dea0fdbcb97107.png', // Default image if no profile picture is set
            }}
          />
          <IconButton
            icon="camera"
            onPress={handleProfileImageEdit} // Handle profile image editing
            style={GlobalStyles.editIcon}
            disabled={isEditing}
            iconColor="blue"
          />
        </View>

        <View style={GlobalStyles.profileContainer}>
          {isEditing ? (
            <>
              <TextInput label="Name" mode="outlined" value={name} onChangeText={setName} style={GlobalStyles.input} />
              <TextInput
                label="Family Name"
                mode="outlined"
                value={familyName}
                onChangeText={setFamilyName}
                style={GlobalStyles.input}
              />
              <TextInput label="Email" mode="outlined" value={email} onChangeText={setEmail} style={GlobalStyles.input} />
              <TextInput label="City" mode="outlined" value={city} onChangeText={setCity} style={GlobalStyles.input} />
              <TextInput
                label="Zip Code"
                mode="outlined"
                value={zipCode}
                onChangeText={setZipCode}
                style={GlobalStyles.input}
                keyboardType="numeric"
              />
              <TextInput label="Address" mode="outlined" value={address} onChangeText={setAddress} style={GlobalStyles.input} />
            </>
          ) : (
            <>
              <Text style={GlobalStyles.userInfo}>{name}</Text>
              <Text style={GlobalStyles.userInfo}>{familyName}</Text>
              <Text style={GlobalStyles.userEmail}>{email}</Text>
              <Text style={GlobalStyles.userInfo}>City: {city}</Text>
              <Text style={GlobalStyles.userInfo}>Zip Code: {zipCode}</Text>
              <Text style={GlobalStyles.userInfo}>Address: {address}</Text>
            </>
          )}
        </View>

        <View style={GlobalStyles.buttonsContainer}>
          {isEditing ? (
            <Button mode="contained" onPress={handleSaveProfile} style={GlobalStyles.saveButton}>
              Save
            </Button>
          ) : (
            <Button mode="outlined" onPress={() => setIsEditing(true)} style={GlobalStyles.editButton}>
              Edit Profile
            </Button>
          )}
          <Button mode="outlined" onPress={handleLogout} style={GlobalStyles.logoutButton}>
            Log out
          </Button>
          <Button mode="contained" onPress={() => router.push('/OrderHistoryPage')} style={GlobalStyles.historyButton}>
            View Order History
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
