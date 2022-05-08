import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { format, parseISO, getDay } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import firestore from '@react-native-firebase/firestore';
import defaultAvatar from '~/assets/defaultAvatar.png';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import {
  BodyView, BodyWrapper,
  Container,
  LastMessageView, LastMessageText, LastMessageTimeView, LastMessageTimeText,
  LeftMessageView,
  MarginView02, MarginView04, MarginView08, MessageIcon,
  RightView,
  TitleView, TitleText,
  UnreadMessageCountText, UserImage, WorkerImageBackground,
} from '../Tasks/styles';
import { updateForwardMessage, updateChatInfo } from '~/store/modules/message/actions';
import api from '~/services/api';

export default function Messages({ data, navigation }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const forwardValue = useSelector(state => state.message.forward_message.message);
  const updatedMessage = useSelector(state => state.message.profile)
  const profileUserName = useSelector(state => state.user.profile.user_name)
  const profileUserEmail = useSelector(state => state.user.profile.email)

  const [resetConversation, setResetConversation] = useState();
  const [messageBell, setMessageBell] = useState();
  const [lastMessage, setLastMessage] = useState();
  const [lastMessageTime, setLastMessageTime] = useState();

  const chat_id = data.chat_id;
  const user_id = data.user_id;
  const user_email = data.user.email;

  const worker_id = data.worker_id;
  const worker_email = data.worker.email;

  const userData = data.user.email === profileUserEmail ? data.user : data.worker;
  const workerData = data.user.email === profileUserEmail ? data.worker : data.user;

  const userIsWorker = profileUserEmail === worker_email;

  const messagesRef = firestore().collection(`messages/chat/${chat_id}`)

  const formattedMessageDate = fdate =>
  fdate == null
    ? ''
    : i18n.language === 'en'
      ? getDay(parseISO(JSON.parse(fdate))) === getDay(new Date())
        ? format(parseISO(JSON.parse(fdate)), "'Today'   h:mm aaa", { locale: enUS })
        : format(parseISO(JSON.parse(fdate)), "MMM'/'dd'/'yy   h:mm aaa", { locale: enUS })
      : getDay(parseISO(JSON.parse(fdate))) === getDay(new Date())
          ? format(parseISO(JSON.parse(fdate)), "'Hoje'   HH:mm", { locale: ptBR })
          : format(parseISO(JSON.parse(fdate)), "dd'/'MMM'/'yy   HH:mm", { locale: ptBR })

  useEffect(() => {
    getMessages()
  }, [updatedMessage])

  async function getMessages() {
    const unsubscribe = messagesRef
      .orderBy('createdAt')
      .onSnapshot((querySnapshot) => {
        const firestoreData = querySnapshot.docs.map(d => ({
          ...d.data(),
        }));
        setMessageBell(firestoreData)
        let messagesLength = firestoreData.length

        const last_message = firestoreData[0]
          ? firestoreData[messagesLength-1].message
          : null
        setLastMessage(last_message)

        const last_message_time = firestoreData[0]
          ? firestoreData[messagesLength-1].timestamp
          : null

        setLastMessageTime(formattedMessageDate(last_message_time))
      })
      return unsubscribe;
  }

  async function handleMessageConversation() {
    const response = await api.get('/messages/user', {
      params: {
          user_email: profileUserEmail,
          worker_email: profileUserEmail === user_email ? worker_email : user_email,
      },
    })
    console.log(response.data)
    messagesRef
      .orderBy('createdAt')
      .get().then(resp => {
        // console.log(resp.docs)
        resp.forEach(doc => {
          doc.ref.update({worker_read: true})
        })
      })

    let newMessage = null
    let editedMessages = messageBell;

    if (forwardValue) {
      const message_id = Math.floor(Math.random() * 1000000)
      newMessage = {
        id: message_id,
        chat_id: chat_id,
        forward_message: true,
        reply_message: '',
        reply_sender: '',
        message: forwardValue,
        createdAt: firestore.FieldValue.serverTimestamp(),

        sender_email: profileUserEmail,
        sender_name: profileUserName,
        receiver_email: workerData.email,

        timestamp: JSON.stringify(new Date()),
        user_read: profileUserEmail === workerData.email ? true : false,
        worker_read: profileUserEmail === workerData.email ? false : true,
        visible: true,
      }

      await messagesRef
      .doc(`${message_id}`).set(newMessage)
      .catch((error) => {
        console.log("Error writing document: ", error);
      });


      dispatch(updateForwardMessage(null));
    }

    // if(response.data.inverted) {
    //   navigation.navigate('MessagesConversationPage', {
    //     userData: userData,
    //     workerData: userData,

    //     chat_id: chat_id,
    //     inverted: response.data.inverted,
    //   });

    //   dispatch(updateChatInfo(
    //     workerData,
    //     userData,
    //     response.data.inverted,
    //   ));
    //   return
    // }

    navigation.navigate('MessagesConversationPage', {
      userData: userData,
      workerData: workerData,

      chat_id: chat_id,
      inverted: response.data.inverted,
    });

    dispatch(updateChatInfo(
      userData,
      workerData,
      response.data.inverted
    ));
    setResetConversation();
    setMessageBell(0)
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
    }
    catch(error) { return }
  }

  const hasUnreadUser = (array) => {
    try {
      let sum = 0;
      for(let i = 0; i < array.length; i++) {
        if(array[i].user_read === false) {
          sum += 1
        }
      }
      return sum
    }
    catch(error) { return }
  }
  // ---------------------------------------------------------------------------
  return (
    <>
      <Container
        taskConditionIndex={1}
        onPress={handleMessageConversation}
      >
        <LeftMessageView>
            { workerData === undefined || workerData.avatar === null
              ? (
                <WorkerImageBackground>
                  <UserImage source={defaultAvatar}/>
                </WorkerImageBackground>

              )
              : (
                <WorkerImageBackground>
                  <UserImage source={{ uri: workerData.avatar.url }}/>
                </WorkerImageBackground>
              )
            }
        </LeftMessageView>

        <BodyView>
          <BodyWrapper>
            <MarginView08/>

            <TitleView>
              { userIsWorker
                ? (
                  <TitleText>
                    {workerData.user_name ? workerData.user_name : userData.user_name}
                  </TitleText>
                )
                : (
                  <TitleText>
                    {workerData.worker_name}
                  </TitleText>
                )
              }
            </TitleView>
            <MarginView02/>

            <LastMessageView
              // colors={['#eee', '#eee']}
              // start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
              // style={{ width: `${statusResult}%`}}
            >
              { lastMessage && (
                <LastMessageText numberOfLines={2}>{lastMessage}</LastMessageText>
              )}
            </LastMessageView>
            <MarginView08/>
          </BodyWrapper>
        </BodyView>

        <RightView>
          <MarginView02/>
          <LastMessageTimeView>
            { lastMessageTime
              ? (
                  <LastMessageTimeText
                    numberOfLines={2}
                  >
                    {lastMessageTime}
                  </LastMessageTimeText>
                )
              : null
            }
          </LastMessageTimeView>

          {(userIsWorker)
            ? ((hasUnread(messageBell) === 0)
              ? (
                null
              )
              : (
                <>
                  <MessageIcon name="message-square">
                    <UnreadMessageCountText>{hasUnread(messageBell)}</UnreadMessageCountText>
                  </MessageIcon>
                </>
              )
            )
            : ((hasUnreadUser(messageBell) === 0)
              ? (
                null
              )
              : (
                <>
                  <MessageIcon name="message-square">
                    <UnreadMessageCountText>{hasUnreadUser(messageBell)}</UnreadMessageCountText>
                  </MessageIcon>
                </>
              )
            )
          }
          <MarginView02/>
        </RightView>
      </Container>
    </>
  )
}
