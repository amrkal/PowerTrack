import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';



export const Colors = {
  light: {
    ...DefaultTheme.colors, // Extend the default light theme
    primary: "#ffa64d", // A bold blue for light mode primary
    onPrimary: "#FFFFFF", // White text on primary
    primaryContainer: "#E0F2FE", // Light blue container
    secondary: "#0277BD", // Blue shade for secondary
    onSecondary: "#FFFFFF", // White text on secondary
    background: "#FFFFFF", // White background for light mode
    surface: "#FFFFFF", // White surfaces
    onSurface: "#212121", // Dark text on surface
    error: "#D32F2F", // Strong red for errors
    onError: "#FFFFFF", // White text on error
    surfaceVariant: "#E0E0E0", // Light gray for variant surfaces
    onSurfaceVariant: "#424242", // Dark text for variant surfaces
    outline: "#BDBDBD", // Border color
    inverseSurface: "#212121", // Inverse dark background
    inverseOnSurface: "#E0E0E0", // Inverse light text
    custom: "#ffa64d",
    icon : "#1E3A8A",
  },
  dark: {
    ...DarkTheme.colors, // Extend the default dark theme
    primary: "#1E3A8A", // Deep blue for dark mode primary
    onPrimary: "#FFFFFF", // White text on primary
    primaryContainer: "#1565C0", // Darker blue container
    secondary: "#039BE5", // Bright blue for secondary
    onSecondary: "#E1F5FE", // Light text on secondary
    background: "#121212", // Black background for dark mode
    surface: "#1E1E1E", // Dark gray for surfaces
    onSurface: "#FFFFFF", // White text on surface
    error: "#EF9A9A", // Soft red for errors
    onError: "#8B0000", // Dark red for error text
    surfaceVariant: "#2C2C2C", // Darker variant surface
    onSurfaceVariant: "#E0E0E0", // Light text on variant surfaces
    outline: "#757575", // Light gray for outlines
    inverseSurface: "#E0E0E0", // Light background for inverse
    inverseOnSurface: "#212121", // Dark text on inverse
    icon : "#1E3A8A",
  },
};

export const Color = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#007BFF',
    primaryHover: '#0056b3',
    primaryActive: '#004080',
    primaryDisabled: '#D3D3D3',
    secondary: '#6C757D',
    success: '#28A745',
    successHover: '#218838',
    danger: '#DC3545',
    dangerHover: '#c82333',
    warning: '#FFC107',
    info: '#17A2B8',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#6C757D',
    grayLight: '#E9ECEF',
    grayDark: '#343A40',
    shadowLight: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
    gradientStart: '#007BFF',
    gradientEnd: '#00D4FF',
    gradientDarkStart: '#1A1A1A',
    gradientDarkEnd: '#333333',
    disabled: '#A9A9A9',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#007BFF',
    primaryHover: '#0056b3',
    primaryActive: '#004080',
    secondary: '#6C757D',
    success: '#28A745',
    successHover: '#218838',
    danger: '#DC3545',
    dangerHover: '#c82333',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#6C757D',
    grayLight: '#343A40',
    grayDark: '#11181C',
    shadowLight: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    gradientStart: '#1A1A1A',
    gradientEnd: '#333333',
  },
};





// import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

// export const Colors = {
//   light: {
//     ...DefaultTheme.colors,  // Extend the default light theme
//     primary: "#0000", // Primary blue color for light mode
//     onPrimary: "#FFFFFF", // Text on primary color (white)
//     primaryContainer: "#E0F2FE", // Light blue container color
//     secondary: "#0277BD", // Secondary color, blue shade
//     onSecondary: "#FFFFFF",
//     background: "#FFFFFF",  // White background for light mode
//     surface: "#FFFFFF",  // White surfaces like cards and sheets
//     onSurface: "#212121",
//     error: "#D32F2F",  // Strong error color
//     onError: "#FFFFFF",
//     // More custom colors
//     surfaceVariant: "#E0E0E0", 
//     onSurfaceVariant: "#424242",
//     outline: "#BDBDBD",
//     inverseSurface: "#212121",
//     inverseOnSurface: "#E0E0E0",

//   },
//   dark: {
//     ...DarkTheme.colors,  // Extend the default dark theme
//     primary: "#1E3A8A", // Primary blue color for dark mode
//     onPrimary: "#FFFFFF", // Text on primary color (white)
//     primaryContainer: "#1565C0", // Darker blue container color
//     secondary: "#039BE5", // Secondary color, blue shade
//     onSecondary: "#E1F5FE",
//     background: "#000",  // Darker background search text
//     surface: "#1E1E1E",  // Darker surfaces
//     onSurface: "#000000",
//     error: "#EF9A9A",  // Softer error color for dark mode
//     onError: "#8B0000",
//     surfaceVariant: "#e3ded8", //background text!
//     onSurfaceVariant: "#E0E0E0",
//     outline: "#757575",
//     inverseSurface: "#E0E0E0",
//     inverseOnSurface: "#212121",
//   }
// };















// import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

// export const Colors = {
//   light: {
//     ...DefaultTheme.colors,  // Extend the default light theme
//     primary: "#FF5722", // Vibrant primary color (orange-red) for electric tools theme
//     onPrimary: "#FFFFFF",
//     primaryContainer: "#FFCCBC", 
//     secondary: "#0277BD", // A blue shade for secondary actions
//     onSecondary: "#FFFFFF",
//     background: "#F5F5F5",  // Neutral background
//     surface: "#FFFFFF",  // Surfaces like cards and sheets
//     onSurface: "#212121",
//     error: "#D32F2F",  // Strong error color
//     onError: "#FFFFFF",
//     // More custom colors
//     surfaceVariant: "#E0E0E0", 
//     onSurfaceVariant: "#424242",
//     outline: "#BDBDBD",
//     inverseSurface: "#212121",
//     inverseOnSurface: "#E0E0E0",
//   },
//   dark: {
//     ...DarkTheme.colors,  // Extend the default dark theme
//     primary: "#FF8A65", // A lighter orange for dark mode
//     onPrimary: "#3E2723",
//     primaryContainer: "#BF360C",
//     secondary: "#039BE5", // A vibrant blue that works on dark surfaces
//     onSecondary: "#E1F5FE",
//     background: "#121212",  // Darker background for electric tools shopping context
//     surface: "#1E1E1E",  // Darker surfaces
//     onSurface: "#E0E0E0",
//     error: "#EF9A9A",  // Softer error color for dark mode
//     onError: "#8B0000",
//     surfaceVariant: "#424242", 
//     onSurfaceVariant: "#E0E0E0",
//     outline: "#757575",
//     inverseSurface: "#E0E0E0",
//     inverseOnSurface: "#212121",
//   }
// };










// export const Colors = {
//     light: {
//       primary: "rgb(176, 46, 0)",
//       onPrimary: "rgb(255, 255, 255)",
//       primaryContainer: "rgb(255, 219, 209)",
//       onPrimaryContainer: "rgb(59, 9, 0)",
//       secondary: "rgb(0, 99, 154)",
//       onSecondary: "rgb(255, 255, 255)",
//       secondaryContainer: "rgb(206, 229, 255)",
//       onSecondaryContainer: "rgb(0, 29, 50)",
//       tertiary: "rgb(121, 89, 0)",
//       onTertiary: "rgb(255, 255, 255)",
//       tertiaryContainer: "rgb(255, 223, 160)",
//       onTertiaryContainer: "rgb(38, 26, 0)",
//       error: "rgb(186, 26, 26)",
//       onError: "rgb(255, 255, 255)",
//       errorContainer: "rgb(255, 218, 214)",
//       onErrorContainer: "rgb(65, 0, 2)",
//       background: "rgb(255, 251, 255)",
//       onBackground: "rgb(32, 26, 24)",
//       surface: "rgb(255, 251, 255)",
//       onSurface: "rgb(32, 26, 24)",
//       surfaceVariant: "rgb(245, 222, 216)",
//       onSurfaceVariant: "rgb(83, 67, 63)",
//       outline: "rgb(133, 115, 110)",
//       outlineVariant: "rgb(216, 194, 188)",
//       shadow: "rgb(0, 0, 0)",
//       scrim: "rgb(0, 0, 0)",
//       inverseSurface: "rgb(54, 47, 45)",
//       inverseOnSurface: "rgb(251, 238, 235)",
//       inversePrimary: "rgb(255, 181, 160)",
//       elevation: {
//         level0: "transparent",
//         level1: "rgb(251, 241, 242)",
//         level2: "rgb(249, 235, 235)",
//         level3: "rgb(246, 229, 227)",
//         level4: "rgb(246, 226, 224)",
//         level5: "rgb(244, 222, 219)",
//       },
//       surfaceDisabled: "rgba(32, 26, 24, 0.12)",
//       onSurfaceDisabled: "rgba(32, 26, 24, 0.38)",
//       backdrop: "rgba(59, 45, 41, 0.4)",
//     },
//     dark: {
//       primary: "rgb(255, 181, 160)",
//       onPrimary: "rgb(96, 21, 0)",
//       primaryContainer: "rgb(135, 33, 0)",
//       onPrimaryContainer: "rgb(255, 219, 209)",
//       secondary: "rgb(150, 204, 255)",
//       onSecondary: "rgb(0, 51, 83)",
//       secondaryContainer: "rgb(0, 74, 117)",
//       onSecondaryContainer: "rgb(206, 229, 255)",
//       tertiary: "rgb(248, 189, 42)",
//       onTertiary: "rgb(64, 45, 0)",
//       tertiaryContainer: "rgb(92, 67, 0)",
//       onTertiaryContainer: "rgb(255, 223, 160)",
//       error: "rgb(255, 180, 171)",
//       onError: "rgb(105, 0, 5)",
//       errorContainer: "rgb(147, 0, 10)",
//       onErrorContainer: "rgb(255, 180, 171)",
//       background: "rgb(32, 26, 24)",
//       onBackground: "rgb(237, 224, 221)",
//       surface: "rgb(32, 26, 24)",
//       onSurface: "rgb(237, 224, 221)",
//       surfaceVariant: "rgb(83, 67, 63)",
//       onSurfaceVariant: "rgb(216, 194, 188)",
//       outline: "rgb(160, 140, 135)",
//       outlineVariant: "rgb(83, 67, 63)",
//       shadow: "rgb(0, 0, 0)",
//       scrim: "rgb(0, 0, 0)",
//       inverseSurface: "rgb(237, 224, 221)",
//       inverseOnSurface: "rgb(54, 47, 45)",
//       inversePrimary: "rgb(176, 46, 0)",
//       elevation: {
//         level0: "transparent",
//         level1: "rgb(43, 34, 31)",
//         level2: "rgb(50, 38, 35)",
//         level3: "rgb(57, 43, 39)",
//         level4: "rgb(59, 45, 40)",
//         level5: "rgb(63, 48, 43)",
//       },
//       surfaceDisabled: "rgba(237, 224, 221, 0.12)",
//       onSurfaceDisabled: "rgba(237, 224, 221, 0.38)",
//       backdrop: "rgba(59, 45, 41, 0.4)",
//     },
//   };


// import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

// export const Colors = {
//   light: {
//     ...DefaultTheme.colors,  // Extend the default light theme
//     primary: "#0000", // Primary blue color for light mode
//     onPrimary: "#FFFFFF", // Text on primary color (white)
//     primaryContainer: "#E0F2FE", // Light blue container color
//     secondary: "#0277BD", // Secondary color, blue shade
//     onSecondary: "#FFFFFF",
//     background: "#FFFFFF",  // White background for light mode
//     surface: "#FFFFFF",  // White surfaces like cards and sheets
//     onSurface: "#212121",
//     error: "#D32F2F",  // Strong error color
//     onError: "#FFFFFF",
//     // More custom colors
//     surfaceVariant: "#E0E0E0", 
//     onSurfaceVariant: "#424242",
//     outline: "#BDBDBD",
//     inverseSurface: "#212121",
//     inverseOnSurface: "#E0E0E0",

//   },
//   dark: {
//     ...DarkTheme.colors,  // Extend the default dark theme
//     primary: "#1E3A8A", // Primary blue color for dark mode
//     onPrimary: "#FFFFFF", // Text on primary color (white)
//     primaryContainer: "#1565C0", // Darker blue container color
//     secondary: "#039BE5", // Secondary color, blue shade
//     onSecondary: "#E1F5FE",
//     background: "#000",  // Darker background search text
//     surface: "#1E1E1E",  // Darker surfaces
//     onSurface: "#000000",
//     error: "#EF9A9A",  // Softer error color for dark mode
//     onError: "#8B0000",
//     surfaceVariant: "#e3ded8", //background text!
//     onSurfaceVariant: "#E0E0E0",
//     outline: "#757575",
//     inverseSurface: "#E0E0E0",
//     inverseOnSurface: "#212121",
//   }
// };















// import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

// export const Colors = {
//   light: {
//     ...DefaultTheme.colors,  // Extend the default light theme
//     primary: "#FF5722", // Vibrant primary color (orange-red) for electric tools theme
//     onPrimary: "#FFFFFF",
//     primaryContainer: "#FFCCBC", 
//     secondary: "#0277BD", // A blue shade for secondary actions
//     onSecondary: "#FFFFFF",
//     background: "#F5F5F5",  // Neutral background
//     surface: "#FFFFFF",  // Surfaces like cards and sheets
//     onSurface: "#212121",
//     error: "#D32F2F",  // Strong error color
//     onError: "#FFFFFF",
//     // More custom colors
//     surfaceVariant: "#E0E0E0", 
//     onSurfaceVariant: "#424242",
//     outline: "#BDBDBD",
//     inverseSurface: "#212121",
//     inverseOnSurface: "#E0E0E0",
//   },
//   dark: {
//     ...DarkTheme.colors,  // Extend the default dark theme
//     primary: "#FF8A65", // A lighter orange for dark mode
//     onPrimary: "#3E2723",
//     primaryContainer: "#BF360C",
//     secondary: "#039BE5", // A vibrant blue that works on dark surfaces
//     onSecondary: "#E1F5FE",
//     background: "#121212",  // Darker background for electric tools shopping context
//     surface: "#1E1E1E",  // Darker surfaces
//     onSurface: "#E0E0E0",
//     error: "#EF9A9A",  // Softer error color for dark mode
//     onError: "#8B0000",
//     surfaceVariant: "#424242", 
//     onSurfaceVariant: "#E0E0E0",
//     outline: "#757575",
//     inverseSurface: "#E0E0E0",
//     inverseOnSurface: "#212121",
//   }
// };










// export const Colors = {
//     light: {
//       primary: "rgb(176, 46, 0)",
//       onPrimary: "rgb(255, 255, 255)",
//       primaryContainer: "rgb(255, 219, 209)",
//       onPrimaryContainer: "rgb(59, 9, 0)",
//       secondary: "rgb(0, 99, 154)",
//       onSecondary: "rgb(255, 255, 255)",
//       secondaryContainer: "rgb(206, 229, 255)",
//       onSecondaryContainer: "rgb(0, 29, 50)",
//       tertiary: "rgb(121, 89, 0)",
//       onTertiary: "rgb(255, 255, 255)",
//       tertiaryContainer: "rgb(255, 223, 160)",
//       onTertiaryContainer: "rgb(38, 26, 0)",
//       error: "rgb(186, 26, 26)",
//       onError: "rgb(255, 255, 255)",
//       errorContainer: "rgb(255, 218, 214)",
//       onErrorContainer: "rgb(65, 0, 2)",
//       background: "rgb(255, 251, 255)",
//       onBackground: "rgb(32, 26, 24)",
//       surface: "rgb(255, 251, 255)",
//       onSurface: "rgb(32, 26, 24)",
//       surfaceVariant: "rgb(245, 222, 216)",
//       onSurfaceVariant: "rgb(83, 67, 63)",
//       outline: "rgb(133, 115, 110)",
//       outlineVariant: "rgb(216, 194, 188)",
//       shadow: "rgb(0, 0, 0)",
//       scrim: "rgb(0, 0, 0)",
//       inverseSurface: "rgb(54, 47, 45)",
//       inverseOnSurface: "rgb(251, 238, 235)",
//       inversePrimary: "rgb(255, 181, 160)",
//       elevation: {
//         level0: "transparent",
//         level1: "rgb(251, 241, 242)",
//         level2: "rgb(249, 235, 235)",
//         level3: "rgb(246, 229, 227)",
//         level4: "rgb(246, 226, 224)",
//         level5: "rgb(244, 222, 219)",
//       },
//       surfaceDisabled: "rgba(32, 26, 24, 0.12)",
//       onSurfaceDisabled: "rgba(32, 26, 24, 0.38)",
//       backdrop: "rgba(59, 45, 41, 0.4)",
//     },
//     dark: {
//       primary: "rgb(255, 181, 160)",
//       onPrimary: "rgb(96, 21, 0)",
//       primaryContainer: "rgb(135, 33, 0)",
//       onPrimaryContainer: "rgb(255, 219, 209)",
//       secondary: "rgb(150, 204, 255)",
//       onSecondary: "rgb(0, 51, 83)",
//       secondaryContainer: "rgb(0, 74, 117)",
//       onSecondaryContainer: "rgb(206, 229, 255)",
//       tertiary: "rgb(248, 189, 42)",
//       onTertiary: "rgb(64, 45, 0)",
//       tertiaryContainer: "rgb(92, 67, 0)",
//       onTertiaryContainer: "rgb(255, 223, 160)",
//       error: "rgb(255, 180, 171)",
//       onError: "rgb(105, 0, 5)",
//       errorContainer: "rgb(147, 0, 10)",
//       onErrorContainer: "rgb(255, 180, 171)",
//       background: "rgb(32, 26, 24)",
//       onBackground: "rgb(237, 224, 221)",
//       surface: "rgb(32, 26, 24)",
//       onSurface: "rgb(237, 224, 221)",
//       surfaceVariant: "rgb(83, 67, 63)",
//       onSurfaceVariant: "rgb(216, 194, 188)",
//       outline: "rgb(160, 140, 135)",
//       outlineVariant: "rgb(83, 67, 63)",
//       shadow: "rgb(0, 0, 0)",
//       scrim: "rgb(0, 0, 0)",
//       inverseSurface: "rgb(237, 224, 221)",
//       inverseOnSurface: "rgb(54, 47, 45)",
//       inversePrimary: "rgb(176, 46, 0)",
//       elevation: {
//         level0: "transparent",
//         level1: "rgb(43, 34, 31)",
//         level2: "rgb(50, 38, 35)",
//         level3: "rgb(57, 43, 39)",
//         level4: "rgb(59, 45, 40)",
//         level5: "rgb(63, 48, 43)",
//       },
//       surfaceDisabled: "rgba(237, 224, 221, 0.12)",
//       onSurfaceDisabled: "rgba(237, 224, 221, 0.38)",
//       backdrop: "rgba(59, 45, 41, 0.4)",
//     },
//   };