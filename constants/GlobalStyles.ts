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

  cartList: {
    marginBottom: Padding.base,
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
  header: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
    borderColor: '#1E90FF',
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
  },
  profileContainer: {
    width: width > 600 ? '50%' : '90%',
    alignSelf: 'center',
    borderColor: '#1E90FF',
  },
  userInfo: {
    fontSize: width > 600 ? 24 : 18,
    marginVertical: 5,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: width > 600 ? 20 : 16,
    marginVertical: 5,
    color: 'gray',
    textAlign: 'center',
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
  
  buttonsContainer: {
    width: width > 600 ? '50%' : '90%',
    alignSelf: 'center',
    marginTop: 20,
  },
  editButton: {
    marginVertical: 10,
    paddingVertical: width > 600 ? 15 : 10,
    borderColor: '#ffa64d',
    borderWidth: 2, // Border thickness
    borderStyle: 'solid', // Solid border (default)
  },
  saveButton: {
    marginVertical: 10,
    paddingVertical: width > 600 ? 15 : 10,
    borderColor: '#ffa64d',
    borderWidth: 2, // Border thickness
    borderStyle: 'solid', // Solid border (default)
  },
  logoutButton: {
    marginVertical: 10,
    paddingVertical: width > 600 ? 15 : 10,
    borderColor: '#ffa64d',
    borderWidth: 2, // Border thickness
    borderStyle: 'solid', // Solid border (default)

  },
  historyButton: {
    marginVertical: 10,

    paddingVertical: width > 600 ? 15 : 10,
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





});


