import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { GlobalStyles } from '../../constants/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>('John Doe');
  const [familyName, setFamilyName] = useState<string>('Doe');
  const [email, setEmail] = useState<string>('johndoe@example.com');

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.push('/Authentication/LoginPage');
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save updated profile information to the backend or AsyncStorage
  };


  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <Image
          style={styles.profileImage} // Responsive profile image
          source={{ uri: 'https://i.pinimg.com/originals/07/33/ba/0733ba760b29378474dea0fdbcb97107.png' }} // Placeholder demo image
        />
        <IconButton
          icon="pencil"
          size={20}
          onPress={handleEditProfile}
          style={styles.editIcon}
          disabled={isEditing}
          iconColor="blue"
        />
      </View>
      
      <View style={GlobalStyles.profileContainer}>
        {isEditing ? (
          <>
            <TextInput
              label="Name"
              mode="outlined"
              value={name}
              onChangeText={setName}
              style={styles.input} // Adjusted style for input
              
            />
            <TextInput
              label="Family Name"
              mode="outlined"
              value={familyName}
              onChangeText={setFamilyName}
              style={styles.input} // Adjusted style for input
            />
            <TextInput
              label="Email"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              style={styles.input} // Adjusted style for input
            />
          </>
        ) : (
          <>
            <Text style={styles.userInfo}>{name}</Text>
            <Text style={styles.userInfo}>{familyName}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </>
        )}
      </View>
      
      <View style={GlobalStyles.buttonsContainer}>
        {isEditing ? (
          <Button mode="contained" onPress={handleSaveProfile} style={styles.saveButton}>
            Save
          </Button>
        ) : (
          <Button mode="outlined" onPress={handleEditProfile} style={styles.editButton}>
            Edit Profile
          </Button>
        )}
        <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
          Log out
        </Button>
        <Button mode="outlined" onPress={() => router.push('/OrderHistoryPage')}>
          Order History
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20, // Ensure proper spacing on smaller devices
  },
  header: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 150, // Responsive width based on screen size
    height: 150, // Keep height the same for a square image
    borderRadius: 75, // Half of width/height to make it circular
    borderWidth: 3,
    borderColor: '#1E90FF',
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  userInfo: {
    fontSize: 20,
    marginVertical: 5,
    color: 'black',
  },
  userEmail: {
    fontSize: 16,
    marginVertical: 5,
    color: 'gray',
  },
  input: {
    marginVertical: 8,
    backgroundColor: 'white',
    height: 50, // Restricting the height of the input
    paddingHorizontal: 10, // Adding padding inside the input for better UI
  },
  editButton: {
    marginVertical: 10,
  },
  saveButton: {
    marginVertical: 10,
    backgroundColor: 'green',
  },
  logoutButton: {
    marginVertical: 10,
    backgroundColor: 'red',
  },
});


export default ProfilePage;
