import { StyleSheet } from 'react-native';
import { Color } from './Color';
import { FontFamily, FontSize } from './Fonts';
import { Border, Padding, Gap } from './Spacing';

/* Global Styles */
export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Padding.xs,
    borderRadius: Border.base,
    backgroundColor: Color.light.background,
    shadowColor: Color.light.shadowLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  title: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.boldItalic,
    color: Color.light.text,
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
    color: Color.light.text,
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
    color: Color.light.white,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.lg,
    letterSpacing: 1.5,
  },

  searchBar: {
    height: 50,
    borderColor: Color.light.grayLight,
    borderWidth: 1,
    borderRadius: Border.base,
    paddingHorizontal: Padding.base,
    marginBottom: Padding.base,
    backgroundColor: Color.light.background,
  },

  categoryButton: {
    paddingVertical: Gap.sm,
    paddingHorizontal: 15,
    borderRadius: Border.base,
    backgroundColor: Color.light.tabIconDefault,
    marginRight: Gap.sm,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
  },

  selectedCategoryButton: {
    backgroundColor: Color.light.tint,
  },

  categoryText: {
    color: Color.light.text,
    fontFamily: FontFamily.bold,
  },

  productContainer: {
    flex: 1,
    margin: Gap.sm,
    padding: Padding.base,
    backgroundColor: Color.light.background,
    borderRadius: Border.base,
    alignItems: 'center',
    borderColor: Color.light.tabIconDefault,
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
    color: Color.light.text,
    marginBottom: Padding.base,
  },

  cartList: {
    marginBottom: Padding.base,
  },

  cartItem: {
    flexDirection: 'row',
    marginBottom: Padding.base,
    padding: Padding.base,
    backgroundColor: Color.light.background,
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

  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
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

  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  profileImage: {
    width: 160,
    height: 160,
    borderRadius: Border.roundedFull,
    marginBottom: 20,
    backgroundColor: Color.light.grayLight,
    shadowColor: Color.light.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 4,
  },

  userName: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Color.light.text,
    marginBottom: 8,
  },

  userEmail: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Color.light.text,
  },

  optionButton: {
    padding: Padding.base,
    backgroundColor: Color.light.background,
    borderRadius: Border.base,
    marginVertical: Gap.sm,
    borderWidth: 1,
    borderColor: Color.light.grayLight,
    alignItems: 'center',
  },

  selectedOptionButton: {
    borderColor: Color.light.primary,
    backgroundColor: Color.light.primary,
  },

  optionText: {
    fontFamily: FontFamily.bold,
    color: Color.light.text,
    fontSize: FontSize.base,
  },

  input: {
    height: 50,
    borderColor: Color.light.grayLight,
    borderWidth: 1,
    borderRadius: Border.base,
    paddingHorizontal: Padding.base,
    marginBottom: Padding.base,
    backgroundColor: Color.light.background,
    shadowColor: Color.light.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  modalContent: {
    width: '80%',
    padding: Padding.lg,
    backgroundColor: Color.light.background,
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
    backgroundColor: Color.light.success,
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
    backgroundColor: Color.light.primary,
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
});
