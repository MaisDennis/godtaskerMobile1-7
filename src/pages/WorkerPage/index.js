import React, { useState, useEffect } from 'react';
import { Linking, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import defaultAvatar from '~/assets/defaultAvatar.png';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
// -----------------------------------------------------------------------------
import {
  BioText, BlockedButton, BlockLarge, ButtonMuted, ButtonMutedText,
  Container, ContentView,
  FollowButton, FollowText, FollowingButton, FollowingText, FollowersView, FollowersWrapper, FormScrollView,
  HeaderTabView, HrLine,
  Iicon,
  Label, LabelBold, LabelMild, LabelNormal, LeftView, ListButton,
  MarginView04, MarginView08, Menu, MenuButton, MenuLabel, MenuLabelMuted,
  MessageButton, MessageIcon,
  ModalView, ModalWrapper01,
  ServiceView, SocialMediaButton, SocialMediaText, SocialMediaView, SocialMediaWrapper,
  StatusView,
  UserImage, WorkerImageBackgroundView, UserInfoView,
  WorkerNameText, UserNameWrapper, UserView, UserWrapper,
} from '../Dashboard/styles'
import Button from '~/components/Button'
import Service from '~/components/ServiceDisplay'
import { updateChatInfo } from '~/store/modules/message/actions';
import { updateContacts } from '~/store/modules/contact/actions';
import api from '~/services/api';
// -----------------------------------------------------------------------------
export default function WorkerPage({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const user_id = useSelector(state => state.user.profile.id);
  const user_name = useSelector(state => state.user.profile.user_name);
  const user_email = useSelector(state => state.user.profile.email);
  const userData = useSelector(state => state.user.profile);

  const data = route.params;
  console.log(data)
  const worker_id = data.id;
  const worker_name = data.worker_name;
  const worker_email = data.email;
  const first_name = data.first_name;
  const last_name = data.last_name;
  const worker_photo = data.avatar ? data.avatar.url : undefined;
  const instagram_username = data.instagram ? data.instagram : '-'
  const linkedin_username = data.linkedin ? data.linkedin : '-'
  const bio = data.bio ? data.bio : 'There is no bio'
  const userPoints = data.points;
  const workerData = data
  const blocked_list = data.blocked_list === null ? [] : data.blocked_list
  const flagged_list = data.flagged_list === null ? [] : data.flagged_list
  // console.log(data)

  const [countFollowers, setCountFollowers] = useState();
  const [countFollowing, setCountFollowing] = useState();
  const [checkBlocked, setCheckBlocked] = useState(false);
  const [displays, setDisplays] = useState();
  const [followIndividual, setFollowIndividual] = useState();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleReport, setToggleReport] = useState(false);
  const [toggleBlock, setToggleBlock] = useState(false);
  const [toggleUnblock, setToggleUnblock] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    loadData()
    handleCheckBlocked()
  }, [])

  function handleCheckBlocked() {
    blocked_list.map(b => {
      if(b === user_email) {
        setCheckBlocked(true)
      }
    })

    flagged_list.map(b => {
      if(b === user_email) {
        setReported(true)
      }
    })
  }

  async function loadData() {
    const followingResponse = await api.get(
      `/users/following/count`, {
        params: { contactName: worker_name }
      }
    )
    const followedResponse = await api.get(
      `/workers/followed/count`, {
        params: { worker_name: worker_name }
      }
    )
    const followIndividualResponse = await api.get(
      `/users/following/individual`, {
        params: { user_id: user_id, worker_id: worker_id }
      }
    )

    const serviceResponse = await api.get(`/services`, {
      params: { creator_email: worker_email }
    })

    setFollowIndividual(followIndividualResponse.data[0])
    setCountFollowers(followedResponse.data)
    setCountFollowing(followingResponse.data)
    setDisplays(serviceResponse.data.displays)
    console.log(serviceResponse.data.displays)
  }

  async function handleStartFollow() {
    await api.post(
      `/users/following`, {
        user_email: user_email,
        worker_email: worker_email,
      }
    )
    loadData()
  }

  async function handleStopFollow() {
    await api.put(
      `/users/following`, {
        user_email: user_email,
        worker_email: worker_email,
      }
    )
    loadData()
  }

  function handleFollow() {
    navigation.navigate('Follow', {
      contact_name: worker_name,
    })
  }

  function handleFollowed() {
    navigation.navigate('Followed', {
      contact_name: worker_name,
    })
  }

  async function handleMessageConversation() {
    const response = await api.get('/messages/user', {
      params: {
        user_email: user_email,
        worker_email: worker_email,
      },
    })
    dispatch(updateChatInfo(userData, workerData));

    if(response.data.message === null) {
      const chat_id = Math.floor(Math.random() * 1000000)

      navigation.navigate('MessagesConversationPage', {
        userData: userData,
        workerData: workerData,

        chat_id: chat_id,
        inverted: response.data.inverted,
        first_message: true,
      });
      return
    }

    navigation.navigate('MessagesConversationPage', {
      userData: userData,
      workerData: workerData,

      chat_id: response.data.message.chat_id,
      inverted: response.data.inverted,
    });
  }

  function handleToggleMenu() {
    setToggleMenu(!toggleMenu)
  }

  function handleToggleModal() {
    setToggleModal(!toggleModal)
  }

  async function handleReport() {
    const response = await api.put('/users/flag', {
      email: worker_email,
      flagger_email: user_email,
    })
    setToggleModal(!toggleModal)
    setToggleReport(!toggleReport)
    setReported(true)
    dispatch(updateContacts(new Date()))
  }

  async function handleBlock() {
    const response = await api.put('/users/block', {
      email: worker_email,
      blocker_email: user_email,
    })

    await api.put(
      `/users/following`, {
        user_email: user_email,
        worker_email: worker_email,
      }
    )
    await loadData()
    handleCheckBlocked()
    setToggleMenu(!toggleMenu)
    setToggleBlock(!toggleBlock)
    setCheckBlocked(true)
    dispatch(updateContacts(new Date()))
  }

  async function handleUnblock() {
    const response = await api.put('/users/unblock', {
      email: worker_email,
      unblocker_email: user_email,
    })
    await loadData()
    handleCheckBlocked()
    setToggleMenu(!toggleMenu)
    setToggleUnblock(!toggleUnblock)
    setCheckBlocked(false)
    dispatch(updateContacts(new Date()))
  }

  function handleLinkToInstagram() {
    try {
      Linking.openURL(`instagram://user?username=${instagram_username}`)
    }
    catch(error) {
      console.log(error)
    }
  }

  function handleLinkToLinkedIn() {
    try {
      Linking.openURL(`https://linkedin.com/in${linkedin_username}`)
    }
    catch(error) {
      console.log(error)
    }
  }

  // ---------------------------------------------------------------------------
  return (
    <Container>
      <FormScrollView>
        <MarginView08/>
        <HeaderTabView>
          <MessageButton onPress={handleMessageConversation}>
            <MessageIcon name='message-square'></MessageIcon>
          </MessageButton>
          { checkBlocked === false
            ? (
              <>
                { followIndividual !== undefined
                  ? (
                    <FollowingButton onPress={handleStopFollow}>
                      <FollowingText>{t('Following')}</FollowingText>
                    </FollowingButton>
                  )
                  : (
                    <FollowButton onPress={handleStartFollow}>
                      <FollowText>{t('Follow')}</FollowText>
                    </FollowButton>
                  )
                }
              </>
            )
            : (
              <BlockedButton>
                <FollowText>{t("Blocked")}</FollowText>
              </BlockedButton>
            )
          }
          <ListButton onPress={handleToggleMenu}>
            <MessageIcon name='more-horizontal'></MessageIcon>
          </ListButton>
          { toggleMenu
            ? (
              <Menu>
                { reported === false
                  ? (
                    <MenuButton onPress={handleReport}><MenuLabel>{t("ReportContent")}</MenuLabel></MenuButton>
                  )
                  : (
                    <MenuButton><MenuLabelMuted>{t("UserReported")}</MenuLabelMuted></MenuButton>
                  )
                }

                <HrLine></HrLine>
                { checkBlocked === false
                  ? (
                    <MenuButton onPress={handleBlock}><MenuLabel>{t("BlockUser")}</MenuLabel></MenuButton>
                  )
                  : (
                    <MenuButton onPress={handleUnblock}><MenuLabel>{t("UnblockUser")}</MenuLabel></MenuButton>
                  )
                }
              </Menu>
            )
            : (
              null
            )

          }
        </HeaderTabView>
        <MarginView04/>
        <UserView>
          <UserWrapper>
            <LeftView>

              { worker_photo === undefined || worker_photo.url === null
                ? (
                  <>
                    <WorkerImageBackgroundView>
                      <UserImage
                        // source={require('~/assets/insert_photo-24px.svg')}
                        source={defaultAvatar}
                      />
                    </WorkerImageBackgroundView>
                    {/* <UserText>n/a</UserText> */}
                  </>
                )
                : (
                  <WorkerImageBackgroundView>
                    <UserImage
                      source={
                        worker_photo
                          ? { uri: worker_photo }
                          : defaultAvatar
                      }
                    />
                  </WorkerImageBackgroundView>
                )
              }
            </LeftView>
            <UserInfoView>
              <UserNameWrapper>
                <WorkerNameText>{worker_name}</WorkerNameText>
                { userPoints
                  ? (
                    <LabelNormal>({userPoints})</LabelNormal>
                  )
                  : (
                    <LabelNormal>(0)</LabelNormal>
                  )
                }
                {/* <FirstNameWrapper>
                  <LabelBold2>{first_name}</LabelBold2>
                  <LabelBold2>{last_name}</LabelBold2>
                </FirstNameWrapper> */}
              </UserNameWrapper>
                <FollowersWrapper>
                  <FollowersView onPress={handleFollowed}>
                    <LabelBold>{countFollowers}</LabelBold>
                    <LabelNormal>{t('Followers')}</LabelNormal>
                  </FollowersView>
                  <FollowersView onPress={handleFollow}>
                    <LabelBold>{countFollowing}</LabelBold>
                    <LabelNormal>{t('Following')}</LabelNormal>
                  </FollowersView>
                </FollowersWrapper>
            </UserInfoView>
          </UserWrapper>
        </UserView>

        <MarginView08/>
        <ContentView>
          <SocialMediaWrapper>
            <SocialMediaView>
              <SocialMediaButton onPress={handleLinkToInstagram}>
                <Iicon name='instagram' size={20}/>
                <SocialMediaText>{instagram_username}</SocialMediaText>
              </SocialMediaButton>
            </SocialMediaView>
            <SocialMediaView>
              <SocialMediaButton onPress={handleLinkToLinkedIn}>
                <Iicon name='linkedin' size={20}/>
                <SocialMediaText>{linkedin_username}</SocialMediaText>
              </SocialMediaButton>

            </SocialMediaView>
          </SocialMediaWrapper>
        </ContentView>
        <MarginView08/>
        <ContentView>
          <StatusView>
            <Label>Bio:</Label>
          </StatusView>
          <MarginView04/>

          <StatusView>
            <BlockLarge>
              <BioText>
                {bio}
              </BioText>
            </BlockLarge>
          </StatusView>
          <MarginView08/>
          <MarginView08/>
        </ContentView>
{/* Displayed in Worker ---------------------------------------------------- */}
        <ContentView>
          <StatusView>
            <Label>{t('Services')}</Label>
          </StatusView>
          <MarginView04/>
          <ServiceView>
          { displays && displays[0] != null
            ? displays.map(s => (
              <Service
                key={s.id}
                data={s}
                navigation={navigation}
                display={true}
                userData={userData}
                workerData={workerData}
              />
            ))
            : (
              <LabelMild>{t('No services yet')}</LabelMild>
            )
          }
            </ServiceView>
        </ContentView>
        <MarginView08/>
        <MarginView08/>
{/* Modal ------------------------------------------------------------------ */}
        <Modal isVisible={toggleReport}>
          <ModalView>
            <MarginView08/>
            <ModalWrapper01>
              <BioText>
                {t('ThisUserReported')}
              </BioText>
              <MarginView04/>
              <Button type={'inverted'} onPress={() => setToggleReport(!toggleReport)}>
                OK
              </Button>
              <MarginView08/>
            </ModalWrapper01>
          </ModalView>
        </Modal>

        <Modal isVisible={toggleBlock}>
          <ModalView>
            <MarginView08/>
            <ModalWrapper01>
              <BioText>
                {t("ThisUserBlocked")}
              </BioText>
              <MarginView04/>
              <Button type={'inverted'} black={true} onPress={() => setToggleBlock(!toggleBlock)}>
                OK
              </Button>
              <MarginView08/>
            </ModalWrapper01>
          </ModalView>
        </Modal>

        <Modal isVisible={toggleUnblock}>
          <ModalView>
            <MarginView08/>
            <ModalWrapper01>
              <BioText>
                {t("ThisUserUnblocked")}
              </BioText>
              <MarginView04/>
              <Button type={'inverted'} black={true}  onPress={() => setToggleUnblock(!toggleUnblock)}>
                OK
              </Button>
              <MarginView08/>
            </ModalWrapper01>
          </ModalView>
        </Modal>
      </FormScrollView>
    </Container>
  )
}
