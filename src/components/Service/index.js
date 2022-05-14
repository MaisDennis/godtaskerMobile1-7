import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import { format, parseISO } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import { BlockSmallService, Container, LabelBoldService } from './styles'
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
 import { updateServices } from '~/store/modules/service/actions';
 import api from '~/services/api';
// -----------------------------------------------------------------------------
export default function Service({ children, data, navigation, display, workerPage }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const formattedDateTime = fdate =>
  fdate == null
    ? '-'
    : i18n.language === 'en'
      ? format(parseISO(fdate), "MMM'/'dd'/'yyyy h:mm aaa", { locale: enUS })
      : format(parseISO(fdate), "dd'/'MMM'/'yyyy HH:mm", { locale: ptBR });

  const [toggleModal, setToggleModal] = useState();
  const [toggleDeleteService, setToggleDeleteService] = useState();
  console.log(data)
  // console.log(data.createdAt)

  function handleEditService() {
    setToggleModal(!toggleModal)
    navigation.navigate('ServiceEdit', {
      id: data.id,
      name: data.name,
      description: data.description,
      sub_task_list: data.sub_task_list,
      task_attributes: data.task_attributes,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    })
  }

  async function handleDeleteService() {
    await api.delete(`/services/${data.id}`)
    setToggleDeleteService(!toggleDeleteService)
    dispatch(updateServices(new Date()))
  }

  function handleToggleDeleteService() {
    setToggleDeleteService(!toggleDeleteService)
  }

  function handleToggleModal() {
    setToggleModal(!toggleModal)
  }

  function handleSend() {
    setToggleModal(!toggleModal)
    navigation.navigate('ServiceSend', {
      id: data.id,
      name: data.name,
      description: data.description,
      sub_task_list: data.sub_task_list,
      task_attributes: data.task_attributes,
      created_at: data.createdAt
    })
  }

  async function handleDisplay() {
    setToggleModal(!toggleModal)
    navigation.navigate('ServiceDisplay', {
      id: data.id,
      name: data.name,
      description: data.description,
      sub_task_list: data.sub_task_list,
      task_attributes: data.task_attributes,
      created_at: data.createdAt
    })
  }

  async function handleRemoveDisplay() {
    await api.put(`/services/${data.id}`, {
      display_in_profile: false,
    });
    dispatch(updateServices(new Date()))
  }
  // ---------------------------------------------------------------------------
    return (
      <Container display={display} onPress={() => setToggleModal(!toggleModal)}>
        <BlockSmallService>
          <LabelBoldService numberOfLines={2} display={display}>
            {children}
          </LabelBoldService>
        </BlockSmallService>
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
                        onPress={handleEditService}
                      >
                        <BackIcon02
                          name="edit"
                          size={20}

                        />
                      </ButtonForModalRight>
                      <ButtonForModalRight
                        type='submit'
                        onPress={handleToggleDeleteService}
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
              <TagView>
                <Label>{t('Created')}</Label>
                <StartTime>{formattedDateTime(data.createdAt)}</StartTime>
              </TagView>
              { data.createdAt !== data.updatedAt &&
                <TagView>
                  <Label>{t('LastUpdate')}</Label>
                  <StartTime>{formattedDateTime(data.updatedAt)}</StartTime>
                </TagView>
              }
              { display === true && data.tenure
                ? (
                  <TagView>
                    <Label>{t('')}</Label>
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
                : null
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
                    <MarginView04/>
                    <DescriptionSpan02>{data.description}</DescriptionSpan02>
                    <MarginView08/>
                  </DescriptionView>
                </>
              )
              : null
            }
            <MarginView08/>

            { display === false
              ? (
                <>
                  <ButtonWrapperConfirm>
                    <Button
                      onPress={handleSend}
                    >
                      {t('SendThisTask')}
                    </Button>
                  </ButtonWrapperConfirm>
                  <MarginView08/>
                  <ButtonWrapperConfirm>
                    <Button
                    type='submit'
                    onPress={handleDisplay}
                    >
                      {t('DisplayInProfile')}
                    </Button>
                  </ButtonWrapperConfirm>
              </>
              )
              : (
                <>
                  { workerPage === false
                    ? (
                      <ButtonWrapperConfirm>
                        <Button
                          onPress={handleRemoveDisplay}
                        >
                          {t('RemoveFromProfile')}
                        </Button>
                      </ButtonWrapperConfirm>
                    )
                    : (
                      <>
                      <ButtonWrapperConfirm>
                        <Button
                          type='inverted'
                          // onPress={handleRemoveDisplay}
                        >
                          {t('ContactUser')}
                        </Button>
                      </ButtonWrapperConfirm>
                      <MarginView08/>
                      <ButtonWrapperConfirm>
                        <Button
                        type='submit'
                        onPress={handleDisplay}
                        >
                          {t('HireThisService')}
                        </Button>
                      </ButtonWrapperConfirm>
                      </>
                    )
                  }

                </>
              )
            }

          </FormScrollView>
        </Modal>

        <Modal isVisible={toggleDeleteService}>
          <ModalView>
            <MarginView08/>
            <AcceptButtonView>
              <MarginView08/>
              <CenterView>
                <ModalText>{t('AreYouSureDeleteSaved')}</ModalText>
              </CenterView>
              <MarginView08/>
              <ButtonWrapper>
                <Button
                  type={'submit'}
                  small={true}
                  onPress={handleDeleteService}
                >
                  {t('Yes')}
                </Button>
                <Button
                  type={'inverted'}
                  small={true}
                  onPress={() => setToggleDeleteService(!toggleDeleteService)}
                >
                  {t('Back')}
                </Button>
              </ButtonWrapper>
              <MarginView08/>
            </AcceptButtonView>
            <MarginView08/>
          </ModalView>
        </Modal>
      </Container>
    )

}
