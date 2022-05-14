import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { enUS, pt } from 'date-fns/locale/pt';
import Modal from 'react-native-modal';
import defaultAvatar from '~/assets/defaultAvatar.png';
import { updateProfileRequest } from '~/store/modules/user/actions';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import {
  AddIcon,
  BannerImage, BannerView,
  BioText, BlockLarge, BlockLargeBoss,
  BlockLargeWorker, BlockSegment, BlockSmallBoss, BlockSmallDisplayed, BlockSmallService, BlockSmallWorker,
  ButtonWrapper,
  Container, ContentView,
  FirstNameWrapper, FollowersView, FollowersWrapper, FormScrollView,
  Header, HeaderImage, HeaderTabView, HeaderTouchable, HrLine,
  Iicon, Input,
  Label, LabelBold, LabelBold2, LabelBoldBoss,
  LabelBoldBoss2, LabelBoldDisplayed, LabelBoldRed, LabelBoldService, LabelBoldSocialMedia,
  LabelBoldWorker, LabelBoldWorker2, LabelMild,
  LabelNormal, LabelNormalBoss, LabelNormalSocialMedia,
  LabelNormalWorker,
  LabelSmallBoss, LabelSmallBoss2, LabelSmallRed, LabelSmallSpace,
  LabelSmallWorker, LabelSmallWorker2, LabelSpace, LeftView, LinkedInWrapper,
  MarginView02, MarginView04, MarginView08, ModalView, ModalWrapper01, ModalWrapper02,
  ServiceView, SocialMediaButton, SocialMediaText, SocialMediaView,
  SocialMediaWrapper, SpaceView,
  StatusCircleBoss, StatusCircleRed, StatusCircleWorker,
  StatusLineBoss, StatusLineWorker, StatusView,
  UserImage, UserImageBackgroundView, UserInfoView,
  UserNameText, UserNameWrapper, UserView, UserWrapper,
} from './styles'
import logo from '~/assets/detective/detective_remake02.png'
// import banner from '~/assets/detective/font_remake.png'
import banner from '~/assets/detective/font_remake02.png'
import api from '~/services/api';
import Button from '~/components/Button'
import Service from '~/components/Service'

export default function Dashboard({ navigation }) {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch();
  const user_id = useSelector(state => state.user.profile.id);
  const user_email = useSelector(state => state.worker.profile.email);
  const user_photo = useSelector(state => state.user.profile.avatar) || null;
  const worker_id = useSelector(state => state.worker.profile.id);
  const update_services = useSelector(state => state.service.services);

  const [userFirstName, setUserFirstName] = useState();
  const [userLastName, setUserLastName] = useState();
  const [userUserName, setUserUserName] = useState();
  const [userPhoto, setUserPhoto] = useState();
  const [userInstagram, setUserInstagram] = useState();
  const [userLinkedIn, setUserLinkedIn] = useState();
  const [userBio, setUserBio] = useState();

  const [toggleInstagram, setToggleInstagram] = useState();
  const [toggleLinkedIn, setToggleLinkedIn] = useState();
  const [toggleBio, setToggleBio] = useState();

  const [countFollowers, setCountFollowers] = useState();
  const [countFollowing, setCountFollowing] = useState();
  const [displays, setDisplays] = useState();
  const [services, setServices] = useState();
  const [userCountSent, setUserCountSent] = useState();
  const [userCountInitiated, setUserCountInitiated] = useState();
  const [userCountFinished, setUserCountFinished] = useState();
  const [userCountCanceled, setUserCountCanceled] = useState();
  const [userCountOverDue, setUserCountOverDue] = useState();
  const [userCountTodayDue, setUserCountTodayDue] = useState();
  const [userCountTomorrowDue, setUserCountTomorrowDue] = useState();
  const [userCountThisWeekDue, setUserCountThisWeekDue] = useState();
  const [userPoints, setUserPoints] = useState();
  const [workerCountReceived, setWorkerCountReceived] = useState();
  const [workerCountInitiated, setWorkerCountInitiated] = useState();
  const [workerCountFinished, setWorkerCountFinished] = useState();
  const [workerCountCanceled, setWorkerCountCanceled] = useState();
  const [workerCountOverDue, setWorkerCountOverDue] = useState();
  const [workerCountTodayDue, setWorkerCountTodayDue] = useState();
  const [workerCountTomorrowDue, setWorkerCountTomorrowDue] = useState();
  const [workerCountThisWeekDue, setWorkerCountThisWeekDue] = useState();

  useEffect(() => {
    loadData()
  }, [update_services])

  async function loadData() {
    const dashboardResponse = await api.get(`/dashboard/${user_id}`, {
      params: { user_id, worker_id }
    })

    const serviceResponse = await api.get(`/services`, {
      params: { creator_email: user_email }
    })

    setUserFirstName(dashboardResponse.data.user.first_name)
    setUserLastName(dashboardResponse.data.user.last_name)
    setUserUserName(dashboardResponse.data.user.user_name)
    setUserPhoto(dashboardResponse.data.user.avatar)
    setUserPoints(dashboardResponse.data.user.points)
    setUserInstagram(dashboardResponse.data.user.instagram)
    setUserLinkedIn(dashboardResponse.data.user.linkedin)
    setUserBio(dashboardResponse.data.user.bio)

    setCountFollowers(dashboardResponse.data.countFollowers)
    setCountFollowing(dashboardResponse.data.countFollowing)

    setUserCountSent(dashboardResponse.data.userCountSent)
    setUserCountInitiated(dashboardResponse.data.userCountInitiated)
    setUserCountFinished(dashboardResponse.data.userCountFinished)
    setUserCountCanceled(dashboardResponse.data.userCountCanceled)
    setUserCountOverDue(dashboardResponse.data.userCountOverDue)
    setUserCountTodayDue(dashboardResponse.data.userCountTodayDue)
    setUserCountTomorrowDue(dashboardResponse.data.userCountTomorrowDue)
    setUserCountThisWeekDue(dashboardResponse.data.userCountThisWeekDue)
    setWorkerCountReceived(dashboardResponse.data.workerCountReceived)
    setWorkerCountInitiated(dashboardResponse.data.workerCountInitiated)
    setWorkerCountFinished(dashboardResponse.data.workerCountFinished)
    setWorkerCountCanceled(dashboardResponse.data.workerCountCanceled)
    setWorkerCountOverDue(dashboardResponse.data.workerCountOverDue)
    setWorkerCountTodayDue(dashboardResponse.data.workerCountTodayDue)
    setWorkerCountTomorrowDue(dashboardResponse.data.workerCountTomorrowDue)
    setWorkerCountThisWeekDue(dashboardResponse.data.workerCountThisWeekDue)

    setServices(serviceResponse.data.services)
    setDisplays(serviceResponse.data.displays)

  }

  function handleRefresh() {
    loadData()
  }

  function handleFollow() {
    navigation.navigate('Follow', {
      contact_name: userUserName,
    })
  }

  function handleFollowed() {
    navigation.navigate('Followed', {
      contact_name: userUserName,
    })
  }

  function handleSettings() {
    navigation.navigate('Settings');
  }

  function handleToggleInstagram() {
    setToggleInstagram(!toggleInstagram)
  }

  function handleToggleLinkedIn() {
    setToggleLinkedIn(!toggleLinkedIn)
  }

  function handleToggleBio() {
    setToggleBio(!toggleBio)
  }

  async function handleInstagramSubmit() {
    setToggleInstagram(!toggleInstagram)

    dispatch(updateProfileRequest({
      email: user_email,
      instagram: userInstagram,
    }));
  }

  async function handleLinkedInSubmit() {
    setToggleLinkedIn(!toggleLinkedIn)
    dispatch(updateProfileRequest({
      email: user_email,
      linkedin: userLinkedIn,
    }));
  }

  async function handleBioSubmit() {
    setToggleBio(!toggleBio)
    dispatch(updateProfileRequest({
      email: user_email,
      bio: userBio,
    }));
  }

  async function handleToggleServiceCreate() {
    navigation.navigate('ServiceCreate')
  }
// -----------------------------------------------------------------------------
  return (
    <Container>
      <FormScrollView>
{/* Header ----------------------------------------------------------------- */}
        <Header>
          <SpaceView>
            <HeaderImage source={logo}/>
          </SpaceView>
          <BannerView>
            <BannerImage source={banner}/>
          </BannerView>
          <HeaderTouchable onPress={handleRefresh}>
            <AddIcon name='refresh-cw' size={20}/>
          </HeaderTouchable>
          <HeaderTouchable onPress={handleSettings}>
            <AddIcon name='settings' size={21}/>
          </HeaderTouchable>
        </Header>
        <MarginView08/>
        <UserView>
          <UserWrapper>
            <LeftView>
              { userPhoto === undefined || userPhoto === null
                ? (
                  <>
                    <UserImageBackgroundView>
                      <UserImage
                        source={defaultAvatar}
                      />
                    </UserImageBackgroundView>
                  </>
                )
                : (
                  <UserImageBackgroundView>
                    <UserImage
                      source={
                        userPhoto
                          ? { uri: userPhoto.url }
                          : defaultAvatar
                      }
                    />
                  </UserImageBackgroundView>
                )
              }
            </LeftView>
            <UserInfoView>
              <UserNameWrapper>
                <UserNameText>{userUserName}</UserNameText>
                  { userPoints
                    ? (
                      <LabelNormal>({userPoints})</LabelNormal>
                    )
                    : (
                      <LabelNormal>(0)</LabelNormal>
                    )
                  }
              </UserNameWrapper>

              {/* <FirstNameWrapper>
                <LabelBold2>{userFirstName}</LabelBold2>
                <LabelBold2>{userLastName}</LabelBold2>
              </FirstNameWrapper> */}
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
              <SocialMediaButton onPress={handleToggleInstagram}>
                <Iicon name='instagram' size={20}/>
              </SocialMediaButton>
              <SocialMediaText>{userInstagram}</SocialMediaText>
            </SocialMediaView>
            <SocialMediaView>
              <SocialMediaButton onPress={handleToggleLinkedIn}>
                <Iicon name='linkedin' size={20}/>
              </SocialMediaButton>
              <SocialMediaText>{userLinkedIn}</SocialMediaText>
            </SocialMediaView>
          </SocialMediaWrapper>
        </ContentView>
        <MarginView08/>
{/* Received Status -------------------------------------------------------- */}
        <ContentView>
          <StatusView>
            <Label>{t('ReceivedTasksStatus')}</Label>
          </StatusView>
          <MarginView04/>
          <StatusView>
            <BlockSmallWorker>
              <LabelBoldWorker>
                { workerCountReceived !== 0
                  ? workerCountReceived
                  : '-'
                }
              </LabelBoldWorker>
              <LabelNormalWorker>{t('Received')}</LabelNormalWorker>
            </BlockSmallWorker>
            <BlockSmallWorker>
              <LabelBoldWorker>
                { workerCountInitiated !== 0
                  ? workerCountInitiated
                  : '-'
                }
              </LabelBoldWorker>
              <LabelNormalWorker>{t('Open')}</LabelNormalWorker>
            </BlockSmallWorker>
            <BlockSmallWorker>
              <LabelBoldWorker>
                { workerCountFinished !== 0
                  ? workerCountFinished
                  : '-'
                }
              </LabelBoldWorker>
              <LabelNormalWorker>{t('Finished')}</LabelNormalWorker>
            </BlockSmallWorker>
            <BlockSmallWorker>
              <LabelBoldWorker>
                { workerCountCanceled !== 0
                  ? workerCountCanceled
                  : '-'
                }
              </LabelBoldWorker>
              <LabelNormalWorker>{t('Canceled')}</LabelNormalWorker>
            </BlockSmallWorker>
          </StatusView>
          <MarginView04/>
          <StatusView>
            <BlockLargeWorker>
              <BlockSegment>
                <LabelBoldRed>
                  { workerCountOverDue !== 0
                    ? workerCountOverDue
                    : '-'
                  }
                </LabelBoldRed><LabelSpace/>
                <LabelBoldWorker2>
                  { workerCountTodayDue !== 0
                    ? workerCountTodayDue
                    : '-'
                  }
                </LabelBoldWorker2><LabelSpace/>
                <LabelBoldWorker2>
                  { workerCountTomorrowDue !== 0
                    ? workerCountTomorrowDue
                    : '-'
                  }
                </LabelBoldWorker2><LabelSpace/>
                <LabelBoldWorker2>
                  { workerCountThisWeekDue !== 0
                    ? workerCountThisWeekDue
                    : '-'
                  }
                </LabelBoldWorker2><LabelSpace/>
                <LabelBoldWorker2>
                  { workerCountInitiated !== 0
                    ? workerCountInitiated
                    : '-'
                  }
                </LabelBoldWorker2>
              </BlockSegment>
              <BlockSegment>
                <StatusCircleRed/><StatusLineWorker/>
                <StatusCircleWorker/><StatusLineWorker/>
                <StatusCircleWorker/><StatusLineWorker/>
                <StatusCircleWorker/><StatusLineWorker/>
                <StatusCircleWorker/>
              </BlockSegment>
              <BlockSegment>
                <LabelSmallRed>{t('Overdue')}</LabelSmallRed><LabelSmallSpace/>
                <LabelSmallWorker2>{t('DueToday')}</LabelSmallWorker2><LabelSmallSpace/>
                <LabelSmallWorker>{t('Tomorrow')}</LabelSmallWorker><LabelSmallSpace/>
                <LabelSmallWorker>{t('ThisWeek')}</LabelSmallWorker><LabelSmallSpace/>
                <LabelSmallWorker2>Total</LabelSmallWorker2>
              </BlockSegment>
            </BlockLargeWorker>
          </StatusView>
        </ContentView>
        <MarginView08/>
        <MarginView08/>
{/* Sent Status ------------------------------------------------------------ */}
        <ContentView>
          <StatusView>
            <Label>{t('SentTasksStatus')}</Label>
          </StatusView>
          <MarginView04/>
          <StatusView>
            <BlockSmallBoss>
              <LabelBoldBoss>
                { userCountSent !== 0
                  ? userCountSent
                  : '-'
                }
              </LabelBoldBoss>
              <LabelNormalBoss>{t('Sent')}</LabelNormalBoss>
            </BlockSmallBoss>

            <BlockSmallBoss>
              <LabelBoldBoss>
                { userCountInitiated !== 0
                  ? userCountInitiated
                  : '-'
                }
              </LabelBoldBoss>
              <LabelNormalBoss>{t('Open')}</LabelNormalBoss>
            </BlockSmallBoss>
            <BlockSmallBoss>
              <LabelBoldBoss>
                { userCountFinished !== 0
                  ? userCountFinished
                  : '-'
                }
              </LabelBoldBoss>
              <LabelNormalBoss>{t('Finished')}</LabelNormalBoss>
            </BlockSmallBoss>
            <BlockSmallBoss>
              <LabelBoldBoss>
                { userCountCanceled !== 0
                  ? userCountCanceled
                  : '-'
                }
              </LabelBoldBoss>
              <LabelNormalBoss>{t('Canceled')}</LabelNormalBoss>
            </BlockSmallBoss>
          </StatusView>
          <MarginView04/>
          <StatusView>
            <BlockLargeBoss>
              <BlockSegment>
                <LabelBoldRed>
                  { userCountOverDue !== 0
                    ? userCountOverDue
                    : '-'
                  }
                </LabelBoldRed><LabelSpace/>
                <LabelBoldBoss2>
                  { userCountTodayDue !== 0
                    ? userCountTodayDue
                    : '-'
                  }
                </LabelBoldBoss2><LabelSpace/>
                <LabelBoldBoss2>
                  { userCountTomorrowDue !== 0
                    ? userCountTomorrowDue
                    : '-'
                  }
                </LabelBoldBoss2><LabelSpace/>
                <LabelBoldBoss2>
                  { userCountThisWeekDue !== 0
                    ? userCountThisWeekDue
                    : '-'
                  }
                </LabelBoldBoss2><LabelSpace/>
                <LabelBoldBoss2>
                  { userCountInitiated !== 0
                    ? userCountInitiated
                    : '-'
                  }
                </LabelBoldBoss2>
              </BlockSegment>
              <BlockSegment>
                <StatusCircleRed/><StatusLineBoss/>
                <StatusCircleBoss/><StatusLineBoss/>
                <StatusCircleBoss/><StatusLineBoss/>
                <StatusCircleBoss/><StatusLineBoss/>
                <StatusCircleBoss/>
              </BlockSegment>
              <BlockSegment>
                <LabelSmallRed>{t('Overdue')}</LabelSmallRed><LabelSmallSpace/>
                <LabelSmallBoss2>{t('DueToday')}</LabelSmallBoss2><LabelSmallSpace/>
                <LabelSmallBoss>{t('Tomorrow')}</LabelSmallBoss><LabelSmallSpace/>
                <LabelSmallBoss>{t('ThisWeek')}</LabelSmallBoss><LabelSmallSpace/>
                <LabelSmallBoss2>Total</LabelSmallBoss2>
              </BlockSegment>
            </BlockLargeBoss>
          </StatusView>
        </ContentView>
        <MarginView08/>
        <MarginView08/>
{/* Bio -------------------------------------------------------------------- */}
        <ContentView>
          <StatusView>
            <Label>Bio:</Label>
            <SocialMediaButton onPress={handleToggleBio}>
              <Iicon name='edit-2' size={18}/>
            </SocialMediaButton>
          </StatusView>
          <MarginView04/>
          <StatusView>
            <BlockLarge>
              { userBio
                ? (<BioText>{userBio}</BioText>)
                : (<BioText>-</BioText>)
              }
            </BlockLarge>
          </StatusView>
          <MarginView08/>
          <MarginView08/>
        </ContentView>
{/* Services --------------------------------------------------------------- */}
        <ContentView>
          <StatusView>
            <Label>{t('SavedTasks')}</Label>
            <SocialMediaButton onPress={handleToggleServiceCreate}>
              <Iicon name='plus' size={20}/>
            </SocialMediaButton>
          </StatusView>
          <MarginView04/>
          <ServiceView>
            { services && services[0] != null
              ? services.map(s => (
                <Service
                  key={s.id}
                  data={s}
                  navigation={navigation}
                  display={false}
                >{s.name}</Service>
              ))
              : (
                <LabelMild>{t('NoSavedTasks')}</LabelMild>
              )
          }


          </ServiceView>
        </ContentView>
        <MarginView08/>
{/* Displayed in Worker ---------------------------------------------------- */}
        <ContentView>
          <StatusView>
            <Label>{t('DisplayedIn')}</Label>
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
                workerPage={false}
              >{s.name}</Service>
            ))
            : (
              <LabelMild>{t('NoDisplayed')}</LabelMild>
            )
          }
            </ServiceView>
        </ContentView>
        <MarginView08/>
        <MarginView08/>
 {/* Modal ----------------------------------------------------------------- */}
        <Modal isVisible={toggleInstagram}>
          <ModalView>
            <MarginView08/>
            <ModalWrapper01>
              <Label>{t('EditInstagram')}</Label>
              <MarginView04/>
              <Input
                enablesReturnKeyAutomatically
                multiline
                value={userInstagram}
                onChangeText={setUserInstagram}
                placeholder="@username"
              />
              <MarginView08/>
              <Button type={'inverted'} onPress={handleToggleInstagram}>
                Cancel
              </Button>
              <MarginView04/>
              <Button type={'submit'} onPress={handleInstagramSubmit}>
                OK
              </Button>
            </ModalWrapper01>
            <MarginView08/>
          </ModalView>
        </Modal>

        <Modal isVisible={toggleLinkedIn}>
          <ModalView>
            <MarginView08/>
            <ModalWrapper01>
              <Label>{t('EditLinkedIn')}</Label>
              <MarginView04/>
              <Input
                enablesReturnKeyAutomatically
                multiline
                value={userLinkedIn}
                onChangeText={setUserLinkedIn}
                placeholder={t('LowerCaseUsername')}
              />
              <MarginView04/>
              <LinkedInWrapper>
                <LabelNormalSocialMedia>
                  {t('JustWrite')}
                </LabelNormalSocialMedia>
              </LinkedInWrapper>
              <LinkedInWrapper>
                <LabelNormalSocialMedia>Ex: https://www.linkedin.com/in/</LabelNormalSocialMedia>
                <LabelBoldSocialMedia>{t('LowerCaseUsername')}</LabelBoldSocialMedia>
                <LabelNormalSocialMedia>/</LabelNormalSocialMedia>
              </LinkedInWrapper>
              <MarginView08/>
              <Button type={'inverted'} onPress={handleToggleLinkedIn}>
                {t('Cancel')}
              </Button>
              <MarginView04/>
              <Button type={'submit'} onPress={handleLinkedInSubmit}>
                OK
              </Button>
            </ModalWrapper01>
            <MarginView08/>
          </ModalView>
        </Modal>

        <Modal isVisible={toggleBio}>
          <ModalView>
            <MarginView08/>
            <ModalWrapper01>
              <Label>{t('EditBio')}</Label>
              <MarginView04/>
              <Input
                enablesReturnKeyAutomatically
                multiline
                numberOfLines={4}
                value={userBio}
                onChangeText={setUserBio}
                placeholder="Biography"
              />
              <MarginView08/>

              <Button type={'inverted'} onPress={handleToggleBio}>
                {t('Cancel')}
              </Button>
              <MarginView04/>
              <Button type={'submit'} onPress={handleBioSubmit}>
                OK
              </Button>
            </ModalWrapper01>
            <MarginView08/>
          </ModalView>
        </Modal>

      </FormScrollView>
    </Container>
  )
}
