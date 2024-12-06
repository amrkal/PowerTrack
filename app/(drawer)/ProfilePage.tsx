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



  const handleLogout = async () => {
    await AsyncStorage.clear(); // Clear user data from storage
    router.push('/Authentication/LoginPage'); // Redirect to login page
  };

  const handleProfileImageEdit = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('אין הרשאה', 'עליך לאשר גישה לתמונות שלך כדי לעדכן את תמונת הפרופיל.');
      return;
    }

    const options = ['בחר מהגלריה', 'צלם תמונה חדשה', 'ביטול'];
    const choice = await new Promise<string>((resolve) => {
      Alert.alert('תמונת פרופיל', 'בחר אפשרות', [
        { text: options[0], onPress: () => resolve(options[0]) },
        { text: options[1], onPress: () => resolve(options[1]) },
        { text: options[2], onPress: () => resolve(options[2]) },
      ]);
    });

    let result: ImagePickerResult;
    
    if (choice === options[0]) {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else if (choice === options[1]) {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      return; // Cancel was selected
    }

    if (!result.canceled && result.assets) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
    }
  };

  
  const handleSaveProfile = async () => {
    const updatedUser = { ...user, name, familyName, email, city, zip_code: zipCode, address, profileImage };
    await updateProfileData(updatedUser);
    setIsEditing(false); // Exit editing mode
    // No need for navigation; the component will render the initial state
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
          {!isEditing && (
            <IconButton
              icon="camera"
              onPress={handleProfileImageEdit}
              style={GlobalStyles.editIcon}
              iconColor="blue"
            />
          )}
        </View>
  
        <View style={GlobalStyles.profileContainer}>
          {isEditing ? (
            <>
              <TextInput label="שם פרטי" mode="flat" value={name} onChangeText={setName}  />
              <TextInput label="שם משפחה" mode="flat" value={familyName} onChangeText={setFamilyName}/>
              <TextInput label="אימייל" mode="flat" value={email} onChangeText={setEmail}  />
              <TextInput label="עיר" mode="flat" value={city} onChangeText={setCity}  />
              <TextInput label="מיקוד" mode="flat" value={zipCode} onChangeText={setZipCode} keyboardType="numeric"/>
              <TextInput label="כתובת" mode="flat" value={address} onChangeText={setAddress} />
            </>
          ) : (
            <>
              <Text style={GlobalStyles.userInfo}>{name}</Text>
              <Text style={GlobalStyles.userInfo}>{familyName}</Text>
              <Text style={GlobalStyles.userEmail}>{email}</Text>
              <Text style={GlobalStyles.userInfo}>עיר: {city}</Text>
              <Text style={GlobalStyles.userInfo}>מיקוד: {zipCode}</Text>
              <Text style={GlobalStyles.userInfo}>כתובת: {address}</Text>
            </>
          )}
        </View>
  
        <View style={GlobalStyles.buttonsContainer}>
          {isEditing ? (
            <Button
              mode="outlined"
              onPress={handleSaveProfile}
            >
              שמור
            </Button>
          ) : (
            <>
              <Button mode="outlined" onPress={() => setIsEditing(true)} style={GlobalStyles.editButton}>
                ערוך פרופיל
              </Button>
              <Button mode="outlined" onPress={handleLogout} style={GlobalStyles.logoutButton}>
                התנתק
              </Button>
              <Button mode="contained" onPress={() => router.push('/OrderHistoryPage')} style={GlobalStyles.historyButton}>
                היסטוריית הזמנות
              </Button>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
  
};

export default ProfilePage;
