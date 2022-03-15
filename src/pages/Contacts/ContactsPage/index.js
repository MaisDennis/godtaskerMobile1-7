import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import {
  AddIcon,
  BackIcon, BackText, ButtonForModal,
  Container,
  DownloadText, DownloadView,
  FormScrollView,
  Header, HeaderImage, HeaderTabView, HeaderTouchable,
  List,
  MarginView02, MarginView04, MarginView08,
  ModalHeaderCenter, ModalHeaderLeft, ModalHeaderRight, ModalHeaderView, ModalTitleText,
  QRImage,
  SpaceView,
  Title,
  UpperTabSelectedView, UpperTabSelectedText,
  UpperTabView, UpperTabText,
} from './styles'
import Button from '~/components/Button';
import Contacts from '~/components/Contacts'
import logo from '~/assets/detective/detective_remake.png'
import QR from '~/assets/cardemon.png';
import SearchBar from '~/components/Searchbar'
import api from '~/services/api';
// -----------------------------------------------------------------------------
export default function ContactsPage({ navigation }) {
  const { t, i18n } = useTranslation();
  const contacts_update = useSelector( state => state.contact.profile)
  const [contacts, setContacts] = useState([]);
  const [inputState, setInputState] = useState('');
  const [listState, setListState] = useState(1);
  const [toggleModal, setToggleModal] = useState(false);

  useEffect(() => {
    loadWorkers('');
  }, [contacts_update]);

  async function loadWorkers(input) {
    setInputState(input)
    const response = await api.get('/workers', {
      params: {
        nameFilter: `${input}`,
      }
    })
    setContacts(response.data)
    setListState(1);
  }

  function handleToggleModalShare() {
    setToggleModal(!toggleModal)
  }

  function handleClubs() {
    // setListState(2);
  }
  // ---------------------------------------------------------------------------
  return (
    <Container>
      <Header>
       <SpaceView>
          <HeaderImage
            source={logo}
          />
        </SpaceView>

        <SearchBar
          // placeholder='Search'
          onChangeText={(input) => loadWorkers(input)}
          returnKeyType='search'
          value={inputState}
        />
        <HeaderTouchable onPress={() => loadWorkers('')}>
          <AddIcon name='refresh-cw' size={20}/>
        </HeaderTouchable>
      </Header>
      <HeaderTabView>
      <UpperTabView>
      <UpperTabText
        onPress={handleToggleModalShare}
      >{t('InviteSomeone')}</UpperTabText>
      </UpperTabView>
      </HeaderTabView>
      { contacts == ''
        ? (
          <Title>{t('LetsSearch')}</Title>
        )
        : (
          <List
            data={contacts}
            keyExtractor={item => String(item.email)}
            renderItem={({ item }) => (
              <Contacts
                key={item.email}
                data={item}
                navigation={navigation}
              />
              // <SafeAreaView
              //   key={item.phonenumber}
              //   data={item}
              // ><Text>{item.phonenumber}</Text></SafeAreaView>
            )}
          />
        )
      }
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
                <BackText>{t("Back")}</BackText>
              </ButtonForModal>
            </ModalHeaderLeft>
            <ModalHeaderCenter/>
            <ModalHeaderRight></ModalHeaderRight>
          </ModalHeaderView>
          <MarginView04/>

          <ModalTitleText>{t("UseTheText")}</ModalTitleText>
          <MarginView04/>

          <DownloadView>
            <DownloadText>
                {t("IWouldLikeTo")}
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
            <MarginView04/>
            <ModalTitleText>Google Play Store:</ModalTitleText>
            <QRImage
              source={QR}
            />
          </DownloadView>
          <MarginView08/>
          <DownloadView>
            <MarginView04/>
            <ModalTitleText>iOS App Store:</ModalTitleText>
            <QRImage
              source={QR}
            />
          </DownloadView>
          <MarginView08/>
          <MarginView04/>
        </FormScrollView>
      </Modal>
    </Container>
  )
}
