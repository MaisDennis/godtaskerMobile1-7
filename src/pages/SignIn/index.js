import React, { useState, useRef } from 'react';
import { Alert, Keyboard ,SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import auth, { sendEmailVerification, getAuth } from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import { signInRequest } from '~/store/modules/auth/actions';
import logo from '~/assets/detective/detective_remake02.png'
import godtaskerFont from '~/assets/detective/font_remake02.png';
import {
  AlignView,
  ButtonWrapper,
  Container,
  EyeButton, EyeIcon,
  ForgotPasswordLink, ForgotPasswordText, FormInput, FormWorker,
  HrLine,
  IconView, ImageLogo, ImageGodtaskerFont,
  Label,
  MarginView02, MarginView04, MarginView08, ModalLabel, ModalView, ModalWrapper,
  Title,
  Wrapper,
} from './styles';
import Button from '~/components/Button'
// -----------------------------------------------------------------------------
export default function SignIn({ navigation }) {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch();
  const [email, setEmail] = useState();
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState();
  const [phonenumber, setPhonenumber] = useState('');
  const [password, setPassword] = useState();
  const [resendConfirmationEmail, setResendConfirmationEmail] = useState();
  const [resendConfirmationPassword, setResendConfirmationPassword] = useState();
  const [secureText, setSecureText] = useState(true);
  const [toggleForgotPassword, setToggleForgotPassword] = useState(false);
  const [toggleResendConfirmation, setToggleResendConfirmation] = useState(false);

  const loading = useSelector(state => state.auth.loading);
  const signed = useSelector(state => state.auth.signed);
  const passwordRef = useRef();

  async function handleSubmit() {
    if(email == null || '') {
      // Alert.alert(t('PleaseFillInEmail'))
      Alert.alert(t('PleaseFillInEmail'))
      return
    }

    if(password == null || '') {
      Alert.alert(t('PleaseFillInPassword'))
      return
    } else {

    }

    await auth().signInWithEmailAndPassword(email, password)
      .then(function(user) {
        console.log(user)
      })
      .catch(function(error) {
        // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            Alert.alert(t("WrongPassword"));
          } else if (errorCode === 'auth/user-not-found') {
            Alert.alert(t("UserNotFound"));
          } else if (errorCode === 'auth/invalid-email') {
            Alert.alert(t("InvalidEmailFormat"));
          } else {
            Alert.alert(t("ErrorOccured"))
            console.log(error)
          }
      })

    await auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const emailVerified = user.emailVerified;
        const uid = user.uid;
        console.log(user)
        if (emailVerified) {
          dispatch(
            signInRequest(
              email,
              password
            )
          );
        } else {
          Alert.alert("UserEmailNotVerified")
        }
        // ...
      } else {
        // User is signed out

        // ...
      }
    })
  }

  function handleToggleForgotPassword() {
    setToggleForgotPassword(!toggleForgotPassword)
  }

  function handleForgotPassword() {
    auth().sendPasswordResetEmail(
      forgotPasswordEmail)
      .then(function() {
        // Password reset email sent.
        Alert.alert(t("PasswordEmailSentTo", { email: `${forgotPasswordEmail}` }))
      })
      .catch(function(error) {
        // Error occurred. Inspect error.code.
        Alert.alert(t("ErrorOccured"))
        console.log('Error occurred. Inspect error.code.')
      });
  }

  function handleToggleResendConfirmation() {
    setToggleResendConfirmation(!toggleResendConfirmation)
  }

  function handleSignUp() {
    navigation.navigate('SignUp')
  }

  async function handleResendConfirmation() {
    if(email == null || '') {
      Alert.alert(t('PleaseFillInEmail'))
      return
    }

    if(resendConfirmationPassword == null || '') {
      Alert.alert(t('PleaseFillInPassword'))
      return
    }

    auth().signInWithEmailAndPassword(
      email,
      resendConfirmationPassword
    )
      .then(function(user) {
        if (user.user.emailVerified !== true) {
          user.user.sendEmailVerification();
          Alert.alert(t("EmailSentTo", { email: `${user.user.email}`} ))
        }
        else {
          Alert.alert(t('UserAlreadyVerified'))
          setToggleResendConfirmation(!toggleResendConfirmation)
        }
      })
      .catch(function(error) {
        // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            Alert.alert(t('WrongPassword'));
          } else if (errorCode === 'auth/user-not-found') {
            Alert.alert(t('UserNotFound'));
          } else if (errorCode === 'auth/invalid-email') {
            Alert.alert(t('InvalidEmailFormat'));
          } else {
            Alert.alert(t('ErrorOccured'))
            console.log(error)
          }
      })
  }

  function handleSecureText() {
    setSecureText(!secureText)
  }

  if (signed) {
    navigation.navigate('Home')
  }
  // -----------------------------------------------------------------------------
  return (
    // <SafeAreaView>
      <Container>
        <AlignView
          // behavior={Platform.OS === "ios" ? "padding" : "position"}
          // keyboardVerticalOffset = {Platform.OS === "ios" ? "100" : null }
          onPress={Keyboard.dismiss}
        >
          <Wrapper
            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center'}}
          >
            <MarginView08/>
            <ImageLogo source={logo} />

            <ImageGodtaskerFont source={godtaskerFont} />

            <Title>{t("DelegateTasks")}</Title>

            <MarginView08/>
            <IconView>
            <EyeButton onPress={handleSecureText}>
                {secureText
                  ? (<EyeIcon name='eye'/>)
                  : (<EyeIcon name='eye-off'/>)
                }
            </EyeButton>
            </IconView>
            <Label>{t("SignIn")}</Label>
            <MarginView04/>
            <FormWorker
                // behavior={Platform.OS === "ios" ? "padding" : null}
                // keyboardVerticalOffset = {Platform.OS === "ios" ? "100" : null }
            >
              <FormInput
                keboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="e-mail"
                // placeholderTextColor={placeHolderColor}
                value={email}
                onChangeText={setEmail}
              />
              <MarginView04/>
              <FormInput
                // icon="unlock"
                secureTextEntry={secureText}
                placeholder={t("YourPassword")}
                // onSubmitEditing={handleSubmit}
                value={password}
                onChangeText={setPassword}
                // ref={passwordRef}
              />
              <MarginView08/>
              <Button
                // type={'inverted'}
                loading={loading}
                onPress={handleSubmit}
              >
                {t("Login")}
              </Button>
              <MarginView08/>
              <ForgotPasswordLink
                onPress={handleToggleForgotPassword}
              >
                <ForgotPasswordText>{t("ForgotPassword")}</ForgotPasswordText>
              </ForgotPasswordLink>
            </FormWorker>
            <Label>{t("Or")}</Label>
            <MarginView04/>
            <Button
              type={'submit'}
              onPress={handleSignUp}
            >
              {t("SignUp")}
            </Button>
            <MarginView08/>
            <ForgotPasswordLink
              onPress={handleToggleResendConfirmation}
            >
              <ForgotPasswordText>
              {t("ResendEmail")}
              </ForgotPasswordText>
            </ForgotPasswordLink>
            <MarginView08/>
            <MarginView08/>
            <MarginView08/>
          </Wrapper>

        </AlignView>
  {/* ------------------------------------------------------------------------ */}
        <Modal isVisible={toggleForgotPassword}>
          <ModalView>
            <ModalWrapper>
            <MarginView08/>
            <ModalLabel>{t('SendForgotPasswordEmail')}</ModalLabel>
            <MarginView04/>
            <FormInput
              keboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="e-mail"
              // placeholderTextColor={placeHolderColor}
              value={forgotPasswordEmail}
              onChangeText={setForgotPasswordEmail}
            />
            <MarginView08/>
            <ButtonWrapper>
              <Button
                type={'inverted'}
                // small={true}
                onPress={handleToggleForgotPassword}
              >
                {t("Back")}
              </Button>
              <MarginView04/>
              <Button
                type={'submit'}
                // small={true}
                onPress={() => handleForgotPassword()}
              >
                {t("Send")}
              </Button>
            </ButtonWrapper>
            <MarginView08/>
            </ModalWrapper>
          </ModalView>
        </Modal>

        <Modal isVisible={toggleResendConfirmation}>
          <ModalView>
          <ModalWrapper>
            <MarginView08/>
            <ModalLabel>{t('ResendConfirmation')}</ModalLabel>
            <MarginView04/>
            <FormInput
              keboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="e-mail"
              // placeholderTextColor={placeHolderColor}
              // value={resendConfirmationEmail}
              // onChangeText={setResendConfirmationEmail}
              returnKeyType="next"
              value={email}
              onChangeText={setEmail}
            />
            <MarginView04/>
            <FormInput
              // icon="unlock"
              secureTextEntry={true}
              placeholder={t('YourPassword')}
              placeholderTextColor={'#666'}
              returnKeyType="send"
              onSubmitEditing={handleSubmit}
              value={resendConfirmationPassword}
              onChangeText={setResendConfirmationPassword}
              // ref={passwordRef}
            />
            <MarginView08/>
            <ButtonWrapper>
              <Button
                type={'inverted'}
                onPress={handleToggleResendConfirmation}
              >
                {t('Back')}
              </Button>
              <MarginView04/>
              <Button
                type={'submit'}
                onPress={() => handleResendConfirmation()}
              >
                {t('Send')}
              </Button>
            </ButtonWrapper>

            <MarginView08/>
            </ModalWrapper>
          </ModalView>
        </Modal>

      </Container>
    // </SafeAreaView>
  );
}
