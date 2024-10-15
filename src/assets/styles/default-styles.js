import {StyleSheet, Dimensions} from 'react-native';

const AppColors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  info: '#17a2b8',
  danger: '#dc3545',
  warning: '#ffc107',
  light: '#f8f9fa',
  darklight: '#cccccc',
  dark: '#343a40',
  muted: '#6c757d',
  purple: '#1A1A40',
  pink: '#CE69D6',
  white: '#ffffff',
  orange: '#FFA500',
  yellow: '#FFFF00',
  darkBackground: '#1A1A2E', // Un azul muy oscuro, casi negro
  headerBackground: '#16213E', // Un azul oscuro para el header
  buttonTextShadow: 'rgba(0, 0, 0, 0.75)', // Color para la sombra del texto en los botones
  cosasLindasAccent: '#4DAA57', // Un verde suave para acentuar elementos relacionados con cosas lindas
  cosasFeasAccent: '#D64045',
};

const AppBg = StyleSheet.create({
  primary: {
    backgroundColor: AppColors.primary,
  },
  secondary: {
    backgroundColor: AppColors.secondary,
  },
  success: {
    backgroundColor: AppColors.success,
  },
  info: {
    backgroundColor: AppColors.info,
  },
  danger: {
    backgroundColor: AppColors.danger,
  },
  warning: {
    backgroundColor: AppColors.warning,
  },
  light: {
    backgroundColor: AppColors.light,
  },
  darklight: {
    backgroundColor: AppColors.darklight,
  },
  dark: {
    backgroundColor: AppColors.dark,
  },
  muted: {
    backgroundColor: AppColors.muted,
  },
  purple: {
    backgroundColor: AppColors.purple,
  },
  white: {
    backgroundColor: AppColors.white,
  },
  orange: {
    backgroundColor: AppColors.orange,
  },
  yellow: {
    backgroundColor: AppColors.yellow,
  },
});

const AppTxt = StyleSheet.create({
  primary: {
    color: AppColors.primary,
  },
  secondary: {
    color: AppColors.secondary,
  },
  success: {
    color: AppColors.success,
  },
  info: {
    color: AppColors.info,
  },
  danger: {
    color: AppColors.danger,
  },
  warning: {
    color: '#D4A005',
  },
  light: {
    color: AppColors.light,
  },
  dark: {
    color: AppColors.dark,
  },
  darklight: {
    color: AppColors.darklight,
  },
  muted: {
    color: AppColors.muted,
  },
  purple: {
    color: AppColors.purple,
  },
  white: {
    color: AppColors.white,
  },
  header: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.white,
  },
  wrap: {
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  mainTitle: {
    marginBottom: 20,
    fontSize: 32,
    color: AppColors.white,
    shadowColor: AppColors.dark,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3.65,
    fontFamily: 'Heiti TC',
  },
  mainSubTitle: {
    fontSize: 16,
    color: AppColors.white,
    fontFamily: 'Heiti TC',
  },
  postSubTitle: {
    fontSize: 14,
    color: AppColors.white,
    fontFamily: 'Heiti TC',
  },
  dateText: {
    fontSize: Dimensions.get('window').width * 0.04,
    marginLeft: 15,
    borderColor: AppColors.purple,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 7,
  },
  inputBorder: {
    borderColor: AppColors.purple,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 7,
  },
});

const AppFontSize = StyleSheet.create({
  ssm: {
    fontSize: 9,
  },
  sm: {
    fontSize: 10,
  },
  md: {
    fontSize: 11,
  },
  lg: {
    fontSize: 12,
  },
  xl: {
    fontSize: 15,
  },
  xxl: {
    fontSize: 16,
  },
  xxxl: {
    fontSize: 18,
  },
  btn: {
    fontSize: 16,
  },
});

const AppFontWeight = StyleSheet.create({
  bold: {
    fontWeight: '600',
  },
  normal: {
    fontWeight: '400',
  },
  light: {
    fontWeight: '300',
  },
});

const purple = {
  backgroundColor: AppColors.purple,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
  padding: 10,
};

const AppButton = StyleSheet.create({
  purple: {
    ...purple,
  },
  purpleDisabled: {
    ...purple,
    opacity: 0.4,
  },
  text: {
    color: AppColors.white,
    fontSize: 16,
  },
  primary: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: AppColors.primary,
    color: AppColors.white,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  primaryText: {
    color: AppColors.white,
    fontSize: 18,
    textAlign: 'center',
    alignSelf: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  greyDisabled: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  goBack: {
    color: AppColors.white,
    marginTop: 3,
    marginRight: 5,
  },
  btnEnabled: {
    ...purple,
    marginHorizontal: 15,
    marginVertical: 20,
  },
  btnDisabled: {
    ...purple,
    opacity: 0.4,
    marginHorizontal: 15,
    marginVertical: 20,
  },
});

const AppForm = StyleSheet.create({
  container: {
    marginTop: -25,
    marginHorizontal: 15,
    marginBottom: 10,
    backgroundColor: AppColors.white,
    padding: 10,
    borderRadius: 13,
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.65,
    elevation: 4,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  textTarea: {
    textAlignVertical: 'top',
    height: 120,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  selectContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 4,
  },
  selectInput: {
    height: 40,
  },
  formLabel: {
    marginTop: 5,
    marginBottom: 5,
  },
});

export {
  AppBg,
  AppTxt,
  AppColors,
  AppFontSize,
  AppButton,
  AppFontWeight,
  AppForm,
};
