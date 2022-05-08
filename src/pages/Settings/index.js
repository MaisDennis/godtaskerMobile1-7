import React, { useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import defaultAvatar from '~/assets/defaultAvatar.png';
import Modal from 'react-native-modal';
import Clipboard from '@react-native-community/clipboard';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import {
  BackIcon, BackText, ButtonForModal, ButtonWrapper, Container,
  DownloadText, DownloadView,
  FormScrollView,
  HrLine,
  ItemWrapperView, LabelText,
  MarginView02, MarginView04, MarginView08,
  ModalHeaderCenter, ModalHeaderLeft, ModalHeaderRight, ModalHeaderView, ModalTitleText, ModalView,
  NextIcon,
  QRImage,
  RadioButtonLabel, RadioButtonLabelText, RadioButtonOuter, RadioButtonInner0, RadioButtonInner1, RadioButtonInner2, RadioButtonTag, RadioButtonView,
  SettingsMenuView, SettingsItemView,
  SettingsImageView, SettingsItemText, SettingsImage,
  SettingsLink,
  SubHrView,
  UserProfileView, UserImageBackgroundView, UserImage,
  UserInfoView, UserText, UserAboutText,
} from './styles';
import Button from '~/components/Button';
// import ButtonForIcon from '~/components/ButtonForIcon';
import HeaderView from '~/components/HeaderView'
import { signOut } from '../../store/modules/auth/actions';
import insert from '~/assets/insert_photo-24px.svg';
import godtaskerFont from '~/assets/detective/godtaskerFontPlainGreySmall.png';
import QR from '~/assets/googlePlay.png';
import { number } from 'yup';

export default function SettingsPage({ navigation }) {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.profile)

  const [language, setLanguage] = useState(i18n.language);
  console.log(i18n.language)
  const [toggleModalShare, setToggleModalShare] = useState(false);
  const [toggleCopyText, setToggleCopyText] = useState(false);
  const [toggleModalLanguage, setToggleModalLanguage] = useState(false);

  useEffect(() => {
    setLanguage(i18n.language)
  }, [userData])

  function handleUpdateProfile() {
    navigation.navigate('UpdateProfile')
  }

  function handleToggleModalLanguage() {
    setToggleModalLanguage(!toggleModalLanguage)
  }

  function handleToggleModalShare() {
    setToggleModalShare(!toggleModalShare)
  }

  function handleToggleCopyText() {
    setToggleCopyText(!toggleCopyText)
    Clipboard.setString(t('IWouldLikeTo'))
  }

  function handleToggleCopyTextConfirm() {
    setToggleCopyText(!toggleCopyText)
  }

  function handleSelectLanguage(code) {
    i18n.changeLanguage(code)
    setLanguage(code)
  }

  function handleSignOut() {
    // userData.avatar.url = insert
    // console.tron.log(userData.avatar)
    dispatch(signOut())
  }
  // ---------------------------------------------------------------------------
  return (
    <Container>
      <UserProfileView>
        { userData === undefined || userData.avatar === null
          ? (
            <>
              <UserImageBackgroundView>
                <UserImage
                  // source={require('~/assets/insert_photo-24px.svg')}
                  source={defaultAvatar}
                />
              </UserImageBackgroundView>
              {/* <UserText>n/a</UserText> */}
            </>
          )
          : (
            <UserImageBackgroundView>
              <UserImage
                source={
                  userData.avatar
                    ? { uri: userData.avatar.url }
                    : defaultAvatar
                }
              />
            </UserImageBackgroundView>
          )
        }
        <UserInfoView>
          <UserText>{userData.user_name}</UserText>
          <UserAboutText numberOfLines={1}>
            { userData.bio
              ? userData.bio
              : t('INeedANewBio')
            }
          </UserAboutText>
        </UserInfoView>
      </UserProfileView>

      <SettingsMenuView>
        <SettingsItemView>
          <SettingsImageView>
            <SettingsImage name="key" size={24}/>
          </SettingsImageView>
          <SettingsItemText>{t('EditAccount')}</SettingsItemText>
          <SettingsLink onPress={() => handleUpdateProfile()}>
            <NextIcon name="arrow-right" size={16}></NextIcon>
          </SettingsLink>
        </SettingsItemView>
        <SubHrView/>

        <SettingsItemView>
          <SettingsImageView>
            <SettingsImage name="info" size={24} style={{color: '#ddd'}}/>
          </SettingsImageView>
          <SettingsItemText style={{color: '#ddd'}}>{t('Help')}</SettingsItemText>
            <SettingsLink>
              <NextIcon name="arrow-right" size={16} style={{color: '#ddd'}}></NextIcon>
            </SettingsLink>
          </SettingsItemView>
          <SubHrView/>

          <SettingsItemView>
          <SettingsImageView>
            <SettingsImage name="globe" size={24}/>
          </SettingsImageView>
          <SettingsItemText>{t("SelectLanguage")}</SettingsItemText>
            <SettingsLink onPress={() => handleToggleModalLanguage()}>
              <NextIcon name="arrow-right" size={16}></NextIcon>
            </SettingsLink>
          </SettingsItemView>
          <SubHrView/>

        <SettingsItemView>
          <SettingsImageView>
            <SettingsImage name="heart" size={24}/>
          </SettingsImageView>
          <SettingsItemText>{t('ShareGodtasker')}</SettingsItemText>
          <SettingsLink onPress={() => handleToggleModalShare()}>
            <NextIcon name="arrow-right" size={16}></NextIcon>
          </SettingsLink>
        </SettingsItemView>
        <SubHrView/>

        <SettingsItemView>
          <SettingsImageView>
            <SettingsImage name="log-out" size={24}/>
          </SettingsImageView>
          <SettingsItemText>{t('Exit')}</SettingsItemText>
          <SettingsLink onPress={() => handleSignOut()}>
            <NextIcon name="arrow-right" size={16}></NextIcon>
          </SettingsLink>
        </SettingsItemView>
        {/* <SubHrView/> */}
 {/* ----------------------------------------------------------------------- */}

        <Modal isVisible={toggleCopyText}>
          <ModalView>
            <MarginView04/>
            <DownloadText>
              {t('TextHasBeenCopied')}
            </DownloadText>
            <MarginView04/>
            <Button
              onPress={handleToggleCopyTextConfirm}
              small={true}
              // type='inverted'
            >
              OK
            </Button>
            <MarginView08/>
          </ModalView>
        </Modal>

        <Modal isVisible={toggleModalShare}>
          <FormScrollView>
            <ModalHeaderView>
              <ModalHeaderLeft>
                <ButtonForModal
                  type='submit'
                  onPress={handleToggleModalShare}
                >
                  { Platform.OS === 'ios'
                    ? (
                      <BackIcon name="chevron-left" size={24}/>
                    )
                    : (
                      <BackIcon name="arrow-left" size={20}/>
                    )
                  }
                  <BackText>{t('Back')}</BackText>
                </ButtonForModal>
              </ModalHeaderLeft>
              <ModalHeaderCenter/>
              <ModalHeaderRight></ModalHeaderRight>
            </ModalHeaderView>
            <MarginView04/>

            <ModalTitleText>{t('UseTheText')}</ModalTitleText>
            <MarginView04/>

            <DownloadView>
              <DownloadText>
                {t('IWouldLikeTo')}
              </DownloadText>

              <MarginView08/>
              <Button
                onPress={handleToggleCopyText}
                // small={true}
                type='submit'
              >
                {t('CopyText')}
              </Button>
              <MarginView04/>
            </DownloadView>
            <MarginView04/>
            {/* <ButtonWrapper>
            <Button
                onPress={handleToggleCopyText}
                // small={true}
                // type='inverted'
              >
                {t('CopyText')}
              </Button>
              </ButtonWrapper> */}

            <MarginView04/>
            <ModalTitleText>{t('Or')}</ModalTitleText>
            <MarginView04/>

            <DownloadView>
              <ModalTitleText>Google Play Store:</ModalTitleText>
              <MarginView04/>
              <QRImage
                source={QR}
              />
            </DownloadView>
            <MarginView08/>
            <MarginView04/>
          </FormScrollView>
        </Modal>

        <Modal isVisible={toggleModalLanguage}>
          <FormScrollView>
            <ModalHeaderView>
              <ModalHeaderLeft>
                <ButtonForModal
                  type='submit'
                  onPress={handleToggleModalLanguage}
                >
                  { Platform.OS === 'ios'
                    ? (
                      <BackIcon name="chevron-left" size={24}/>
                    )
                    : (
                      <BackIcon name="arrow-left" size={20}/>
                    )
                  }
                  <BackText>{t('Back')}</BackText>
                </ButtonForModal>
              </ModalHeaderLeft>
              <ModalHeaderCenter/>
              <ModalHeaderRight></ModalHeaderRight>
            </ModalHeaderView>

            <ItemWrapperView>
              <LabelText>{t('Language')}</LabelText>
              <MarginView08/>
              <RadioButtonView>
                <RadioButtonTag onPress={() => handleSelectLanguage('en')}>
                  <RadioButtonLabel>{t('English')}</RadioButtonLabel>
                  <RadioButtonOuter>
                    <RadioButtonInner0 switch={language}/>
                  </RadioButtonOuter>
                </RadioButtonTag>
                <MarginView04/>
                <HrLine/>
                <MarginView04/>
                <RadioButtonTag onPress={() => handleSelectLanguage('pt')}>
                  <RadioButtonLabel>{t('Portuguese')}</RadioButtonLabel>
                  <RadioButtonOuter>
                    <RadioButtonInner1 switch={language}/>
                  </RadioButtonOuter>
                </RadioButtonTag>
                </RadioButtonView>
              </ItemWrapperView>

          </FormScrollView>
        </Modal>

      </SettingsMenuView>
    </Container>
  )
}
