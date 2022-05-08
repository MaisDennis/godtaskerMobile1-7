import React, { useState } from 'react'
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import { parseISO, isBefore , isSameHour, subHours, addDays, addMinutes, format } from 'date-fns';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import {
  ButtonIcon, ButtonIcon02, ButtonIcon03, ButtonTagWrapper, ButtonView, ButtonView02, ButtonView03,
  CheckBoxWrapper, Container,
  DateOptionsView, DateOptions, DescriptionWorkerView01, DescriptionWorkerView02, DescriptionWorkerView03,
  FormScrollView,
  HrLine,
  Input, IosKeyboardAvoidingView, ItemWrapperView,
  LabelText,
  MarginView02, MarginView04, MarginView08, ModalView, ModalWrapper,
  RadioButtonView, RadioButtonTag, RadioButtonTagConfirmPhoto,
  RadioButtonLabel, RadioButtonLabelText, RadioButtonOuter, RadioButtonInner0,
  RadioButtonInner1, RadioButtonInner2, RadioButtonInner3,
  RadioButtonInner4,
  SubTaskButton, SubTaskButtonView, SubTaskCancelIcon, SubTaskConfirmButton, SubTaskConfirmIcon, SubTaskConfirmView,
  SubTaskEditIcon, SubTaskInput, SubTaskLabelText,
  SubTaskLeftView, SubTaskRightView,
  SubTaskTag, SubTaskText,
  SubTaskWeigeText, SubTaskWrapper, SubTaskView,
  TitleText,
  WeigeView, WeigeTagView, WeigeText,
} from '../../Tasks/TaskCreatePage/styles'
import { updateTasks } from '~/store/modules/task/actions';
import api from '~/services/api';
import Button from '~/components/Button';
// -----------------------------------------------------------------------------

export default function ServiceWorkerSendPage({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const user_id = useSelector(state => state.user.profile.id);
  // console.log(route.params.confirm_photo_option);
  const data = route.params;

  const [confirmPhoto, setConfirmPhoto] = useState(1);
  const [description, setDescription] = useState(data.description);
  const [focusBorder, setFocusBorder] = useState(3);
  const [prior, setPrior] = useState(data.task_attributes[0]);
  const [urgent, setUrgent] = useState(data.task_attributes[1]);
  const [complex, setComplex] = useState(data.task_attributes[2]);
  const [startDate, setStartDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(
    route.params.tenure
      ? addDays(new Date(),route.params.tenure)
      : new Date()
    );

  const [subTaskList, setSubTaskList] = useState(data.sub_task_list);
  const [toggleDates, setToggleDates] = useState(false);
  const [sameHourCheck, setSameHourCheck] = useState(false)

  function handleToggleDates() {
    setToggleDates(!toggleDates)
    setFocusBorder(3)
  }

  function handlePrior(index) {
    setFocusBorder(3)
    setPrior(index)
  }

  function handleConfirmPhoto(index) {
    setFocusBorder(3)
    setConfirmPhoto(index)
  }

  async function editTasks() {
    let subTaskCount = subTaskList.length
    let pointsVariable = 100
    if (subTaskCount >= 6 ) {
      pointsVariable = pointsVariable + 100
    } else if (subTaskCount > 0 && subTaskCount <= 5) {
      pointsVariable = pointsVariable + (subTaskCount * 20)
    }

    await api.post('/tasks', [
      {
        name: data.name,
        description: description,
        sub_task_list: subTaskList,
        task_attributes: [prior, urgent, complex],
        status: {
          "status": 1,
          "comment": new Date(),
        },
        points: pointsVariable,
        confirm_photo:
          data.confirm_photo_option === 1
            ? 1
            : data.confirm_photo_option === 2
              ? 2
              : confirmPhoto,
        start_date: startDate,
        due_date: dueDate,
        messaged_at: new Date(),
        workeremail: data.worker.email,
        created: t('Created'),
        due: t('Due'),
      }, user_id
    ]);
    dispatch(updateTasks(new Date()))
  }

  async function handleSubmit() {
    if (isBefore(startDate, subHours(new Date(), 1))) {
      Alert.alert(
        t('StartDateIsInThePast'),
        t('StartDateCannot'),
        [{ style: "default" }],
        { cancelable: true },
      )
      return
    }

    if (isBefore(dueDate, startDate)) {
      Alert.alert(
        t('DueDateIsBefore'),
        t('TheDueDateAndTime'),
        [{ style: "default" }],
        { cancelable: true },
      )
      return
    }
    if (route.params.tenure && (
      isBefore(addDays(startDate, route.params.tenure), startDate)
    )) {
      Alert.alert(
        'Time period is too short.',
        `The User asks for at least ${route.params.tenure} days to finish this task.`,
        [{ style: "default" }],
        { cancelable: true },
      )
      return
    }
    if (!sameHourCheck && isSameHour(dueDate, new Date())) {
      Alert.alert(
        t('DueDateIsSetWithin'),
        t('AreYouSure'),
        [{ style: "default" }],
        { cancelable: true },
      )
      setSameHourCheck(true)
      return
    }

    try {
      editTasks()

      Alert.alert(
        'Success! Please Check your "Sent Tasks" Tab',
        t('TaskRegistered'),
        [{ style: "default" }],
        { cancelable: true },
      )
    }
    catch(error) {
      console.log('error')
      Alert.alert(
        t('ErrorTaskNotRegistered'),
        t('PleaseTryAgain'),
        [{ style: "default" }],
        { cancelable: true },
      )
    }
    navigation.goBack();
  }
  // ---------------------------------------------------------------------------
  return (
    <Container>
      <IosKeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset = {Platform.OS === "ios" ? "70" : null}
      >
        <FormScrollView contentContainerStyle={{ alignItems: 'center'}}>
          <MarginView08/>
          <DescriptionWorkerView01
            focusColor = {focusBorder}
          >
            <ItemWrapperView>
              <LabelText>{t('Title')}</LabelText>
              <MarginView04/>
              <TitleText>{data.name}</TitleText>
            </ItemWrapperView>
            <MarginView08/>
            <ItemWrapperView>
              <LabelText>Send to:</LabelText>
              <MarginView04/>
              <TitleText>{data.worker.worker_name}</TitleText>
            </ItemWrapperView>

            { data.tenure
              ? (
                <ItemWrapperView>
                <MarginView08/>
                  <LabelText>Days to Complete:</LabelText>
                  <MarginView04/>
                  <TitleText>{data.tenure}</TitleText>
                </ItemWrapperView>
              )
              : null
            }
            { data.price
              ? (
                <ItemWrapperView>
                  <MarginView08/>
                  <LabelText>Price:</LabelText>
                  <MarginView04/>
                  <TitleText>{data.price}</TitleText>
                </ItemWrapperView>
              )
              : null
            }
          </DescriptionWorkerView01>

          <MarginView08/>
          <DescriptionWorkerView02 focusColor = {focusBorder}>

            <ItemWrapperView>
              {subTaskList != ''
                ? (
                    <>
                      <MarginView08/>
                      <LabelText>{t('SubItemList')}</LabelText>
                      <MarginView04/>
                    </>
                  )
                : null
              }
              { subTaskList.map((s, index) => (
                <SubTaskView key={index}>
                  <>
                    <SubTaskWrapper>
                      <SubTaskLeftView>
                        <SubTaskTag>
                          <SubTaskLabelText>{index+1}.</SubTaskLabelText>
                          <SubTaskText>{s.description}</SubTaskText>
                        </SubTaskTag>
                      </SubTaskLeftView>

                      <SubTaskRightView>
                        <SubTaskTag>
                          <WeigeTagView>
                            <WeigeText>{t('Weige')}</WeigeText>
                            <SubTaskWeigeText>{s.weige}</SubTaskWeigeText>
                          </WeigeTagView>
                        </SubTaskTag>
                      </SubTaskRightView>
                    </SubTaskWrapper>
                    {/* ----------- */}
                    <MarginView04/>
                    <HrLine/>
                    <MarginView04/>
                    {/* ----------- */}
                  </>
                </SubTaskView>
              ))}
            </ItemWrapperView>
          </DescriptionWorkerView02>
          <MarginView08/>

          <DescriptionWorkerView03
            focusColor = {focusBorder}
          >
            <ItemWrapperView>
              <MarginView04/>
              <ButtonTagWrapper>
                <LabelText>{t('StartAndDueDates')}</LabelText>
                <ButtonView03
                  onPress={handleToggleDates}
                  focusColor = {focusBorder}
                  worker={true}
                >
                  <ButtonIcon03
                    name="calendar"
                    focusColor = {focusBorder}
                    worker={true}
                  />
                </ButtonView03>
              </ButtonTagWrapper>
              </ItemWrapperView>
            <MarginView08/>
            <MarginView04/>
            <ItemWrapperView>
              <LabelText>{t('Priority')}</LabelText>
              <MarginView04/>
              <RadioButtonView>
                <RadioButtonTag onPress={() => handlePrior(1)}>
                  <RadioButtonLabel>{t('Low')}</RadioButtonLabel>
                  <RadioButtonOuter>
                    <RadioButtonInner1 switch={prior}/>
                  </RadioButtonOuter>
                </RadioButtonTag>
                <RadioButtonTag onPress={() => handlePrior(2)}>
                  <RadioButtonLabel>{t('Medium')}</RadioButtonLabel>
                  <RadioButtonOuter>
                    <RadioButtonInner2 switch={prior}/>
                  </RadioButtonOuter>
                </RadioButtonTag>
                <RadioButtonTag onPress={() => handlePrior(3)}>
                  <RadioButtonLabel>{t('High')}</RadioButtonLabel>
                  <RadioButtonOuter>
                    <RadioButtonInner3 switch={prior}/>
                  </RadioButtonOuter>
                </RadioButtonTag>
                <RadioButtonTag onPress={() => handlePrior(1)}>
                  <RadioButtonLabel>{t('NA')}</RadioButtonLabel>
                  <RadioButtonOuter>
                    <RadioButtonInner4 switch={prior}/>
                  </RadioButtonOuter>
                </RadioButtonTag>
              </RadioButtonView>
            </ItemWrapperView>
            <MarginView08/>
            { data.confirm_photo_option === 3
              ? (
                <>
                  <ItemWrapperView>
                    <RadioButtonLabelText>{t('ConfirmWithPhoto')}</RadioButtonLabelText>
                    <MarginView04/>
                    <RadioButtonView>
                      <RadioButtonTagConfirmPhoto onPress={() => handleConfirmPhoto(1)}>
                        <RadioButtonLabel>{t('Yes')}</RadioButtonLabel>
                        <RadioButtonOuter>
                          <RadioButtonInner1 switch={confirmPhoto}/>
                        </RadioButtonOuter>
                      </RadioButtonTagConfirmPhoto>
                      <RadioButtonTagConfirmPhoto onPress={() => handleConfirmPhoto(0)}>
                        <RadioButtonLabel>{t('No')}</RadioButtonLabel>
                        <RadioButtonOuter>
                          <RadioButtonInner0 switch={confirmPhoto}/>
                        </RadioButtonOuter>
                      </RadioButtonTagConfirmPhoto>
                    </RadioButtonView>
                  </ItemWrapperView>
                  <MarginView08/>
                </>
              )
              : null
            }

            <ItemWrapperView>
              <LabelText>{t('OtherComments')}</LabelText>
              <MarginView04/>
              <Input
                enablesReturnKeyAutomatically
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                placeholder={t('DontForget')}
                onFocus={() => setFocusBorder(3)}
              />
              <MarginView04/>
            </ItemWrapperView>
          </DescriptionWorkerView03>
          <MarginView08/>
          <ItemWrapperView>
            <Button type={'submit'} onPress={handleSubmit}>
              {t('Send')}
            </Button>
          </ItemWrapperView>
          <MarginView08/>
          <MarginView08/>
          <MarginView08/>
{/* ------------------------------------------------------------------------ */}
          <Modal isVisible={toggleDates}>
            <ModalView>
              <ModalWrapper>
                <MarginView04/>
                <LabelText>{t('StartDate')}</LabelText>
                <MarginView04/>
                <DateOptionsView>
                  <DateOptions
                    mode={'datetime'}
                    date={startDate}
                    onDateChange={setStartDate}
                    locale={i18n.language}
                    minuteInterval={15}
                    is24hourSource='locale'
                    androidVariant="nativeAndroid"
                    textColor="#000"
                    textSize="24"
                  />
                </DateOptionsView>
                <MarginView08/>
                <LabelText>{t('DueDate')}</LabelText>
                <MarginView04/>
                <DateOptionsView>
                  <DateOptions
                    mode={'datetime'}
                    date={dueDate}
                    onDateChange={setDueDate}
                    locale={i18n.language}
                    minuteInterval={15}
                    is24hourSource='locale'
                    androidVariant="nativeAndroid"
                    textColor="#000"
                    textSize="20"
                  />
                </DateOptionsView>
                <MarginView08/>
                <Button type='inverted' onPress={handleToggleDates}>
                  OK
                </Button>
                <MarginView08/>
              </ModalWrapper>
            </ModalView>
          </Modal>
        </FormScrollView>
      </IosKeyboardAvoidingView>
    </Container>
  )
}
