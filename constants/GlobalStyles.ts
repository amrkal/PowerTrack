import { StyleSheet, Dimensions } from 'react-native';
import { Color } from './Color';
import { FontFamily, FontSize } from './Fonts';
import { Border, Padding, Gap } from './Spacing';

const { width } = Dimensions.get('window');

/* Global Styles */
export const GlobalStyles = StyleSheet.create({
  container: {
    padding: Padding.sm,
    borderRadius: Border.base,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
    width: '90%',
    alignSelf: 'center',
    borderColor: '#ffa64d',
    borderWidth: 2, // Border thickness
    borderStyle: 'solid', // Solid border (default)


  },
  
  title: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.boldItalic,

    marginBottom: Padding.lg,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    shadowColor: Color.light.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  text: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    lineHeight: 26,
    marginBottom: Padding.sm,
  },

  button: {
    paddingVertical: Padding.sm,
    paddingHorizontal: Padding.xl,
    borderRadius: Border.roundedFull,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Color.light.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },

  buttonText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.lg,
    letterSpacing: 1.5,
  },

  searchBar: {
    height: 50,
    borderWidth: 1,
    borderRadius: Border.base,
    paddingHorizontal: Padding.base,
    marginBottom: Padding.base,

  },

  categoryButton: {
    marginBottom: Gap.sm,
  },

  selectedCategoryButton: {
  },

  categoryText: {
    fontFamily: FontFamily.bold,
  },

  productContainer: {
    flex: 1,
    margin: Gap.sm,
    padding: Padding.base,
    borderRadius: Border.base,
    alignItems: 'center',
    borderWidth: 1,
  },

  

  productImage: {
    width: 100,
    height: 100,
    marginBottom: Padding.base,
  },

  productName: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    marginBottom: Gap.sm,
  },

  productPrice: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    marginBottom: Padding.base,
  },









  quantityText: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Color.light.text,
  },

  deleteButtonText: {
    color: Color.light.white,
    fontFamily: FontFamily.bold,
  },



  userName: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    marginBottom: 8,
  },


  optionButton: {
    padding: Padding.base,
    //backgroundColor: Color.light.background,
    borderRadius: Border.base,
    marginVertical: Gap.sm,
    borderWidth: 1,
    borderColor: Color.light.grayLight,
    alignItems: 'center',
  },

  selectedOptionButton: {
    borderColor: Color.light.primary,
    //backgroundColor: Color.light.primary,
  },

  optionText: {
    fontFamily: FontFamily.bold,
    color: Color.light.text,
    fontSize: FontSize.base,
  },



  inputFocus: {
    borderColor: Color.light.primary,
  },



  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '80%',
    padding: Padding.lg,
    borderRadius: Border.base,
    shadowColor: Color.light.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  toastContainer: {
    position: 'absolute',
    bottom: 30,
    left: '10%',
    right: '10%',
    padding: Padding.sm,
    borderRadius: Border.base,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Color.light.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },

  toastText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Color.light.white,
  },

  animatedTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Padding.sm,
    paddingHorizontal: Padding.lg,
    borderRadius: Border.base,
    shadowColor: Color.light.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  animatedTouchablePress: {
    transform: [{ scale: 0.95 }],
  },



  backToTopButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    borderColor: '#1E90FF',
  },




  input: {
    borderColor: Color.light.grayLight,
    borderWidth: 1,
    borderRadius: Border.base,
    paddingHorizontal: Padding.base,
    marginBottom: Padding.base,
    shadowColor: Color.light.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    height: width > 600 ? 60 : 50,
  },
  

  


  categoryList: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  globalCategoryContainer: {
    marginBottom: 20,
  },
  globalCategoryTitle: {
    width: '100%',
    height: 35,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityButtonLabel: {
    fontSize: 18,
  },

  backButton: {
    marginBottom: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  globalCategoryAccordion: {
    backgroundColor: '#f8f9fa', // Example background color    backgroundColor: '#f8f9fa', // Example background color
    borderRadius: 5,
    marginHorizontal: 10,
  },



  categoryContainer: {
    marginBottom: 10,
  },
  categoryTypeText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },



  rectangle: {

    padding: 20,
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,  // For Android shadow
  },
  rectangleText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },


//categorylist------------------------------------------------------------------------------------------------------

globalCategoryCard: {
  width: '100%',
  marginBottom: 20,
  backgroundColor: '#f5f5f5',
  borderRadius: 10,
  padding: 15,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 5 },
  elevation: 3,
  alignItems: 'center',
  justifyContent: 'center',
},
categoryCard: {
  width: '45%',
  height: 150,
  marginBottom: 20,
  backgroundColor: '#fff',
  borderRadius: 10,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 5 },
  elevation: 3,
  alignItems: 'center',
  justifyContent: 'center',
  borderColor: '#ffa64d', // Corrected the hex value for black
  borderWidth: 2, // Add this to make the border visible
  padding: 10,
},
categoryImage: {
  width: '100%',
  height: '70%',
  resizeMode: 'contain',
  marginBottom: 10,
},
categoryName: {
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},

//productitem------------------------------------------------------------------------------------------------------


productPriceContainer: {
  position: 'relative', // Allows positioning of the dot
  alignSelf: 'flex-end', // Aligns the container to the right
  marginRight: 10, // Adds spacing from the right edge
},
productPriceDot: {
  width: 30, // Dot size
  height: 30,
  borderRadius: 15, // Makes it a circle
  backgroundColor: '#ffa11d', // Orange color
  justifyContent: 'center', // Centers the content
  alignItems: 'center', // Centers the content
  elevation: 5, // Adds a shadow for better visibility
  marginTop:5,
},
productPriceDisplay: {
  fontSize: 16,
  fontWeight: 'bold',
  marginTop: 10,
},

//productslist------------------------------------------------------------------------------------------------------

card: {
  flex: 1,
  margin: Gap.sm,
  borderRadius: Border.sm,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  borderColor:'#ffa64d',
  borderWidth: 2, // Border thickness
  borderStyle: 'solid', // Solid border (default)
},

image: {
  width: 80,
  height: 80,
  borderRadius: 10,
  alignSelf:'center',
},
infoContainer: {
  flex: 1,
  justifyContent: 'space-between',
  borderColor:'#1E90FF'
},
name: {
  fontSize: 16,
  fontWeight: 'bold',
  alignSelf:'center',
  textAlign:'right',
  color: '#333',
},
price: {
  fontSize: 14,
  color: '#007BFF',
  marginTop: 5,
  fontWeight: '600',
},
description: {
  fontSize: 12,

},
quantityContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  marginTop: 10,
  alignSelf:'center',
},
quantityButton: {
  width: '30%',
  height: '80%',
  justifyContent: 'center',
  borderColor: '#1E3A8A', // Match the border to the text color
  backgroundColor: 'transparent',
  alignItems: 'center',
  borderRadius: 20,
},
quantityInput: {
  width: '30%', // Ensure the width accommodates numbers comfortably
  height: 40, // Maintain height
  borderRadius: 5, // Rounded corners
  textAlign: 'center', // Center text horizontally
  textAlignVertical: 'center', // Center text vertically (for Android)
  fontSize: 16, // Maintain readability
  marginHorizontal: '2%', // Space around the input
  paddingVertical: 0, // Remove vertical padding
  paddingHorizontal: 0, // Remove horizontal padding
  borderWidth: 0, // No border to make it clear
  backgroundColor: 'transparent', // Transparent background
  color: '#000', // Set text color for readability
  alignSelf: 'center', // Align in the center of its container
},

addToCartButton: {
  marginTop:15,
  margin: 10,
  borderColor:'#1E3A8A'
  
},
feedback: {
  marginTop: 5,
  fontSize: 12,
  color: 'green',
},


//-----------------------------------------------------------cart

deleteButton: {
  width: 40, // Circle width
  height: 40, // Circle height
  borderRadius: 20, // Half of width/height for a perfect circle
  paddingLeft:12,
  justifyContent: 'center', // Center content vertically
  alignItems: 'center', // Center content horizontally
  padding: 0, // Remove any additional padding
  margin: 0, // Remove any margin to ensure precise alignment
  backgroundColor: 'red', // Optional background for visibility
},

cartItem: {
  flexDirection: 'row',
  marginBottom: Padding.base,
  padding: Padding.base,
  borderRadius: Border.base,
  borderColor: Color.light.grayLight,
  borderWidth: 1,
  alignItems: 'center',
},

totalContainer: {
  backgroundColor: '#fff',
  borderRadius: 10,
  elevation: 3,
  marginBottom: 20,
},

totalText: {
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
},

cartItemImage: {
  width: 100,
  height: 100,
  borderRadius: Border.base,
  marginRight: Gap.base,
},

cartItemDetails: {
  flex: 1,
},

cartItemName: {
  fontSize: FontSize.lg,
  fontFamily: FontFamily.bold,
  marginBottom: Gap.xs,
},

cartItemPrice: {
  fontSize: FontSize.base,
  fontFamily: FontFamily.regular,
  color: Color.light.primary,
},

cartList: {
  marginBottom: Padding.base,
},





  //authentification------------------------------------------------------------------------------------------------------

  authBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  authContainer: {
    maxWidth: 500,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.60)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
    width: '90%',
    alignSelf: 'center',
    borderColor: '#ffa64d',
    borderWidth: 2,
    borderStyle: 'solid',
    position: 'absolute',
    bottom: '15%',
  },


  authScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    textAlign:'center',
  },

  authInput: {
    marginBottom: 15,
  },

  authBackButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    elevation: 5,
  },

  authRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  authSafeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  authInstructionText: {
    marginBottom: 10,
    textAlign: 'right',
    fontSize: 16,
  },



// profile------------------------------------------------------------------------------------------------------

profileContainer: {
  maxWidth: 500,
  alignSelf: 'center',
  width: '100%',
  padding: 20,
  flexGrow: 1,
},

profileHeader: {
  flexDirection: "row", // Align elements horizontally
  alignItems: "center", // Center vertically
  marginBottom: 20,
  padding: 10,
  backgroundColor: "#ffffff", // Optional card-style background
  borderRadius: 10,
  elevation: 5, // Shadow for elevation
},
profileButton: {
  marginVertical: 10,
  width: '100%',
  borderStyle: 'solid', // Solid border (default)
},

settingsItem: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
},

profileUserName: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 5,
  flex: 1, // Take the remaining space
  marginLeft: 15, // Add spacing between avatar and text
  alignItems: "center", // Align text to the left
},

profileEditIcon: {
  position: "absolute",
  bottom: 0,
  right: -10,
  borderRadius: 50,
  padding: 5,
},



//aboutus------------------------------------------------------------------------------------------------------

logoImage: {
  alignSelf: 'center',
  resizeMode: 'contain',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
},
collapsibleHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderColor: '#1E90FF',
  backgroundColor: '#fff',
  borderRadius: 10,
  marginVertical: 5,
  paddingHorizontal: 10,
},
collapsibleContent: {
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 10,
  marginBottom: 10,
},
sectionHeader: {
  fontSize: width > 600 ? 22 : 18,
  fontWeight: 'bold',
},
boldText: {
  fontWeight: 'bold',
},


//contactus------------------------------------------------------------------------------------------------------

contactCard: {
  width: width > 600 ? '60%' : '90%',
  padding: 20,
  marginTop: 150,
  marginBottom: 10,
  backgroundColor: '#fff',
  borderRadius: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 10,
  borderColor: '#1E90FF',
  borderWidth: 2,
  alignSelf: 'center',
},
header: {
  fontSize: width > 600 ? 32 : 24,
  fontWeight: 'bold',
  marginBottom: 7,
  textAlign: 'center',
  color: '#1E90FF',
},
subHeader: {
  fontSize: width > 600 ? 26 : 15,
  color: '#ffa64d',
  marginBottom: 15,
  textAlign: 'center',
},
contactItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},
contactText: {
  fontSize: width > 600 ? 18 : 16,
  color: '#1E90FF',
  textDecorationLine: 'underline',
  marginLeft: 6,
},

  
//checkout------------------------------------------------------------------------------------------------------

checkoutCard: {
  flex: 1,
  justifyContent: 'center',
  padding: 20,
  backgroundColor: '#ffffff',
  borderRadius: 10,
  elevation: 4,
},
checkoutTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 20,
},
checkoutOptionButton: {
  height: 50,
  backgroundColor: '#cccccc', // Default disabled color
},
filledButton: {
  backgroundColor: '#6200ee', // Selected button color
},

enabledNextButton: {
  backgroundColor: '#6200ee', // Active color for enabled button
},

});


