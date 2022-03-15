/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import { enUS, pt } from 'date-fns/locale/pt';
import defaultAvatar from '~/assets/defaultAvatar.png';
import { useTranslation } from 'react-i18next';
// import PushNotification from "react-native-push-notification";
// -----------------------------------------------------------------------------
import {
  AcceptButtonView,
  AlignCheckBoxView, AlignDetailsView,
  BackButton, BackIcon, BackIcon02, BackText, BodyView, BodyWrapper,
  BellIcon, BottomHeaderView, ButtonForModal, ButtonIcon, ButtonWrapper,
  CenterView, CheckBoxView, CheckBoxWrapper, ConfirmIcon, Container,
  DescriptionView, DescriptionSpan, DescriptionSpan02,
  DatesAndButtonView, DueTimeView, DueTime,
  FormScrollView,
  HrLine,
  IconsView,
  Image, ImageView, ImageWrapper, InnerStatusView,
  Label, LabelInitiated, LabelEnded, LeftView,
  MarginView02, MarginView04, MarginView08,
  ModalHeaderCenter, ModalHeaderLeft, ModalHeaderRight, ModalHeaderView, ModalView, ModalText,
  NameText,
  OuterStatusView,
  RejectTaskInput, RightView,
  StartTimeView, StartTime,
  TagView, TitleView, TaskIcon, TitleIcon,
  TitleText, TitleTextModal, TaskAttributesView,
  ToText, ToWorkerView,
  UnreadMessageCountText, UserImage, WorkerImageBackground,
} from './styles';
import { updateTasks } from '~/store/modules/task/actions';
import { updateChatInfo } from '~/store/modules/message/actions';
import api from '~/services/api';
import Button from '~/components/Button'
import ButtonForIcon from '~/components/ButtonForIcon'
// -----------------------------------------------------------------------------
const formattedDate = fdate =>
  fdate == null
    ? '-'
    : format(parseISO(fdate), "MMM'/'dd'/'yyyy", { locale: enUS });

const formattedDateTime = fdate =>
  fdate == null
    ? '-'
    : format(parseISO(fdate), "MMM'/'dd'/'yyyy HH:mm", { locale: enUS });

export default function Task({ data, navigation, taskConditionIndex }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const user_id = data.user.id;
  const worker_id = data.worker.id;
  const task_id = data.id;
  const userData = data.user;
  const workerData = data.worker;
  const dueDate = parseISO(data.due_date);
  const endDate = parseISO(data.end_date);
  const subTasks = data.sub_task_list;
  const points = data.points;
  const subPoints = points - 100;
  const score = data.score;
  const confirmPhoto = data.confirm_photo;

  const [toggleTask, setToggleTask] = useState();
  const [toggleModal, setToggleModal] = useState(false);
  const [togglePhotoModal, setTogglePhotoModal] = useState();
  const [toggleConfirmModal, setToggleConfirmModal] = useState(false);
  const [rejectTaskInputValue, setRejectTaskInputValue] = useState();
  const [updateStatus, setUpdateStatus] = useState();
  const [messageBell, setMessageBell] = useState();
  const[statusResult, setStatusResult] = useState(0);
  const[scoreResult, setScoreResult] = useState(0);
  const [ sendingIndicator, setSendingIndicator ] = useState();

  const taskAttributesArray = [ t('Low'), t('Medium'), t('High'), '-']

  useEffect (() => {
    handleMessageBell()
  }, [data])

  useMemo(() => {
    return handleStatus()
  }, [updateStatus]);

  async function handleMessageBell() {
    // const response = await api.get(`messages/${data.message_id}`)
    // setMessageBell(response.data.messages)

    const unsubscribe = firestore()
      .collection(`messages/task/${data.id}`)
      .orderBy('createdAt')
      .onSnapshot((querySnapshot) => {
        try {
          const data = querySnapshot.docs.map(d => ({
            ...d.data(),
          }));
          // lastMessageRef.current.scrollToEnd({ animated: false })
          setMessageBell(data)
        }
        catch {
          console.log('Error from querySnapshot')
        }

      })
    return unsubscribe;
  }

  async function handleStatus() {
    let weige = 0;
    let tempScore = subPoints;
    subTasks.map(s => {
      if(s.complete === true) {
        weige = weige + s.weige_percentage
      }
    })
    tempScore = Math.round(tempScore * (weige / 100))
    const response = await api.put(`tasks/${data.id}`, {
      status_bar: Math.round(weige),
      score: tempScore,
    })
    setStatusResult(response.data.status_bar)
    setScoreResult(response.data.score)
    // return Math.round(weige);
    return;
  }

  const pastDueDate = () => {
    let flag = false;
    new Date() > dueDate ? flag = true : flag = false
    return flag
  }

  const endPastDueDate = () => {
    let flag = false;
    endDate > dueDate ? flag = true : flag = false
    return flag
  }

  async function updateBell(editedSubTaskList) {
    await api.put(`tasks/${data.id}`, {
      sub_task_list: editedSubTaskList
    })
  }

  function handleToggleTask() {
    setToggleTask(!toggleTask)
    if(hasUnread(data.sub_task_list) !== 0) {
      const editedSubTaskList = data.sub_task_list
      editedSubTaskList.map(e => {
        e.worker_read = true
      })
      updateBell(editedSubTaskList)
    }
  }

  async function handleToggleCheckBox(value, position) {
    const editedSubTaskList = data.sub_task_list
    editedSubTaskList[position].complete = value
    editedSubTaskList[position].user_read = false

    await api.put(`tasks/${data.id}`, {
      sub_task_list: editedSubTaskList,
    })

    await api.put(`/tasks/${data.id}/notification/worker/subtask`, {
      position: position,
    })

    dispatch(updateTasks(new Date()))
    setUpdateStatus(new Date())
  }

  async function handleMessageConversation() {
    setToggleTask(!toggleTask)
    const response = await api.get('/messages', {
      params: {
        user_id: worker_id,
        worker_id: user_id,
      },
    })
    const messageData = response.data
    console.log(response.data)
    if(response.data.message === null) {
      const chat_id = Math.floor(Math.random() * 1000000)

      navigation.navigate('MessagesConversationPage', {
        // id: data.id,
        user_id: worker_id,
        user_name: workerData.worker_name,
        userData: workerData,
        worker_id: user_id,
        worker_name: userData.user_name,
        workerData: userData,
        chat_id: chat_id,
        avatar: userData.avatar,
        first_message: true,
      });
      dispatch(updateChatInfo(userData, workerData));
      return
    }

    navigation.navigate('MessagesConversationPage', {
      // id: data.id,
      user_id: workerData.id,
      user_name: workerData.worker_name,
      userData: workerData,
      worker_id: userData.id,
      worker_name: userData.user_name,
      workerData: userData,
      avatar: userData.avatar,
      chat_id: response.data.message.chat_id,
      inverted: response.data.inverted,
    });
    dispatch(updateChatInfo(userData, workerData));
  }

  async function handleToggleAccept() {
    // setToggleAccept(!toggleAccept)
    await api.put(`tasks/${data.id}/notification/worker`, {
      status: {
        status: 2,
        // comment: `Accepted: ${data.name}`,
        comment: t('AcceptedComment', { taskName: `${data.name}` })
      },
      initiated_at: new Date(),
    })
    dispatch(updateTasks(new Date()))
  }

  async function handleCancelTask() {
    await api.put(`tasks/${data.id}/notification/worker`, {
      status: {
        status: 4,
        canceled_by: "worker",
        // comment: `Declined: ${data.name}. Comment: ${rejectTaskInputValue}`,
        comment: t('DeclinedComment', { taskName: `${rejectTaskInputValue}` }),
      },
      canceled_at: new Date(),
    });
    setToggleModal(!toggleModal)
    dispatch(updateTasks(new Date()))
  }

  const hasUnread = (array) => {
    try {
      let sum = 0;
      for(let i = 0; i < array.length; i++) {
        if(array[i].worker_read === false) {
          sum += 1
        }
      }
      return sum
    } catch(error) {
      return
    }
  }

  function handleConfirm() {
    if(data.confirm_photo) {
      setTogglePhotoModal(!togglePhotoModal)
    } else {
      setToggleConfirmModal(!toggleConfirmModal)
    }
  }

  async function handleConfirmWithoutPhoto() {
    let tempScore = scoreResult + 100;
    await api.put(`tasks/confirm/${data.id}`, {
      score: tempScore,
    });
    await api.put(`users/points/${worker_id}`, {
      points: tempScore,
    })
    setToggleConfirmModal(!toggleConfirmModal)
    dispatch(updateTasks(new Date()))
  }

  async function takePhotoFromCamera() {
    let tempScore = scoreResult + 100;
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async image => {
      // console.log(image)
      const formData = new FormData();
      formData.append('signatureImage', {
        // uri: Platform.OS === 'ios' ? image.sourceURL : image.path,
        uri: image.path,
        // type: "image/jpg",
        type: "image/jpg",
        name: `signature_${task_id}.jpg`,
      });

      try {
        setSendingIndicator(!sendingIndicator)
        const response = await api.post('signatures', formData);

        const { signature_id } = response.data;
        tempScore = tempScore + 100;

        await api.put(`tasks/confirm/${task_id}`, {
          signature_id,
          score: tempScore,
        });

        await api.put(`users/points/${worker_id}`, {
          points: tempScore,
        })
        Alert.alert(
          t('Success'),
          t('PhotoSent'),
          [
            {
              text: 'OK',
              // onPress: () => console.log('OKBJ')
            }
          ],
          {cancelable: false }
        )
        setSendingIndicator(false)
        setTogglePhotoModal(!togglePhotoModal)
      }
      catch {
        setSendingIndicator(false)
        Alert.alert(
          t('ErrorNotAblePhoto'),
          t('PleaseTryAgain'),
          [
            {
              text: 'OK',
              // onPress: () => console.log('OKBJ')
            }
          ],
          {cancelable: false }
        )
        setTogglePhotoModal(!togglePhotoModal)
      }
    })
    // setTogglePhotoModal(!togglePhotoModal)
    // setToggleTask(!toggleTask)
  }

  async function chooseFromLibrary() {
    // console.warn('choose Photo')
      let tempScore = scoreResult + 100;

      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      }).then(async image => {
        console.log(image.path)
        const formData = new FormData();
        formData.append('signatureImage', {
          // uri: Platform.OS === 'ios' ? image.sourceURL : image.path,
          uri: image.path,
          type: Platform.OS === 'ios' ? "image/*" : "image/jpg",
          // type: "image/jpg",
          // type: "image/*",
          name: `signature_${task_id}.jpg`,
        });

        try {
          setSendingIndicator(!sendingIndicator)
          const response = await api.post('signatures', formData);

          const { signature_id } = response.data;


          await api.put(`tasks/confirm/${task_id}`, {
            signature_id,
            score: tempScore,
          });

          await api.put(`users/points/${worker_id}`, {
            points: tempScore,
          })
          Alert.alert(
            t('Success'),
            t('PhotoSent'),
            [
              {
                text: 'OK',
                onPress: () => console.log('OKBJ')
              }
            ],
            {cancelable: false }
          )
          setSendingIndicator(false)
          setTogglePhotoModal(!togglePhotoModal)

        }
        catch {
          Alert.alert(
            t('ErrorNotAblePhoto'),
            t('PleaseTryAgain'),
            [
              {
                text: 'OK',
                // onPress: () => console.log('OKBJ')
              }
            ],
            {cancelable: false }
          )
          setTogglePhotoModal(!togglePhotoModal)
        }
      });

    }
  // -----------------------------------------------------------------------------
  return (
    <Container
      taskConditionIndex={taskConditionIndex}
      onPress={handleToggleTask}
    >
      <LeftView>
        { userData === undefined || userData.avatar === null
          ? (
            <UserImage source={defaultAvatar}/>
          )
          : (
            <WorkerImageBackground>
              <UserImage source={{ uri: userData.avatar.url }}/>
            </WorkerImageBackground>
          )
        }
      </LeftView>

      <BodyView>
        <BodyWrapper>
          <MarginView04/>
          <TitleView>
            <TitleText numberOfLines={2}>{data.name}</TitleText>
          </TitleView>
          <MarginView04/>

          <ToWorkerView>
            <TitleIcon name="coffee"/>
            <ToText numberOfLines={1}>{data.user.user_name}</ToText>
            <TitleIcon name="briefcase"/>
            <NameText numberOfLines={1}>{data.worker.worker_name}</NameText>
          </ToWorkerView>

          <DatesAndButtonView>
            <TagView>
              { data.initiated_at
                ? (
                  <LabelInitiated>{t('Started')}</LabelInitiated>
                )
                : (
                  <Label>{t('SingularReceived')}</Label>
                )
              }
            </TagView>
            <TagView>
              { data.end_date
                ? (
                  <>
                    <LabelEnded pastDueDate={pastDueDate()}>{t('Ended')}</LabelEnded>
                    <DueTimeView pastDueDate={endPastDueDate()}>
                      <DueTime>{formattedDate(data.end_date)}</DueTime>
                    </DueTimeView>
                  </>
                )
                : (
                  <>
                    <Label>{t('Due')}</Label>
                    <DueTimeView pastDueDate={pastDueDate()}>
                      <DueTime>{formattedDate(data.due_date)}</DueTime>
                    </DueTimeView>
                  </>
                )
              }
            </TagView>
          </DatesAndButtonView>

          <BottomHeaderView>
            <OuterStatusView>
              <InnerStatusView
                statusResult={statusResult}
                colors={['#ffdd33', '#ff892e']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ width: `${statusResult}%`}}
              ></InnerStatusView>
            </OuterStatusView>
            <StartTime>{Math.round(statusResult*(subPoints)/100)+100}/{points}</StartTime>
          </BottomHeaderView>
          <MarginView04/>
        </BodyWrapper>
      </BodyView>

      <RightView>
        { (hasUnread(data.sub_task_list) === 0)
          ? (
            null
          )
          : (
            <BellIcon name="bell">
              <UnreadMessageCountText>{hasUnread(data.sub_task_list)}</UnreadMessageCountText>
            </BellIcon>
          )
        }
        { (hasUnread(messageBell) === 0)
          ? (
            null
          )
          : (
            <BellIcon name="message-circle">
              <UnreadMessageCountText>{hasUnread(messageBell)}</UnreadMessageCountText>
            </BellIcon>
          )
        }
      </RightView>
{/* ------------------------------------------------------------------------ */}
      <Modal isVisible={toggleTask}>
        <FormScrollView>
          <ModalHeaderView>
            <ModalHeaderLeft>
              <ButtonForModal
                type='submit'
                onPress={handleToggleTask}
              >
                { Platform.OS === 'ios'
                  ? (
                    <BackIcon name="chevron-left" size={24}/>
                  )
                  : (
                    <BackIcon name="arrow-left" size={20}/>
                  )
                }
                <BackText>Back</BackText>
              </ButtonForModal>
            </ModalHeaderLeft>
            <ModalHeaderCenter/>
            <ModalHeaderRight>
            <ButtonForModal
                type='submit'
                onPress={handleToggleTask}
              >
                { Platform.OS === 'ios'
                  ? (
                    <BackIcon02
                      name="message-square"
                      size={24}
                      onPress={handleMessageConversation}
                    />
                  )
                  : (
                    <BackIcon02
                      name="message-square"
                      size={20}
                      onPress={handleMessageConversation}
                    />
                  )
                }

              </ButtonForModal>
              <ButtonForModal
                type='submit'
                onPress={handleToggleTask}
              >
                { Platform.OS === 'ios'
                  ? (
                    <BackIcon02
                      name="check-square"
                      size={24}
                      onPress={handleConfirm}
                    />
                  )
                  : (
                    <BackIcon02
                      name="check-square"
                      size={20}
                      onPress={handleConfirm}
                    />
                  )
                }

              </ButtonForModal>
            </ModalHeaderRight>
          </ModalHeaderView>

          <MarginView02/>
          <DescriptionView>
            <MarginView04/>
            <CenterView>
              <TitleIcon name="clipboard"/>
              <TitleTextModal>{data.name}</TitleTextModal>
            </CenterView>
            <MarginView04/>

            <AlignDetailsView>
              <MarginView02/>
              <TagView>
                <Label>To:</Label>
                  <ToText>{data.worker.worker_name}</ToText>
              </TagView>
              <TagView>
                <Label>{t('StartedDateAndTime')}</Label>
                { data.initiated_at
                  ? (
                    <>

                      <StartTimeView>
                        <StartTime>{formattedDateTime(data.initiated_at)}</StartTime>
                      </StartTimeView>
                    </>
                  )
                  : (
                    <>

                      <StartTimeView initiated={data.initiated_at}>
                        <StartTime>{formattedDateTime(data.start_date)}</StartTime>
                      </StartTimeView>
                    </>
                  )
                }
              </TagView>
              <TagView>
                <Label>{t('DueDateAndTime')}</Label>
                { data.end_date !== null
                  ? (
                    <DueTimeView style={{backgroundColor:'#eee'}}>
                      <DueTime>{formattedDateTime(data.due_date)}</DueTime>
                    </DueTimeView>
                  )
                  : (
                    <DueTimeView pastDueDate={pastDueDate()}>
                      <DueTime>{formattedDateTime(data.due_date)}</DueTime>
                    </DueTimeView>
                  )
                }
              </TagView>
              { data.end_date !== null &&
                (
                    <TagView>
                      <Label>{t('Ended:')}</Label>
                      <DueTimeView pastDueDate={endPastDueDate()}>
                        <DueTime>{formattedDateTime(data.end_date)}</DueTime>
                      </DueTimeView>
                    </TagView>
                )
              }
              <TagView>
                <Label>{t('Priority')}</Label>
                <TaskAttributesView taskAttributes={data.task_attributes[0]-1}>
                  <DueTime>{taskAttributesArray[JSON.stringify(data.task_attributes[0]-1)]}</DueTime>
                </TaskAttributesView>
              </TagView>
              <TagView>
                <Label>{t('ConfirmWithPhoto')}</Label>
                { confirmPhoto
                  ? (
                    <ToText>{t('Yes')}</ToText>
                  )
                  : (
                    <ToText>{t('No')}</ToText>
                  )
                }
              </TagView>
              <MarginView04/>
            </AlignDetailsView>
          </DescriptionView>
          <MarginView08/>

          <DescriptionView>
            <MarginView04/>
            <Label>{t('SubItems')}</Label>
            <MarginView04/>
            <CheckBoxWrapper>
              { data.sub_task_list.map((s, index) => (
                <AlignCheckBoxView key={index}>
                  <CheckBoxView>
                      <CheckBox
                        disabled={data.status.status === 1 ? true : false}
                        value={s.complete}
                        onValueChange={
                          (newValue) => handleToggleCheckBox(newValue, index)
                        }
                      />
                      <DescriptionSpan>{s.weige_percentage}%</DescriptionSpan>
                      <DescriptionSpan type="check-box">{s.description}</DescriptionSpan>
                  </CheckBoxView>
                </AlignCheckBoxView>
              ))}
            </CheckBoxWrapper>
          </DescriptionView>

            { data.description
              ? (
                <>
                  <MarginView08/>
                  <DescriptionView>
                    <MarginView04/>
                    <Label>{t('OtherComments')}</Label>
                    <MarginView04/>
                    <DescriptionSpan02>{data.description}</DescriptionSpan02>
                    <MarginView04/>
                  </DescriptionView>
                </>
              )
              : null
            }
            <MarginView08/>
          { data.status && data.status.status !== 1
            ? (
              <>

              </>
            )
            : (
              <AcceptButtonView>
                <MarginView04/>
                <CenterView>
                  <ModalText>{t('AcceptThisTask')}</ModalText>
                </CenterView>
                <MarginView04/>
                <ButtonWrapper>
                  { taskConditionIndex === 1
                    ? (
                      <>
                        <Button type={'submit'} small={true} onPress={handleToggleAccept}>
                          {t('Yes')}
                        </Button>
                        <Button type={'inverted'} small={true} onPress={() => setToggleModal(!toggleModal)}>
                          {t('No')}
                        </Button>
                      </>
                    )
                    : (
                      null
                    )
                  }
                </ButtonWrapper>
                <MarginView08/>
              </AcceptButtonView>
            )
          }

          { data.signature &&
            <>
              <ImageWrapper>
                <Label>{t('ConfirmationPhoto')}</Label>
                <MarginView04/>
                <ImageView>
                  <Image source={{ uri: data.signature.url }}/>
                </ImageView>
              </ImageWrapper>
              {/* ----------- */}
              <MarginView04/>
              <HrLine/>
              <MarginView04/>
              {/* ----------- */}
            </>
          }
          <MarginView04/>
          <MarginView08/>

          <Modal isVisible={toggleConfirmModal}>
            <ModalView>
              <MarginView08/>
              <CenterView>
                <ModalText>{t('ConfirmAndEnd')}</ModalText>
              </CenterView>
              <MarginView04/>
              <ButtonWrapper>
                <Button type={'submit'} small={true} onPress={handleConfirmWithoutPhoto}>
                {t('Yes')}
                </Button>
                <Button type={'inverted'} small={true} onPress={() => setToggleConfirmModal(!toggleConfirmModal)}>
                {t('Back')}
                </Button>
              </ButtonWrapper>
              <MarginView08/>
            </ModalView>
          </Modal>

          <Modal isVisible={toggleModal}>
            <ModalView>
              <MarginView08/>
              <RejectTaskInput
                placeholder={t('Comments')}
                value={rejectTaskInputValue}
                onChangeText={setRejectTaskInputValue}
                mutiline={true}
              />
              <MarginView08/>
              <AcceptButtonView>
                <CenterView>
                  <ModalText>{t('AreYouSureDecline')}</ModalText>
                </CenterView>
                <MarginView04/>
                <ButtonWrapper>
                  <Button type={'submit'} small={true} onPress={handleCancelTask}>
                    Yes
                  </Button>
                  <Button type={'inverted'} small={true} onPress={() => setToggleModal(!toggleModal)}>
                    Back
                  </Button>
                </ButtonWrapper>
              </AcceptButtonView>
              <MarginView08/>
            </ModalView>
          </Modal>

          <Modal isVisible={togglePhotoModal}>
            <ModalView>
              <MarginView08/>
              <AcceptButtonView>
                <CenterView>
                  <ModalText>{t('ChoosePhotoFrom')}</ModalText>
                </CenterView>
                <MarginView04/>
                <ButtonWrapper>
                  <Button type={'submit'} small={true} onPress={() => chooseFromLibrary()}>
                    {t('Reel')}
                  </Button>
                  <Button type={'inverted'} small={true} onPress={() => takePhotoFromCamera()}>
                    {t('Camera')}
                  </Button>
                </ButtonWrapper>
              </AcceptButtonView>
              {/* ----------- */}
              <MarginView04/>
              <HrLine/>
              <MarginView04/>
              {/* ----------- */}
              <DescriptionView>
                <Button small={true} onPress={() => setTogglePhotoModal(!togglePhotoModal)}>
                  {t('Back')}
                </Button>
              </DescriptionView>
              <MarginView08/>
            </ModalView>
          </Modal>
        </FormScrollView>
      </Modal>
      <Modal isVisible={sendingIndicator}>
        <ModalView>
          <MarginView08/>
          <ModalText>{t('Sending')}</ModalText>
          <ActivityIndicator size="small" color="#1B2432"/>
          <MarginView08/>
        </ModalView>
      </Modal>
    </Container>
  );
}
