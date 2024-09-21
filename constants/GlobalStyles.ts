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
    //backgroundColor: 'rgba(255, 255, 255, 0.85)',
    //shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
    width: '90%',
    alignSelf: 'center',


  },
  formContainer: {
    width: '90%',  
    maxWidth: 500,
    //backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 30, 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  
  title: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.boldItalic,
    //color: Color.light.text,
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
    //color: Color.light.text,
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
    //color: Color.light.white,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.lg,
    letterSpacing: 1.5,
  },

  searchBar: {
    height: 50,
    //borderColor: Color.light.grayLight,
    borderWidth: 1,
    borderRadius: Border.base,
    paddingHorizontal: Padding.base,
    marginBottom: Padding.base,
    //backgroundColor: Color.light.background,
  },

  categoryButton: {
    paddingVertical: Gap.sm,
    paddingHorizontal: 15,
    borderRadius: Border.base,
   //backgroundColor: Color.light.tabIconDefault,
    marginRight: Gap.sm,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
  },

  selectedCategoryButton: {
    //backgroundColor: Color.light.tint,
  },

  categoryText: {
    //color: Color.light.text,
    fontFamily: FontFamily.bold,
  },

  productContainer: {
    flex: 1,
    margin: Gap.sm,
    padding: Padding.base,
    //backgroundColor: Color.light.background,
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
    //color: Color.light.text,
    marginBottom: Padding.base,
  },

  cartList: {
    marginBottom: Padding.base,
  },

  cartItem: {
    flexDirection: 'row',
    marginBottom: Padding.base,
    padding: Padding.base,
    //backgroundColor: Color.light.background,
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

  totalContainer: {
    marginBottom: Padding.base,
    alignItems: 'center',
  },

  totalText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Color.light.text,
  },


  quantityContainer: {
    flexDirection: 'row',
  },


  quantityText: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Color.light.text,
  },

  deleteButton: {
    alignItems: 'center',
    maxHeight :70,
  },

  deleteButtonText: {
    color: Color.light.white,
    fontFamily: FontFamily.bold,
  },



  userName: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Color.light.text,
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

  card: {
    flex: 1,
    margin: Gap.base,
    padding: Padding.base,
    borderRadius: Border.base,
    shadowColor: Color.light.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  modalContent: {
    width: '80%',
    padding: Padding.lg,
    //backgroundColor: Color.light.background,
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
    //backgroundColor: Color.light.success,
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
    //backgroundColor: Color.light.primary,
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
    //backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },

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
    //backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
    borderColor: Color.light.grayLight,
    borderWidth: 1,
    borderRadius: Border.base,
    paddingHorizontal: Padding.base,
    marginBottom: Padding.base,
    //backgroundColor: Color.light.background,
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
  },
  saveButton: {
    marginVertical: 10,
    //backgroundColor: 'green',
    paddingVertical: width > 600 ? 15 : 10,
  },
  logoutButton: {
    marginVertical: 10,
    //backgroundColor: 'red',
    paddingVertical: width > 600 ? 15 : 10,
  },
  historyButton: {
    marginVertical: 10,
    //backgroundColor: '#1E90FF',
    paddingVertical: width > 600 ? 15 : 10,
  },






});


