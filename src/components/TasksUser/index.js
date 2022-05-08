/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-native-modal';
import { format, parseISO } from 'date-fns';
import CheckBox from '@react-native-community/checkbox'; //https://github.com/react-native-checkbox/react-native-checkbox
import firestore from '@react-native-firebase/firestore';
import { enUS, ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import {
  AcceptButtonView,
  ButtonWrapper,
  AlignDetailsView, AlignCheckBoxView,
  BackButton, BackIcon, BackIcon02, BackText,
  BodyView, BodyWrapper, ButtonForModal, ButtonForModalRight, ButtonView,
  BellIcon, BottomHeaderView, ButtonText,
  CenterView, CheckBoxView, CheckBoxWrapper, Container,
  DescriptionView, DescriptionBorderView, DescriptionSpan,
  DatesAndButtonView, DueTimeView, DueTime,
  FormScrollView,
  HrLine,
  IconsView,
  Image, ImageView, ImageWrapper, InnerStatusView,
  Label, LabelInitiated, LabelEnded, LeftUserView,
  MarginView02, MarginView04, MarginView08,
  ModalHeaderCenter, ModalHeaderLeft, ModalHeaderRight, ModalHeaderView, ModalView, ModalText,
  NameText,
  OuterStatusView,
  RightView,
  StartTimeView, StartTime,
  TagView, TitleView, TaskIcon, TitleIcon, TitleIconUser,
  TitleUserText, TitleTextModalUser, TaskAttributesView,
  ToText, ToTextModal, ToWorkerView,
  UnreadMessageCountText, UserImage, UserImageBackground,
} from '../Tasks/styles';
import { updateTasks } from '~/store/modules/task/actions';
import { updateChatInfo } from '~/store/modules/message/actions';
import defaultAvatar from '~/assets/defaultAvatar.png';
import Button from '~/components/Button'
import ButtonForIcon from '~/components/ButtonForIcon'
import api from '~/services/api';
// -----------------------------------------------------------------------------

export default function TaskUser({ data, navigation, taskConditionIndex }) {
  // console.log(data)
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const updated_tasks = useSelector( state => state.task.tasks)

  const formattedDate = fdate =>
  fdate == null
    ? '-'
    : i18n.language === 'en'
      ? format(parseISO(fdate), "MMM'/'dd'/'yyyy", { locale: enUS })
      : format(parseISO(fdate), "dd'/'MMM'/'yyyy", { locale: ptBR })

  const formattedDateTime = fdate =>
    fdate == null
      ? '-'
      : i18n.language === 'en'
        ? format(parseISO(fdate), "MMM'/'dd'/'yyyy h:mm aaa", { locale: enUS })
        : format(parseISO(fdate), "MMM'/'dd'/'yyyy HH:mm", { locale: ptBR });

  const user_id = data.user.id;
  const user_email = data.user.email;

  const worker_id = data.worker.id;
  const worker_email = data.worker.email;
  const workerData = data.worker;

  const userData = data.user;
  const dueDate = parseISO(data.due_date);
  const endDate = parseISO(data.end_date);
  const subTasks = data.sub_task_list;
  const points = data.points;
  const subPoints = points - 100;
  const confirmPhoto = data.confirm_photo;
  const status = data.status;
  const [toggleTask, setToggleTask] = useState();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCancelModal, setToggleCancelModal] = useState();
  const [toggleDeleteModal, setToggleDeleteModal] = useState();
  const [statusResult, setStatusResult] = useState(0);
  const [messageBell, setMessageBell] = useState();

  const taskAttributesArray = [ t('Low'), t('Medium'), t('High'), '-']

  useEffect (() => {
    // handleStatus()
    handleMessageBell()
    setStatusResult(handleStatus())
    // console.log(data)

  //   fetch('https://extreme-ip-lookup.com/json/')
  //   .then( res => res.json())
  //   .then(response => {
  //    console.log("Country is : ", response);
  //  })
  //  .catch((data, status) => {
  //    console.log('Request failed:', data);
  //  });
  }, [ updated_tasks ])

  useMemo(() => {
    handleStatus()
  }, [updated_tasks]);

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
          setMessageBell(data)
        }
        catch {
          console.log('Error from querySnapshot')
        }

      })
    return unsubscribe;

  }

  function handleStatus() {
    let weige = 0;
    subTasks.map(s => {
      if(s.complete === true) {
        weige = weige + s.weige_percentage
      }
    })
    return Math.round(weige);
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
    try {
      await api.put(`tasks/${data.id}`, {
        sub_task_list: editedSubTaskList
      })
    }
    catch(error) {
      console.log('error in put tasks/:id')
    }
  }

  function handleToggleTask() {
    setToggleTask(!toggleTask)
    if(hasUnread(data.sub_task_list) !== 0) {
      const editedSubTaskList = data.sub_task_list
      editedSubTaskList.map(e => {
        e.user_read = true
      })
      updateBell(editedSubTaskList)
    }
    return
  }

  async function handleMessageConversation() {
    setToggleTask(!toggleTask)
    const response = await api.get('/messages/user', {
      params: {
        user_email: user_email,
        worker_email: worker_email,
      },
    })
    const messageData = response.data
    if(response.data.message === null) {
      const chat_id = Math.floor(Math.random() * 1000000)
      navigation.navigate('MessagesConversationPage', {
        // id: data.id,
        user_id: user_id,
        user_name: userData.user_name,
        user_email: user_email,
        userData: userData,

        worker_id: worker_id,
        worker_name: workerData.worker_name,
        worker_email: worker_email,
        workerData: workerData,

        chat_id: chat_id,
        avatar: workerData.avatar,
        first_message: true,
      });
      dispatch(updateChatInfo(userData, workerData));
      return
    }

    navigation.navigate('MessagesConversationPage', {
      // id: data.id,
      user_id: userData.id,
      user_name: userData.user_name,
      user_email: user_email,
      userData: userData,

      worker_id: workerData.id,
      worker_name: workerData.worker_name,
      worker_email: worker_email,
      workerData: workerData,

      avatar: workerData.avatar,
      chat_id: response.data.message.chat_id,
      inverted: response.data.inverted,
    });
    dispatch(updateChatInfo(userData, workerData));
  }

  function handleEditTask() {
    setToggleTask(!toggleTask)
    navigation.navigate('TaskEdit', {
      id: data.id,
      name: data.name,
      description: data.description,
      sub_task_list: data.sub_task_list,
      task_attributes: data.task_attributes,
      start_date: data.start_date,
      due_date: data.due_date,
      worker: data.worker,
    });
  }

  function handleReviveTask() {
    api.put(`tasks/${data.id}/revive`, {
      status: {
        "status": 1,
        "comment": t('RevivedComment', { taskName: `${data.name}` }),
      }
    });
    setToggleTask(!toggleTask)
    dispatch(updateTasks(new Date()));
  }

  function handleToggleCancelModal() {
    setToggleCancelModal(!toggleCancelModal)
  }

  function handleCancelTask() {
    api.put(`tasks/${data.id}/cancel`, {
      status: {
        "status": 3,
        "comment": t('CanceledComment', { taskName: `${data.name}` }),
      }
    })
    setToggleTask(!toggleTask)
    dispatch(updateTasks(new Date()));
  }

  function handleToggleDeleteModal() {
    setToggleDeleteModal(!toggleDeleteModal)
  }

  function handleDeleteTask() {
    api.delete(`tasks/${data.id}`);
    setToggleTask(!toggleTask)
    dispatch(updateTasks(new Date()));
  }

  function handleScoreTask() {
    setToggleTask(!toggleTask)
  }

  const hasUnread = (array) => {
    try {
      let sum = 0;
      for(let i = 0; i < array.length; i++) {
        if(array[i].user_read === false) {
          sum += 1
        }
      }
      return sum
    } catch(error) {
      return
    }
  }
  // -----------------------------------------------------------------------------
  return (
    <Container
      taskConditionIndex={taskConditionIndex}
      onPress={handleToggleTask}
      >
      <LeftUserView>
        { workerData === undefined || workerData.avatar === null
          ? (
            <UserImage source={defaultAvatar}/>
          )
          : (
            <UserImageBackground>
              <UserImage source={{ uri: workerData.avatar.url }}/>
            </UserImageBackground>
          )
        }
      </LeftUserView>

      <BodyView>
        <BodyWrapper>
          <MarginView04/>
          <TitleView>
            <TitleUserText numberOfLines={2}>{data.name}</TitleUserText>
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
                  <>
                    { taskConditionIndex === 2
                      ? (<Label>-</Label>)
                      : (<LabelInitiated>{t('Started')}</LabelInitiated>)
                    }
                  </>
                )
                : (<Label>{t('Sent')}</Label>)
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
            {/* <StartTime>{statusResult}%</StartTime> */}
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
            <BellIcon name="message-square">
              <UnreadMessageCountText>{hasUnread(messageBell)}</UnreadMessageCountText>
            </BellIcon>
          )
        }
      </RightView>
{/* ------------------------------------------------------------------------ */}
      <Modal isVisible={toggleTask}>
        {/* <ModalView> */}
          <FormScrollView>
            <MarginView02/>
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
                  <BackText>{t('Back')}</BackText>
                </ButtonForModal>
              </ModalHeaderLeft>
              <ModalHeaderCenter/>
              <ModalHeaderRight>
                <ButtonForModalRight
                  type='submit'
                  onPress={handleToggleTask}
                >
                  { taskConditionIndex === 2
                    ? null
                    : (
                      <>
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
                      </>
                    )
                  }

                </ButtonForModalRight>
                <ButtonForModalRight
                  type='submit'
                  onPress={handleToggleTask}
                >
                  { taskConditionIndex === 1
                    ? (
                      <>
                        { Platform.OS === 'ios'
                          ? (
                            <BackIcon02
                              name="edit"
                              size={24}
                              onPress={handleEditTask}
                            />
                          )
                          : (
                            <BackIcon02
                              name="edit"
                              size={20}
                              onPress={handleEditTask}
                            />
                          )
                        }
                      </>
                    )
                    : (
                      null
                    )
                  }
                  { taskConditionIndex === 2
                    ? (
                      <>
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
                      </>
                    )
                    : (
                      null
                    )
                  }

                  { taskConditionIndex === 3
                    ? (
                      <>
                        { Platform.OS === 'ios'
                          ? (
                            <BackIcon02
                              name="activity"
                              size={24}
                              onPress={handleReviveTask}
                            />
                          )
                          : (
                            <BackIcon02
                              name="activity"
                              size={20}
                              onPress={handleReviveTask}
                            />
                          )
                        }
                      </>
                    )
                    : (
                      null
                    )
                  }
                </ButtonForModalRight>
                <ButtonForModalRight
                  type='submit'
                  onPress={handleToggleTask}
                >
                  { taskConditionIndex === 1
                    ? (
                      <>
                        { Platform.OS === 'ios'
                          ? (
                            <BackIcon02
                              name="x-octagon"
                              size={24}
                              onPress={handleToggleCancelModal}
                            />
                          )
                          : (
                            <BackIcon02
                              name="x-octagon"
                              size={20}
                              onPress={handleToggleCancelModal}
                            />
                          )
                        }
                      </>
                    )
                    : (
                      null
                    )
                  }
                  { taskConditionIndex === 2
                    ? (
                      <>
                        { Platform.OS === 'ios'
                          ? (
                            <BackIcon02
                              name="trash-2"
                              size={24}
                              onPress={handleToggleDeleteModal}
                            />
                          )
                          : (
                            <BackIcon02
                              name="trash-2"
                              size={20}
                              onPress={handleToggleDeleteModal}
                            />
                          )
                        }
                      </>
                    )
                    : (
                      null
                    )
                  }
                  { taskConditionIndex === 3
                    ? (
                      <>
                        { Platform.OS === 'ios'
                          ? (
                            <BackIcon02
                              name="trash-2"
                              size={24}
                              onPress={handleToggleDeleteModal}
                            />
                          )
                          : (
                            <BackIcon02
                              name="trash-2"
                              size={20}
                              onPress={handleToggleDeleteModal}
                            />
                          )
                        }
                      </>
                    )
                    : (
                      null
                    )
                  }
                </ButtonForModalRight>
              </ModalHeaderRight>
            </ModalHeaderView>

            <MarginView02/>
            <DescriptionView>
              <MarginView04/>
              <CenterView>
                <TitleIconUser name="clipboard"/>
                <TitleTextModalUser>{data.name}</TitleTextModalUser>
              </CenterView>
              <MarginView04/>

              <AlignDetailsView>
                <MarginView02/>
                <TagView>
                  <Label>{t('To')}</Label>
                    <ToTextModal>{data.worker.worker_name}</ToTextModal>
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
                      <DueTimeView style={{backgroundColor:'#f5f5f5'}}>
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
                      <Label>{t('EndingTime')}</Label>
                      <DueTimeView pastDueDate={endPastDueDate()}>
                        <DueTime>{formattedDateTime(data.end_date)}</DueTime>
                      </DueTimeView>
                    </TagView>
                  )
                }
                <TagView>
                  <Label>{t('PriorityLabel')}</Label>
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
                          disabled={true}
                          value={s.complete}
                        />
                        <DescriptionSpan>{s.weige_percentage}%</DescriptionSpan>
                        <DescriptionSpan type="check-box">{s.description}</DescriptionSpan>
                    </CheckBoxView>
                  </AlignCheckBoxView>
                ))}
              </CheckBoxWrapper>
              <MarginView04/>
            </DescriptionView>

            { data.description
              ? (
                <>
                  <MarginView08/>
                  <DescriptionView>
                    <MarginView04/>
                    <Label>{t('OtherComments')}</Label>
                    <DescriptionSpan>{data.description}</DescriptionSpan>
                    <MarginView08/>
                  </DescriptionView>
                </>
              )
              : null
            }

            { data.status.status === 3 &&
              <>
                <MarginView08/>
                <AcceptButtonView>
                  <MarginView04/>
                  <Label>
                    {t('CanceledAt', { user: data.user.user_name })}
                    {`${formattedDateTime(data.updatedAt)}`}
                  </Label>
                  {/* <DescriptionSpan>{`${data.status.comment}:`}</DescriptionSpan> */}
                  <MarginView04/>
                </AcceptButtonView>
              </>
            }

            { data.status.status === 4 &&
              <>
                <MarginView08/>
                <AcceptButtonView>
                  <MarginView04/>
                  <Label>
                    {t('DeclinedAt', { worker: `${data.worker.worker_name}` })}
                    {`${formattedDateTime(data.updatedAt)}`}
                  </Label>
                  <DescriptionSpan>{`${data.status.comment}:`}</DescriptionSpan>
                  <MarginView08/>
                </AcceptButtonView>
              </>
            }

            { data.signature &&
              <>
                <MarginView08/>
                <DescriptionView>
                  <MarginView04/>
                    <Label>{t('ConfirmationPhoto')}</Label>
                    <MarginView04/>
                    <ImageView>
                      <Image source={{ uri: data.signature.url }}/>
                    </ImageView>
                  <MarginView08/>
                </DescriptionView>
              </>
            }
            <MarginView08/>
            <MarginView04/>
          </FormScrollView>

        <Modal isVisible={toggleCancelModal}>
          <ModalView>
            <MarginView08/>
            <ModalText>{t('CancelThisTask')}</ModalText>
            <MarginView04/>
            <ButtonWrapper>
              <Button type={'submit'} small={true} onPress={handleCancelTask}>
                {t('Yes')}
              </Button>
              <Button type={'inverted'} small={true} onPress={() => setToggleCancelModal(!toggleCancelModal)}>
                {t('Back')}
              </Button>
            </ButtonWrapper>
            <MarginView08/>
          </ModalView>
        </Modal>

        <Modal isVisible={toggleDeleteModal}>
          <ModalView>
            <MarginView08/>
            <ModalText>{t('PermanentlyDelete')}</ModalText>
            <MarginView04/>
            <ButtonWrapper>
              <Button type={'submit'} small={true} onPress={handleDeleteTask}>
                {t('Yes')}
              </Button>
              <Button type={'inverted'} small={true} onPress={() => setToggleDeleteModal(!toggleDeleteModal)}>
                {t('Back')}
              </Button>
            </ButtonWrapper>
            <MarginView08/>
          </ModalView>
        </Modal>
      </Modal>
    </Container>
  );
}
