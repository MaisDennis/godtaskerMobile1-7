import React, { useState} from 'react';
import { useDispatch } from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import { format, parseISO } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import {
  BlockSmallService,
  Container,
  LabelBoldPrice, LabelBoldService, LabelNormalService
} from './styles'
import {
  AcceptButtonView,
  AlignCheckBoxView, AlignDetailsView,
  BackButton, BackIcon, BackIcon02, BackText, BodyView, BodyWrapper,
  BellIcon, BottomHeaderView, ButtonForModal, ButtonForModalRight, ButtonIcon, ButtonWrapper, ButtonWrapperConfirm,
  CenterView, CheckBoxView, CheckBoxWrapper, ConfirmIcon,
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
  ToText, ToTextModal, ToWorkerView,
  UnreadMessageCountText, UserImage, WorkerImageBackground,
 } from '../Tasks/styles'
 import Button from '~/components/Button'
 import { updateChatInfo } from '~/store/modules/message/actions';
 import api from '~/services/api';
// -----------------------------------------------------------------------------
export default function ServiceDisplay({ data, navigation, display, userData, workerData }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const formattedDateTime = fdate =>
  fdate == null
    ? '-'
    : i18n.language === 'en'
      ? format(parseISO(fdate), "MMM'/'dd'/'yyyy h:mm aaa", { locale: enUS })
      : format(parseISO(fdate), "dd'/'MMM'/'yyyy HH:mm", { locale: ptBR });

  const [toggleModal, setToggleModal] = useState();
  // console.log(data)
  // console.log(data.createdAt)

  function handleToggleModal() {
    setToggleModal(!toggleModal)
  }

  async function handleMessageConversation() {
    setToggleModal(!toggleModal)
    const response = await api.get('/messages/user', {
      params: {
        user_email: userData.email,
        worker_email: workerData.email,
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

  function handleSend() {
    setToggleModal(!toggleModal)
    navigation.navigate('ServiceWorkerSend', {
      id: data.id,
      name: data.name,
      description: data.description,
      sub_task_list: data.sub_task_list,
      task_attributes: data.task_attributes,
      tenure: data.tenure,
      price: data.price,
      confirm_photo_option: data.confirm_photo_option,
      worker: workerData,
    });
  }
  // ---------------------------------------------------------------------------
    return (
      <Container display={display} onPress={() => setToggleModal(!toggleModal)}>
        <MarginView02/>
        <BlockSmallService >
          <LabelBoldService numberOfLines={2} display={display}>
            {data.name}
          </LabelBoldService>
          { data.price && data.price !== 0
            ? (
              <LabelBoldPrice numberOfLines={2} display={display}>
                {t('$')} {data.price}
              </LabelBoldPrice>
            )
            : (
              <LabelBoldPrice numberOfLines={2} display={display}>
                {t('Free')}
              </LabelBoldPrice>
            )

          }

        </BlockSmallService>
        <BlockSmallService >
          {data.description
            ? (
              <LabelNormalService numberOfLines={2} display={display}>{data.description}</LabelNormalService>
            )
            : null
          }
        </BlockSmallService>
        <MarginView02/>
{/* Modal ------------------------------------------------------------------ */}
        <Modal isVisible={toggleModal}>
        <FormScrollView>
          <MarginView02/>
          <ModalHeaderView>
            <ModalHeaderLeft>
              <ButtonForModal
                type='submit'
                onPress={handleToggleModal}
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
              { display === false
                ? (
                  <>
                    <ButtonForModalRight
                      type='submit'
                      onPress={handleToggleModal}
                    >
                      <BackIcon02
                        name="edit"
                        size={20}

                      />
                    </ButtonForModalRight>
                    <ButtonForModalRight
                      type='submit'
                      onPress={handleToggleModal}
                    >
                      <BackIcon02
                        name="x-octagon"
                        size={20}

                      />
                    </ButtonForModalRight>
                  </>
                )
                : null
              }
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
            { display === true && data.tenure
              ? (
                <TagView>
                  <Label>{t('DaysToComplete')}</Label>
                    <StartTime>{data.tenure}</StartTime>
                </TagView>

              )
              : null
            }
            { display === true && data.price
              ? (
                <TagView>
                  <Label>{t('Price')}</Label>
                    <StartTime>{data.price}</StartTime>
                </TagView>
              )
              : (
                <TagView>
                  <Label>{t('Price')}</Label>
                    <StartTime>{t('Free')}</StartTime>
                </TagView>
              )
            }
            <MarginView04/>
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
                        // value={s.complete}
                      />
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
                  <MarginView04/>
                  <DescriptionSpan02>{data.description}</DescriptionSpan02>
                  <MarginView08/>
                </DescriptionView>
              </>
            )
            : null
          }
          <MarginView08/>
          <ButtonWrapperConfirm>
            <Button
              type='inverted'
              onPress={handleMessageConversation}
            >
              {t('ContactUser')}
            </Button>
          </ButtonWrapperConfirm>
          <MarginView08/>
          <ButtonWrapperConfirm>
            <Button
            type='submit'
            onPress={handleSend}
            >
              {t('HireThisService')}
            </Button>
          </ButtonWrapperConfirm>
        </FormScrollView>
        </Modal>
      </Container>
    )

}
