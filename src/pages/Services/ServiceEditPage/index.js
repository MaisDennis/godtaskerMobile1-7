import React, { useState, useEffect } from 'react'
import { Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import { parseISO, isBefore , isSameHour, subHours, addDays, addMinutes, format } from 'date-fns';
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
  RadioButtonView, RadioButtonTag,
  RadioButtonLabel, RadioButtonOuter,
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
import NumberInput from '~/components/NumberInput'
import { updateTasks } from '~/store/modules/task/actions';
import api from '~/services/api';
import Button from '~/components/Button';
// -----------------------------------------------------------------------------

export default function ServiceEditPage({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const user_id = useSelector(state => state.user.profile.id);
  const user_name = useSelector( state => state.user.profile.user_name)
  // console.log(route.params);
  const data = route.params;

  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description);
  const [focusBorder, setFocusBorder] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(
    route.params.tenure
      ? addDays(new Date(),route.params.tenure)
      : new Date()
    );

  const [subTaskList, setSubTaskList] = useState(data.sub_task_list);
  const [editSubTaskIndex, setEditSubTaskIndex] = useState();
  const [addSubTaskInputValue, setAddSubTaskInputValue] = useState();
  const [addWeigeInputValue, setAddWeigeInputValue] = useState(1);
  const [editSubTaskInputValue, setEditSubTaskInputValue] = useState();
  const [editWeigeInputValue, setEditWeigeInputValue] = useState(1);
  const [subTaskToggleEdit, setSubTaskToggleEdit] = useState(false);
  const [toggleSubtaskConfirmController, setToggleSubtaskConfirmController] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleDates, setToggleDates] = useState(false);
  const [sameHourCheck, setSameHourCheck] = useState(false)

  useEffect(() => {
    loadContacts(user_id);
  }, [ user_id ])

  async function loadContacts(userID) {
    const response = await api.get(`/users/following`, {
      params: {
        contactName: user_name,
        nameFilter: '',
      }
    })

    const checkedList = response.data
    checkedList.forEach(c => {
      c.checked = false;
    });
    setContacts(checkedList)
  }

  let editedWorkers = [];
  async function handletoggleCheckBox(value, position) {
    setToggleCheckBox(!toggleCheckBox) // this distoggles the checkbox
    editedWorkers = contacts;
    const editedWorker = editedWorkers.find(
      (e, index) => index === position
    );
    editedWorker.checked = value;
    editedWorkers[position] = editedWorker;
    setContacts(editedWorkers);
    return
  }

  function handleToggleModal() {
    setToggleModal(!toggleModal)
    setFocusBorder(1)
  }

  function handleToggleDates() {
    setToggleDates(!toggleDates)
    setFocusBorder(3)
  }

  function handleAddSubTask() {
    let editedSubTaskList = subTaskList
    const sub_task_id = Math.floor(Math.random() * 1000000)
    editedSubTaskList.push({
      id: sub_task_id,
      description: addSubTaskInputValue,
      weige: addWeigeInputValue,
      complete: false,
      user_read: true,
    })
    setSubTaskList(editedSubTaskList)
    setAddSubTaskInputValue();
    // console.log(subTaskList)
    navigation.navigate('ServiceEdit');
    // dispatch(updateTasks(new Date()))
  }

  function handleOpenEditSubTask(position) {
    setEditSubTaskIndex(position)
    setSubTaskToggleEdit(!subTaskToggleEdit)
    setEditSubTaskInputValue(subTaskList[position].description)
    setEditWeigeInputValue(subTaskList[position].weige)
  }

  function handleEditSubTask(position) {
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
    // navigation.navigate('TaskEdit',{
    //   sub_task_list: subTaskList,
    // });
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
    let editedSubTaskList = subTaskList
    // editedSubTaskList.splice(position, 1)
    // setSubTaskList(editedSubTaskList)
    // navigation.navigate('TaskEdit',{
    //   sub_task_list: subTaskList,
    // });

    try {
      editedSubTaskList.splice(position, 1)
    }
    catch { console.log('error')}
    finally {
      setSubTaskList(editedSubTaskList)
      setEditSubTaskIndex(null)
      setSubTaskToggleEdit(false)
      setToggleSubtaskConfirmController(!toggleSubtaskConfirmController)
    }
  }

  function handleToggleDates() {
    setToggleDates(!toggleDates)
    setFocusBorder(3)
  }

  function weigeToPercentage(subTasks) {
    let weigeSum = 0;
    for(let i = 0; i < subTasks.length; i++) {
      weigeSum += parseFloat(subTasks[i].weige)
    }

    for(let i = 0; i < subTasks.length; i++) {
      subTasks[i].weige_percentage = (Math.round((parseFloat(subTasks[i].weige) / weigeSum)*1000) /10)
    }
    return weigeSum;
  }

  async function editTasks() {
    weigeToPercentage(subTaskList)
    let subTaskCount = subTaskList.length
    let pointsVariable = 100
    if (subTaskCount >= 6 ) {
      pointsVariable = pointsVariable + 100
    } else if (subTaskCount > 0 && subTaskCount <= 5) {
      pointsVariable = pointsVariable + (subTaskCount * 20)
    }

    await api.put(`/services/${data.id}`, {
      name: name,
      description: description,
      sub_task_list: subTaskList,
    });

    dispatch(updateTasks(new Date()))
  }

  function handlePrior(index) {
    setFocusBorder(3)
    setPrior(index)
  }

  async function handleSubmit() {
    try {
      editTasks()

      Alert.alert(
        t('Success'),
        t('SavedTaskEdited'),
        [{ style: "default" }],
        { cancelable: true },
      )
    }
    catch(error) {
      console.log('error')
      Alert.alert(
        t('SavedTaskNotEdited'),
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
                editable={false}
              />
            </ItemWrapperView>
            <MarginView08/>

            {/* <ItemWrapperView>
              <ButtonTagWrapper>
              <LabelText>{t('SendTo')}</LabelText>
                <ButtonView
                  onPress={handleToggleModal}
                  focusColor = {focusBorder}
                >
                  <ButtonIcon
                    name="list"
                    focusColor = {focusBorder}
                  />
                </ButtonView>
              </ButtonTagWrapper>

              <MarginView04/>
            </ItemWrapperView> */}
          </DescriptionView01>
          <MarginView08/>

          <DescriptionView02 focusColor = {focusBorder}>
            <ItemWrapperView>
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
              {/* <MarginView08/> */}
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
                              <SubTaskLabelText>{index+1}</SubTaskLabelText>
                              <SubTaskText>{s.description}</SubTaskText>
                            </SubTaskTag>
                          </SubTaskLeftView>

                          <SubTaskRightView>
                            <SubTaskButtonView>
                              <SubTaskButton onPress={() => handleEditSubTask(index)}>
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
              <MarginView04/>
              <ButtonTagWrapper>
                <LabelText>{t('StartAndDueDates')}</LabelText>
                <ButtonView03
                  onPress={handleToggleDates}
                  focusColor = {focusBorder}
                >
                  <ButtonIcon03
                    name="calendar"
                    focusColor = {focusBorder}
                  />
                </ButtonView03>
              </ButtonTagWrapper>
              </ItemWrapperView>
            <MarginView08/> */}

            {/* <MarginView04/>
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
            <MarginView04/> */}
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
          </DescriptionView03>
          <MarginView08/>
          <ItemWrapperView>
            <Button onPress={handleSubmit}>
              {t('Edit')}
            </Button>
          </ItemWrapperView>
          <MarginView08/>
          <MarginView08/>
          <MarginView08/>
{/* ------------------------------------------------------------------------ */}
          <Modal isVisible={toggleModal}>
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
