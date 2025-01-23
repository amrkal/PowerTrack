import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Switch, Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

const PrivacySettingsPage: React.FC = () => {
  // State for all settings
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [cameraAccess, setCameraAccess] = useState(false);
  const [photoAccess, setPhotoAccess] = useState(false);
  const [microphoneAccess, setMicrophoneAccess] = useState(false);

  // Load stored settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      setLocationEnabled((await AsyncStorage.getItem('locationEnabled')) === 'true');
      setNotificationsEnabled((await AsyncStorage.getItem('notificationsEnabled')) === 'true');
      setCameraAccess((await AsyncStorage.getItem('cameraAccess')) === 'true');
      setPhotoAccess((await AsyncStorage.getItem('photoAccess')) === 'true');
      setMicrophoneAccess((await AsyncStorage.getItem('microphoneAccess')) === 'true');
    };
    loadSettings();
  }, []);

  // Request permissions for location, camera, and microphone
  const requestPermissions = async () => {
    // Request Location Permission
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    // Request Camera Permission
    const [cameraPermission] = await useCameraPermissions(); // Destructure to access 'status'
    // Request Media Library (Photo) Permission
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();

    // Update state based on the permissions received
    setLocationEnabled(locationStatus === 'granted');
    setCameraAccess(cameraPermission?.status === 'granted');
    setPhotoAccess(mediaStatus === 'granted');
    setMicrophoneAccess(true); // Assuming microphone permission is handled elsewhere
  };

  // Save settings to AsyncStorage
  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('locationEnabled', locationEnabled.toString());
      await AsyncStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
      await AsyncStorage.setItem('cameraAccess', cameraAccess.toString());
      await AsyncStorage.setItem('photoAccess', photoAccess.toString());
      await AsyncStorage.setItem('microphoneAccess', microphoneAccess.toString());

      Alert.alert('Success', 'Privacy settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert('Error', 'There was an issue saving the settings.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Settings</Text>

      {/* Location Settings */}
      <View style={styles.setting}>
        <MaterialIcons name="location-on" size={24} color="#1E3A8A" />
        <Text>Enable Location Access</Text>
        <Switch value={locationEnabled} onValueChange={setLocationEnabled} />
      </View>

      {/* Notifications Settings */}
      <View style={styles.setting}>
        <MaterialIcons name="notifications" size={24} color="#1E3A8A" />
        <Text>Enable Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>

      {/* Camera Settings */}
      <View style={styles.setting}>
        <MaterialIcons name="camera-alt" size={24} color="#1E3A8A" />
        <Text>Enable Camera Access</Text>
        <Switch value={cameraAccess} onValueChange={setCameraAccess} />
      </View>

      {/* Photo Access Settings */}
      <View style={styles.setting}>
        <MaterialIcons name="photo-library" size={24} color="#1E3A8A" />
        <Text>Enable Photo Access</Text>
        <Switch value={photoAccess} onValueChange={setPhotoAccess} />
      </View>

      {/* Microphone Access Settings */}
      <View style={styles.setting}>
        <MaterialIcons name="mic" size={24} color="#1E3A8A" />
        <Text>Enable Microphone Access</Text>
        <Switch value={microphoneAccess} onValueChange={setMicrophoneAccess} />
      </View>

      <Button mode="contained" onPress={saveSettings}>
        Save Settings
      </Button>

      <Button mode="outlined" onPress={requestPermissions}>
        Request Permissions
      </Button>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});

export default PrivacySettingsPage;
