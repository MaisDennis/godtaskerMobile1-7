import React, { useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import defaultAvatar from '~/assets/defaultAvatar.png';
import Modal from 'react-native-modal';
import Clipboard from '@react-native-community/clipboard';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import {
  BackIcon, BackText, ButtonForModal, Container,
  DownloadText, DownloadView,
  FormScrollView,
  Input,
  MarginView02, MarginView04, MarginView08,
  ModalHeaderCenter, ModalHeaderLeft, ModalHeaderRight, ModalHeaderView, ModalTitleText,
  NextIcon,
  QRImage,
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
import QR from '~/assets/cardemon.png';
import { number } from 'yup';

export default function SettingsPage({ navigation }) {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.profile)

  const [artigo, setArtigo] = useState();
  const [toggleModal, setToggleModal] = useState(false);

  useEffect(() => {
    if (userData.gender === 'feminino') {
      setArtigo('a')
    } else {
      setArtigo('o')
    }
  }, [userData])

  function handleUpdateProfile() {
    navigation.navigate('UpdateProfile')
  }

  function handleToggleModalLanguage() {
    i18n.changeLanguage('pt')
  }

  function handleToggleModalShare() {
    setToggleModal(!toggleModal)
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
        <Modal isVisible={toggleModal}>
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
                onPress={() => {
                  Clipboard.setString(t("IWouldLikeTo"))
                }}
                small={true}
                type='inverted'
              >
                {t('CopyText')}
              </Button>
              <MarginView04/>
            </DownloadView>

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
              <DownloadView>
              <ModalTitleText>iOS App Store:</ModalTitleText>
              <MarginView04/>
              <QRImage
                source={QR}
              />
            </DownloadView>
            <MarginView08/>
            <MarginView04/>
          </FormScrollView>
        </Modal>

      </SettingsMenuView>
    </Container>
  )
}
