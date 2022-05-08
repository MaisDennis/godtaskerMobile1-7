import React, { useState, useRef, useEffect } from 'react'
import {
  FlatList, SafeAreaView, TouchableOpacity
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { format, getDay, parseISO } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import firestore from '@react-native-firebase/firestore';
import { useTranslation } from 'react-i18next';
// import defaultAvatar from '~/assets/defaultAvatar.png';
// -----------------------------------------------------------------------------
import {
  AlignView,
  ForwardOnTopView, ForwardText,
  LineView,
  MessageBottomView, MessageContainer, MessageIcon,
  MessageListButton, MessageListItemView, MessageListView,
  MessageListItemText, MessageText, MessageTime,
  MessageView, MessageViewUser, MessageWrapper,
  ReplyOnTopView, ReplyOnTopWrapper,
  ReplyUserNameText, ReplyWorkerNameText, ReplyOnTopText,

} from './messageStyles'
import {
  Container,ConversationView,
  HrLine,
  // ParsedKeyboardAvoidingView,
  LeftBorderView,
  MarginView02, MarginView04, MarginView08,
  ReplyContainer, ReplyView,
  SendInput, SendButton, SendButtonView, SendIcon,
  SpaceView,
  TemporaryMessageContainer, TemporaryMessageView, TemporaryMessageText,
  TemporaryMessageIcon, TemporaryMessageIconView,
} from './pageStyles'
import api from '~/services/api';
import { updateMessagesRequest, updateForwardMessage } from '~/store/modules/message/actions';
// import messaging from '@react-native-firebase/messaging';

export default function MessagesConversationPage({ navigation, route }) {

  const { t, i18n } = useTranslation()
  const profileUserId = useSelector(state => state.user.profile.id);
  const profileUserName = useSelector(state => state.user.profile.user_name);
  const profileUserEmail = useSelector(state => state.user.profile.email);

  // console.log(route.params)

  const messageUserId = route.params.userData.id;
  const messageUserEmail = route.params.userData.email;

  const messageWorkerEmail = route.params.workerData.email;
  const messageWorkerId = route.params.workerData.id;

  const chatId = route.params.chat_id;
  const inverted = route.params.inverted;

  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
  const [firstMessage, setFirstMessage] = useState(route.params.first_message);
  const [replyValue, setReplyValue] = useState();
  const [replySender, setReplySender] = useState();
  const [value, setValue] = useState();
  const [messageDropMenu, setMessageDropMenu] = useState();
  const [toggleDropMenu, setToggleDropMenu] = useState(false);
  const [load, setLoad] = useState();
  const lastMessageRef = useRef()

  const messagesRef = firestore()
  .collection(`messages/chat/${chatId}`)

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
    let mounted = true; // mounted solution: https://www.debuggr.io/react-update-unmounted-component/
    if (mounted) getMessages()
    return () => mounted = false;

  }, []);

  async function getMessages() {
    const unsubscribe = messagesRef
    .orderBy('createdAt')
    .onSnapshot((querySnapshot) => {
      const data = querySnapshot.docs.map(d => ({
        ...d.data(),
      }));
      setMessages(data.reverse())
    })
    return unsubscribe;
  }

  async function handleSend() {
    try {
      setLoad(true)
      let newMessage = null

      const message_id = Math.floor(Math.random() * 1000000)
      if (replyValue) {
        newMessage = {
          id: message_id,
          chat_id: chatId,
          forward_message: false,
          reply_message: replyValue,
          reply_sender: replySender,
          message: value,
          createdAt: firestore.FieldValue.serverTimestamp(),

          sender_email: profileUserEmail,
          sender_name: profileUserName,
          receiver_email: profileUserEmail === messageUserEmail ? messageWorkerEmail : messageUserEmail,

          timestamp: JSON.stringify(new Date()),
          user_read: profileUserEmail === messageUserEmail ? true : false,
          worker_read: profileUserEmail === messageUserEmail ? false : true,
          visible: true,
        }
      } else {
        newMessage = {
          id: message_id,
          chat_id: chatId,
          forward_message: false,
          reply_message: '',
          reply_sender: '',
          message: value,
          createdAt: firestore.FieldValue.serverTimestamp(),

          sender_email: profileUserEmail,
          sender_name: profileUserName,
          receiver_email: profileUserEmail === messageUserEmail ? messageWorkerEmail : messageUserEmail,

          timestamp: JSON.stringify(new Date()),
          user_read: profileUserEmail === messageUserEmail ? true : false,
          worker_read: profileUserEmail === messageUserEmail ? false : true,
          visible: true,
        }
      }

      // Firebase Messaging *****
      await messagesRef
      .doc(`${message_id}`).set(newMessage)
      .then(() => {
        if(firstMessage === true) {
          api.post('/messages', {
            user_id: profileUserId,
            user_email: profileUserEmail,
            worker_id: profileUserEmail === messageUserEmail ? messageWorkerId : messageUserId,
            worker_email: profileUserEmail === messageUserEmail ? messageWorkerEmail : messageUserEmail,
            chat_id: chatId,
            messaged_at: JSON.stringify(new Date()),
            messageObject: newMessage,

          });
          dispatch(updateMessagesRequest(new Date()))
          setFirstMessage(false);
          return
        }

        api.put(`/messages/${chatId}`, {
          messaged_at: JSON.stringify(new Date()),
          messageObject: newMessage,
          profileUserEmail: profileUserEmail,
        })
        dispatch(updateMessagesRequest(new Date()))
      })
      .catch((error) => {
        console.log("Error writing document: ", error);
      });
      setValue();
      setReplyValue();
      setLoad(false)
    }
    catch(error) {
      console.log(error)
    }
  }

  function handleMessageDropMenu(position) {
    setMessageDropMenu(position)
    setToggleDropMenu(!toggleDropMenu)
  }

  function handleMessageReply(message, sender) {
    setReplyValue(message)
    setReplySender(sender)
    setToggleDropMenu(false)
  }

  function handleMessageForward(message) {
    setToggleDropMenu(false)
    dispatch(updateForwardMessage(message))
    navigation.goBack()
  }

  async function handleMessageDelete(messageId) {
    firestore().collection(`messages/chat/${chatId}`)
      .doc(JSON.stringify(messageId)).update({
        deleted_message: true
      })

    setToggleDropMenu(false)
  }
  // message ---------------------------------------------------------------------------
  const renderItem = ({ item, index }) => (
    <AlignView key={item.id}>
      <MarginView02/>
      <LineView>
        <MessageContainer profileUserEmail={profileUserEmail === item.sender_email} inverted={inverted}>
          <MessageWrapper>
            { profileUserEmail === item.sender_email
                    ? (<MessageTime>{formattedMessageDate(item.timestamp)}</MessageTime>)
                    : null
            }
            { profileUserEmail === item.sender_email
              ? (
                <MessageViewUser
                  sender={item.sender}
                  colors={['#E0EFEA', '#D0ECE3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  { item.reply_message && !item.removed_message && !item.deleted_message
                    ? (
                      <>
                        <MarginView04/>
                        <ReplyOnTopWrapper>
                          <LeftBorderView/>
                          <ReplyOnTopView>

                            { item.reply_sender === 'worker'
                              ? (
                                <ReplyWorkerNameText>
                                  {item.reply_sender}

                                </ReplyWorkerNameText>
                              )
                              : (
                                <ReplyWorkerNameText>
                                  {item.reply_sender}

                                </ReplyWorkerNameText>
                              )
                            }
                            <ReplyOnTopText>{item.reply_message}</ReplyOnTopText>
                          </ReplyOnTopView>
                        </ReplyOnTopWrapper>
                      </>
                    )
                    : null
                  }
                  { item.forward_message && !item.removed_message && !item.deleted_message
                    ? (
                      <>
                        <MarginView04/>
                        <ForwardOnTopView>
                          <MessageIcon name='corner-down-right'/>
                          <ForwardText>{t('ForwardedMessage')}</ForwardText>
                        </ForwardOnTopView>
                      </>
                    )
                    : (
                      null
                    )
                  }
                  { item.deleted_message
                    ? (
                      <>
                        <MarginView04/>
                        <ForwardOnTopView>
                          <MessageIcon name='slash'/>
                          <ForwardText>{t('ThisMessageWasDeleted')}</ForwardText>
                        </ForwardOnTopView>
                      </>
                    )
                    : null
                  }
                  { !item.deleted_message
                    ? (
                      <>
                        <MarginView04/>
                        <MessageBottomView>
                          <MessageText removedMessage={item.removed_message}>{item.message}</MessageText>
                          <TouchableOpacity
                            onPress={() => handleMessageDropMenu(index)}
                          >
                            <MessageIcon name='chevron-down'/>
                          </TouchableOpacity>
                        </MessageBottomView>
                      </>
                    )
                    : null

                  }
                  <MarginView04/>
                </MessageViewUser>
              )
              : (
                <MessageView
                  sender={item.sender}
                  colors={['#ddd', '#f5f5f5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  { item.reply_message && !item.removed_message && !item.deleted_message
                    ? (
                      <>
                        <MarginView04/>
                        <ReplyOnTopWrapper>
                        <LeftBorderView/>
                          <ReplyOnTopView>
                            { item.reply_sender === 'worker'
                              ? (
                                <ReplyUserNameText>
                                  {item.reply_sender}
                                </ReplyUserNameText>
                              )
                              : (
                                <ReplyUserNameText>
                                  {item.reply_sender}
                                  </ReplyUserNameText>
                              )
                            }
                            <ReplyOnTopText>{item.reply_message}</ReplyOnTopText>
                          </ReplyOnTopView>
                        </ReplyOnTopWrapper>
                      </>
                    )
                    : null
                  }
                  { item.forward_message && !item.removed_message && !item.deleted_message
                    ? (
                      <>
                        <MarginView04/>
                        <ForwardOnTopView>
                          <MessageIcon name='corner-down-right'/>
                          <ForwardText>{t('ForwardedMessage')}</ForwardText>
                        </ForwardOnTopView>
                      </>
                    )
                    : (
                      null
                    )
                  }
                  { item.deleted_message
                    ? (
                      <>
                        <MarginView04/>
                        <ForwardOnTopView>
                          <MessageIcon name='slash'/>
                          <ForwardText>{t('ThisMessageWasDeleted')}</ForwardText>
                        </ForwardOnTopView>
                      </>
                    )
                    : null
                  }
                  { !item.deleted_message
                    ? (
                      <>
                        <MarginView04/>
                        <MessageBottomView>
                          <MessageText removedMessage={item.removed_message}>{item.message}</MessageText>
                          <TouchableOpacity
                            onPress={() => handleMessageDropMenu(index)}
                          >
                            <MessageIcon name='chevron-down'/>
                          </TouchableOpacity>
                        </MessageBottomView>
                      </>
                    )
                    : null

                  }
                  <MarginView04/>
                </MessageView>
              )
            }
            { profileUserEmail === item.receiver_email
              ? (<MessageTime>{formattedMessageDate(item.timestamp)}</MessageTime>)
              : null
            }
          </MessageWrapper>

          { (messageDropMenu === index) && (toggleDropMenu === true) && (
            <>
              <MarginView04/>
              <MessageListView>
                <MessageListButton
                  onPress={() => handleMessageReply(item.message, item.sender_name)}
                >
                  <MessageListItemView>
                    <MessageListItemText>{t('Reply')}</MessageListItemText>
                  </MessageListItemView>
                </MessageListButton>
                <MessageListButton
                  onPress={() => handleMessageForward(item.message)}
                >
                  <MessageListItemView>
                    <MessageListItemText>{t('Forward')}</MessageListItemText>
                  </MessageListItemView>
                </MessageListButton>
                { !inverted && item.sender === 'user'
                  ? (
                    <MessageListButton
                    onPress={() => handleMessageDelete(item.id)}
                  >
                    <MessageListItemView>
                      <MessageListItemText>{t('Delete')}</MessageListItemText>
                    </MessageListItemView>
                  </MessageListButton>
                  )
                  : null
                }
                { profileUserEmail === item.sender_email
                  ? (
                    <MessageListButton
                    onPress={() => handleMessageDelete(item.id)}
                  >
                    <MessageListItemView>
                      <MessageListItemText>{t('Delete')}</MessageListItemText>
                    </MessageListItemView>
                  </MessageListButton>
                  )
                  : null
                }

              </MessageListView>
              <MarginView02/>
            </>
          )}
        </MessageContainer>
      </LineView>
      <MarginView02/>
    </AlignView>
  );
  // page ---------------------------------------------------------------------------
  return (
    <SafeAreaView>
      <Container>
        <ConversationView
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset = {Platform.OS === "ios" ? "80" : null}
        >
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={item => String(item.id)}
            ref={lastMessageRef}
            inverted
            // onContentSizeChange={() => lastMessageRef.current.scrollToEnd()}
            // onLayout={() => lastMessageRef.current.scrollToEnd()}
          />
          <HrLine/>
          <ReplyContainer>
            { replyValue && (
              <TemporaryMessageContainer>
                <TemporaryMessageView>
                  <LeftBorderView/>
                  <TemporaryMessageText
                  numberOfLines={1}
                  >{replyValue}</TemporaryMessageText>
                </TemporaryMessageView>

                {/* <TemporaryMessageIconView> */}
                  <TouchableOpacity onPress={() => setReplyValue()}>
                    <TemporaryMessageIcon name='x-circle'/>
                  </TouchableOpacity>
                {/* </TemporaryMessageIconView> */}
              </TemporaryMessageContainer>
            )}
            <ReplyView>
              <SendInput
                autoCorrect={false}
                autoCapitalize="none"
                enablesReturnKeyAutomatically
                keyboardType="default"
                multiline
                onChangeText={setValue}
                placeholder={t('Message')}
                returnKeyType="send"
                value={value}
              />
              {/* keep "if else" below */}
              { value
                ? (
                  <SendButtonView onPress={handleSend} disabled={load}>
                    <SendButton>
                        <SendIcon name="send"/>
                    </SendButton>
                  </SendButtonView>
                )
                : (
                  <SpaceView/>
                )
              }
            </ReplyView>
          </ReplyContainer>
        </ConversationView>
      </Container>
    </SafeAreaView>
  )
}
