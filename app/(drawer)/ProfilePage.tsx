import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { GlobalStyles } from '../../constants/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window'); // Get the device's width and height

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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={GlobalStyles.container}>
        <View style={styles.header}>
          <Image
            style={styles.profileImage} 
            source={{ uri: 'https://i.pinimg.com/originals/07/33/ba/0733ba760b29378474dea0fdbcb97107.png' }} // Placeholder demo image
          />
         <IconButton
            icon="pencil"
            size={width > 600 ? 30 : 20} 
            onPress={handleEditProfile}
            style={styles.editIcon} 
            disabled={isEditing}
            iconColor="blue" 
          />
        </View>

        <View style={styles.profileContainer}>
          {isEditing ? (
            <>
              <TextInput
                label="Name"
                mode="outlined"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                label="Family Name"
                mode="outlined"
                value={familyName}
                onChangeText={setFamilyName}
                style={styles.input}
              />
              <TextInput
                label="Email"
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
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

        <View style={styles.buttonsContainer}>
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
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20, 
  },
  header: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: width > 600 ? 200 : 150, 
    height: width > 600 ? 200 : 150, 
    borderRadius: width > 600 ? 100 : 75, 
    borderWidth: 3,
    borderColor: '#1E90FF',
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  profileContainer: {
    width: width > 600 ? '50%' : '90%', 
    alignSelf: 'center', 
  },
  userInfo: {
    fontSize: width > 600 ? 24 : 18, 
    marginVertical: 5,
    color: 'black',
    textAlign: 'center', 
  },
  userEmail: {
    fontSize: width > 600 ? 20 : 16, 
    marginVertical: 5,
    color: 'gray',
    textAlign: 'center', 
  },
  input: {
    marginVertical: 8,
    backgroundColor: 'white',
    height: width > 600 ? 60 : 50, 
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    width: width > 600 ? '50%' : '90%', 
    alignSelf: 'center',
    marginTop: 20,
  },
  editButton: {
    marginVertical: 10,
    paddingVertical: width > 600 ? 15 : 10, 
  },
  saveButton: {
    marginVertical: 10,
    backgroundColor: 'green',
    paddingVertical: width > 600 ? 15 : 10, 
  },
  logoutButton: {
    marginVertical: 10,
    backgroundColor: 'red',
    paddingVertical: width > 600 ? 15 : 10, 
  },
});

export default ProfilePage;
