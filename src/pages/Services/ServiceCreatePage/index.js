import React, { useState, useEffect } from 'react'
// import { DatePickerModal } from 'react-native-paper-dates';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import { parseISO, isBefore , isSameHour, subHours, addMinutes, format } from 'date-fns';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import {
  AlignCheckBoxView,
  ButtonIcon, ButtonIcon02, ButtonIcon03, ButtonTagWrapper, ButtonView, ButtonView02, ButtonView03,
  CheckBoxWrapper, CheckBoxView, Container,
  DateOptionsView, DateOptions, DescriptionSpan, DescriptionView01, DescriptionView02, DescriptionView03,
  FormScrollView,
  HrLine,
  Input, IosKeyboardAvoidingView, ItemWrapperView,
  LabelText,
  MarginView02, MarginView04, MarginView08, ModalView, ModalWrapper,
  PillButton,
  RadioButtonView, RadioButtonTag, RadioButtonTagConfirmPhoto,
  RadioButtonLabel, RadioButtonOuter, RadioButtonInner0,
  RadioButtonInner1, RadioButtonInner2, RadioButtonInner3,
  RadioButtonInner4, RadioButtonLabelText,
  SubTaskButton, SubTaskButtonView, SubTaskCancelIcon, SubTaskConfirmButton, SubTaskConfirmIcon, SubTaskConfirmView,
  SubTaskEditIcon, SubTaskInput, SubTaskLabelText,
  SubTaskLeftView, SubTaskRightView,
  SubTaskTag, SubTaskText,
  SubTaskWeigeText, SubTaskWrapper, SubTaskView,
  WeigeView, WeigeTagView, WeigeText,
} from '../../Tasks/TaskCreatePage/styles'
import NumberInput from '~/components/NumberInput'
import { updateServices } from '~/store/modules/service/actions';
import Button from '~/components/Button';
import api from '~/services/api';
// -----------------------------------------------------------------------------
export default function ServiceCreatePage({ navigation }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const userId = useSelector( state => state.user.profile.id)
  const userName = useSelector( state => state.user.profile.user_name)
  const userEmail = useSelector( state => state.user.profile.email)
  const [name, setName] = useState("");
  const [description, setDescription] = useState();
  const [prior, setPrior] = useState(4);
  const [confirmPhoto, setConfirmPhoto] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [contacts, setContacts] = useState([]);
  const [focusBorder, setFocusBorder] = useState(1);
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleDates, setToggleDates] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [subTaskList, setSubTaskList] = useState([]);
  const [editSubTaskIndex, setEditSubTaskIndex] = useState();
  const [addSubTaskInputValue, setAddSubTaskInputValue] = useState();
  const [addWeigeInputValue, setAddWeigeInputValue] = useState(1);
  const [editSubTaskInputValue, setEditSubTaskInputValue] = useState();
  const [editWeigeInputValue, setEditWeigeInputValue] = useState(1);
  const [subTaskToggleEdit, setSubTaskToggleEdit] = useState(false);
  const [sameHourCheck, setSameHourCheck] = useState(false)
  const [urgent, setUrgent] = useState(4); // leave for now to not have error upon submit
  const [complex, setComplex] = useState(4); // leave for now to not have error upon submit
  const [toggleSubtaskConfirmController, setToggleSubtaskConfirmController] = useState(false);

  function handleToggleModal() {
    setToggleModal(!toggleModal)
    setFocusBorder(1)
  }

  function handleToggleDates() {
    setToggleDates(!toggleDates)
    setFocusBorder(3)
  }

  function handleAddSubTask() {
    if (addSubTaskInputValue === undefined) return;

    let editedSubTaskList = subTaskList
    const sub_task_id = Math.floor(Math.random() * 1000000)
    editedSubTaskList.push({
      id: sub_task_id,
      description: addSubTaskInputValue,
      weige: addWeigeInputValue,
      complete: false,
      user_read: true,
      worker_read: false,
    })
    setSubTaskList(editedSubTaskList);
    setAddSubTaskInputValue();
    // navigation.navigate('TaskCreate');
    // dispatch(updateTasks(new Date()))
  }

  function handleOpenEditSubTask(position) {
    if (subTaskToggleEdit === false) {
      setEditSubTaskIndex(position)
      setSubTaskToggleEdit(!subTaskToggleEdit)
      setEditSubTaskInputValue(subTaskList[position].description)
      setEditWeigeInputValue(subTaskList[position].weige)
      return
    }
    setSubTaskToggleEdit(!subTaskToggleEdit)

  }

  function handleConfirmEditSubtask(position) {
    let editedSubTaskList = subTaskList.map((s, index) => {
      if (index === position) {
        s.description = editSubTaskInputValue;
        s.weige = editWeigeInputValue;
      }
      return s;
    })
    setSubTaskList(editedSubTaskList)
    setEditSubTaskIndex(null);
    setSubTaskToggleEdit(false);
  }

  function handleDeleteSubTask(position) {
    let editedSubTaskList = subTaskList;
    try {
      editedSubTaskList.splice(position, 1)
    }
    catch { console.log(error)}
    finally {
      setSubTaskList(editedSubTaskList)
      setEditSubTaskIndex(null)
      setSubTaskToggleEdit(false)
      setToggleSubtaskConfirmController(!toggleSubtaskConfirmController)
    }
  }

  function weigeToPercentage(subTasks) {
    let weigeSum = 0;
    for(let i = 0; i < subTasks.length; i++) {
      weigeSum += parseFloat(subTasks[i].weige)
    }

    for(let i = 0; i < subTasks.length; i++) {
      subTasks[i].weige_percentage = (
        Math.round((parseFloat(subTasks[i].weige) / weigeSum)*1000)/10
      )
    }
    return weigeSum;
  }

  async function createService() {
    weigeToPercentage(subTaskList)
    let subTaskCount = subTaskList.length
    let pointsVariable = 100
    if (subTaskCount >= 6 ) {
      pointsVariable = pointsVariable + 100
    } else if (subTaskCount > 0 && subTaskCount <= 5) {
      pointsVariable = pointsVariable + (subTaskCount * 20)
    }

    await api.post('/services', {
      creator_email: userEmail,
      name: name,
      description: description,
      sub_task_list: subTaskList,
      // task_attributes: [prior, urgent, complex],
    });
    dispatch(updateServices(new Date()))
  }

  function handleSubmit() {
    if (name === '') {
      Alert.alert(
        t('PleaseInsertATitle'),
        '',
        [{ style: "default" }],
        { cancelable: true },
      )
      return
    }


    try {
      createService()
      Alert.alert(
        t('Success'),
        t('ThisTemplateCan'),
        [{ style: "default" }],
        { cancelable: true },
      )
      navigation.navigate('Dashboard')

    } catch(error) {
      setSubmitError(true)
      Alert.alert(
        t('ErrorServiceNotRegistered'),
        t('PleaseTryAgain'),
        [{ style: "default" }],
        { cancelable: true },
      )
    }
    // navigation.goBack()
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
          <DescriptionView01
            focusColor = {focusBorder}
          >
            <ItemWrapperView>
              <LabelText>{t('Title')}</LabelText>
              <MarginView04/>
              <Input
                enablesReturnKeyAutomatically
                multiline
                value={name}
                onChangeText={setName}
                placeholder={t('WashTheCar')}
                onFocus = {() => setFocusBorder(1)}
              />
            </ItemWrapperView>
            <MarginView08/>
          </DescriptionView01>
          <MarginView08/>
          <DescriptionView02 focusColor = {focusBorder}>
            <ItemWrapperView>
              <MarginView04/>
              <LabelText>{t('SubItem')}</LabelText>
              <MarginView04/>
              <SubTaskView>
                  <SubTaskInput
                    enablesReturnKeyAutomatically
                    multiline
                    numberOfLines={4}
                    onChangeText={setAddSubTaskInputValue}
                    placeholder={t('UseSoap')}
                    textBreakStrategy="highQuality"
                    value={addSubTaskInputValue}
                    onFocus = {() => setFocusBorder(2)}
                  />
                  <MarginView08/>
                  <WeigeView>
                    <WeigeText>{t('SubItemWeige')}</WeigeText>
                    <NumberInput
                      numberInputValue={addWeigeInputValue}
                      setNumberInputValue={setAddWeigeInputValue}
                      focusColor={focusBorder}
                    />
                    <ButtonView02
                      onPress={handleAddSubTask}
                      focusColor = {focusBorder}
                    >
                      <ButtonIcon02
                        name="plus-square"
                        focusColor = {focusBorder}
                      />
                    </ButtonView02>
                  </WeigeView>
                  <MarginView08/>
              </SubTaskView>
            </ItemWrapperView>

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
                  {
                    subTaskToggleEdit && (editSubTaskIndex === index)
                    ? (
                      <>
                        <SubTaskWrapper>
                          <SubTaskLeftView>
                            <SubTaskTag>
                              <SubTaskLabelText>{index+1}.</SubTaskLabelText>
                              <SubTaskText>{s.description}</SubTaskText>
                            </SubTaskTag>
                          </SubTaskLeftView>

                          <SubTaskRightView>
                            <SubTaskButtonView>
                              <SubTaskButton onPress={() => handleOpenEditSubTask(index)}>
                                <SubTaskEditIcon name="edit-2"/>
                              </SubTaskButton>
                              <SubTaskButton onPress={() => handleDeleteSubTask(index)}>
                                <SubTaskCancelIcon name="x-circle"/>
                              </SubTaskButton>
                            </SubTaskButtonView>
                            <SubTaskTag>
                              <WeigeTagView>
                                <WeigeText>{t('Weige')}</WeigeText>
                                <SubTaskWeigeText>{s.weige}</SubTaskWeigeText>
                              </WeigeTagView>
                            </SubTaskTag>
                          </SubTaskRightView>
                        </SubTaskWrapper>

                        <SubTaskInput
                          enablesReturnKeyAutomatically
                          multiline
                          numberOfLines={1}
                          onChangeText={setEditSubTaskInputValue}
                          value={editSubTaskInputValue}
                        />
                        <MarginView08/>
                        <WeigeView>
                          <WeigeText>{t('SubItemWeige')}</WeigeText>
                          <NumberInput
                            numberInputValue={editWeigeInputValue}
                            setNumberInputValue={setEditWeigeInputValue}
                            focusColor={focusBorder}
                          />
                          <SubTaskConfirmButton onPress={() => handleConfirmEditSubtask(index)}>
                            <SubTaskConfirmIcon name="check-circle"/>
                          </SubTaskConfirmButton>
                        </WeigeView>
                        <MarginView04/>
                        {/* ----------- */}
                        <MarginView04/>
                        <HrLine/>
                        <MarginView04/>
                        {/* ----------- */}
                      </>
                    )
                    : (
                      <>
                        <SubTaskWrapper>
                          <SubTaskLeftView>
                            <SubTaskTag>
                              <SubTaskLabelText>{index+1}.</SubTaskLabelText>
                              <SubTaskText>{s.description}</SubTaskText>
                            </SubTaskTag>
                          </SubTaskLeftView>

                          <SubTaskRightView>
                            <SubTaskButtonView>
                              <SubTaskButton onPress={() => handleOpenEditSubTask(index)}>
                                <SubTaskEditIcon name="edit-2"/>
                              </SubTaskButton>
                              <SubTaskButton onPress={() => handleDeleteSubTask(index)}>
                                <SubTaskCancelIcon name="x-circle"/>
                              </SubTaskButton>
                            </SubTaskButtonView>
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
                    )
                  }
                </SubTaskView>
              ))}

            </ItemWrapperView>
          </DescriptionView02>
          <MarginView08/>

          <DescriptionView03
            focusColor = {focusBorder}
          >
            {/* <ItemWrapperView>
              <RadioButtonLabelText>Option to Confirm with Photo:</RadioButtonLabelText>
              <MarginView04/>
              <RadioButtonView>
                <RadioButtonTagConfirmPhoto onPress={() => handleConfirmPhoto(1)}>
                  <RadioButtonLabel>Standard Yes</RadioButtonLabel>
                  <RadioButtonOuter>
                    <RadioButtonInner1 switch={confirmPhoto}/>
                  </RadioButtonOuter>
                </RadioButtonTagConfirmPhoto>
                <RadioButtonTagConfirmPhoto onPress={() => handleConfirmPhoto(2)}>
                  <RadioButtonLabel>Standard No</RadioButtonLabel>
                  <RadioButtonOuter>
                    <RadioButtonInner2 switch={confirmPhoto}/>
                  </RadioButtonOuter>
                </RadioButtonTagConfirmPhoto>
                <RadioButtonTagConfirmPhoto onPress={() => handleConfirmPhoto(3)}>
                  <RadioButtonLabel>User Decides</RadioButtonLabel>
                  <RadioButtonOuter>
                    <RadioButtonInner3 switch={confirmPhoto}/>
                  </RadioButtonOuter>
                </RadioButtonTagConfirmPhoto>
              </RadioButtonView>
            </ItemWrapperView>
            <MarginView08/> */}

            <ItemWrapperView>
              <LabelText>{t('OtherComments')}</LabelText>
              <MarginView04/>
              <Input
                enablesReturnKeyAutomatically
                multiline
                numberOfLines={4}
                onChangeText={setDescription}
                placeholder={t('DontForget')}
                value={description}
                onFocus={() => setFocusBorder(3)}
              />
              <MarginView04/>
            </ItemWrapperView>
          </DescriptionView03>
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
          <Modal isVisible={toggleModal}>
            { submitError
              ? (
                <ModalView>
                  {/* <Text>Error</Text> */}
                </ModalView>
              )
              : (
                <ModalView>
                  <ModalWrapper>

                    <MarginView04/>
                    <LabelText>{t('FollowingList')}</LabelText>
                    <MarginView02/>
                    <FormScrollView>
                      { contacts.map((c, index) => (
                        <AlignCheckBoxView key={index}>
                          <MarginView02/>
                          <CheckBoxView>
                            <CheckBox
                              disabled={false}
                              // value={editedWorkers[index]}
                              value={c.checked}
                              onValueChange={
                                (newValue) => handletoggleCheckBox(newValue, index)
                              }
                            />
                            <DescriptionSpan type="check-box">{c.worker_name}</DescriptionSpan>
                          </CheckBoxView>
                          <MarginView02/>
                        </AlignCheckBoxView>
                      ))}
                    </FormScrollView>
                    <MarginView02/>
                    <Button type='inverted' onPress={handleToggleModal}>
                      OK
                    </Button>
                    <MarginView08/>
                  </ModalWrapper>
                </ModalView>
              )
            }
          </Modal>

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
                    is24hourSource='locale'
                    androidVariant="nativeAndroid"
                    textColor="#1B2432"
                    textSize="20"
                    minimumDate={new Date()}
                  />
                </DateOptionsView>
                <MarginView08/>
                <LabelText>{t('DueDate')}</LabelText>
                <MarginView04/>
                <DateOptionsView>
                  <DateOptions
                    date={dueDate}
                    onDateChange={setDueDate}
                    locale={i18n.language}
                    is24hourSource='locale'
                    androidVariant="nativeAndroid"
                    textColor="#1B2432"
                    textSize="20"
                    minimumDate={new Date()}
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
