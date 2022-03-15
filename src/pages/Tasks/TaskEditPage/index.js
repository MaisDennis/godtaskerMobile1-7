import React, { useState } from 'react'
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import Modal from 'react-native-modal';
import { parseISO, isBefore , isSameHour, subHours, addMinutes, format } from 'date-fns';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import {
  CheckBoxWrapper, Container,
  DateOptionsView, DateOptions,
  FormScrollView,
  HrLine,
  Input, IosKeyboardAvoidingView, ItemWrapperView,
  LabelText,
  MarginView02, MarginView04, MarginView08, ModalView,
  RadioButtonView, RadioButtonTag,
  RadioButtonLabel, RadioButtonOuter,
  RadioButtonInner1, RadioButtonInner2, RadioButtonInner3,
  RadioButtonInner4,
  SubTaskButton, SubTaskButtonView,
  SubTaskCancelIcon, SubTaskEditIcon,
  SubTaskInput,
  SubTaskLabelText, SubTaskLeftView, SubTaskRightView,
  SubTaskTag, SubTaskText,
  SubTaskWeigeText, SubTaskWrapper, SubTaskView,
  SubmitButton, SubmitButtonText,
  TitleText,
  WeigeView, WeigeTagView, WeigeText,
} from '../TaskCreatePage/styles'
import NumberInput from '~/components/NumberInput'
import { updateTasks } from '~/store/modules/task/actions';
import api from '~/services/api';
import Button from '~/components/Button';
// -----------------------------------------------------------------------------

export default function TaskEditPage({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const data = route.params;

  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description);
  const [prior, setPrior] = useState(data.task_attributes[0]);
  const [urgent, setUrgent] = useState(data.task_attributes[1]);
  const [complex, setComplex] = useState(data.task_attributes[2]);
  const [startDate, setStartDate] = useState(parseISO(data.start_date));
  const [dueDate, setDueDate] = useState(parseISO(data.due_date));

  const [subTaskList, setSubTaskList] = useState(data.sub_task_list);
  const [editSubTaskIndex, setEditSubTaskIndex] = useState();
  const [addSubTaskInputValue, setAddSubTaskInputValue] = useState();
  const [addWeigeInputValue, setAddWeigeInputValue] = useState(1);
  const [editSubTaskInputValue, setEditSubTaskInputValue] = useState();
  const [editWeigeInputValue, setEditWeigeInputValue] = useState(1);
  const [subTaskToggleEdit, setSubTaskToggleEdit] = useState(false);
  const [toggleDates, setToggleDates] = useState(false);
  const [sameHourCheck, setSameHourCheck] = useState(false)

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
    navigation.navigate('TaskEdit');
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

  function handleDeleteSubTask(position) {
    let editedSubTaskList = subTaskList
    editedSubTaskList.splice(position, 1)
    setSubTaskList(editedSubTaskList)
    navigation.navigate('TaskEdit',{
      sub_task_list: subTaskList,
    });
  }

  function handleToggleDates() {
    setToggleDates(!toggleDates)
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

    await api.put(`tasks/${data.id}/notification/worker`, {
      name: name,
      description: description,
      sub_task_list: subTaskList,
      task_attributes: [prior, urgent, complex],
      start_date: startDate,
      due_date: dueDate,
      status: {
        "status": 1,
        "comment": `Task Edited: ${name}`,
      },
    });

    dispatch(updateTasks(new Date()))
  }

  async function handleSubmit() {
    if (name === '') {
      Alert.alert(
        t('PleaseInsertATitle'),
        '',
        [{ style: "default" }],
        { cancelable: true },
      )
      return
    }
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
        t('Success'),
        t('TaskRegistered'),
        [{ style: "default" }],
        { cancelable: true },
      )
    }
    catch(error) {
      console.log(error)
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
          <ItemWrapperView>
            <LabelText>{t('Title')}</LabelText>
            <MarginView04/>
            <Input
              enablesReturnKeyAutomatically
              multiline
              value={name}
              onChangeText={setName}
              placeholder={t('WashTheCar')}
            />
          </ItemWrapperView>
          <MarginView08/>
          <ItemWrapperView>
            <LabelText>{t('SentTo')}</LabelText>
            <MarginView04/>
            <TitleText>{data.worker.worker_name}</TitleText>
          </ItemWrapperView>
          {/* ----------- */}
          <MarginView04/>
          <HrLine/>
          <MarginView04/>
          {/* ----------- */}
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
              />
              <MarginView08/>
              <WeigeView>
                  <WeigeText>{t('SubItemWeige')}</WeigeText>
                  <NumberInput
                    numberInputValue={addWeigeInputValue}
                    setNumberInputValue={setAddWeigeInputValue}
                  />
              </WeigeView>
              <MarginView08/>
              <WeigeView>
                <Button onPress={handleAddSubTask}>
                {t('AddSubItem')}
                </Button>
              </WeigeView>
            </SubTaskView>
          </ItemWrapperView>
          <MarginView08/>
          <ItemWrapperView>
            {subTaskList != ''
              ? (
                  <>
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
                      <WeigeView>
                        <WeigeText>{t('SubItemWeige')}</WeigeText>
                        <NumberInput
                          numberInputValue={editWeigeInputValue}
                          setNumberInputValue={setEditWeigeInputValue}
                        />
                      </WeigeView>
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
          <MarginView08/>
          <ItemWrapperView>
            <LabelText>{t('StartAndDueDates')}</LabelText>
            <MarginView04/>
            <WeigeView>
              <Button
                onPress={handleToggleDates}
                uppercase={false}
                mode="outlined"
              >
                {t('PickDates')}
              </Button>
            </WeigeView>
          </ItemWrapperView>
          <MarginView08/>
          <ItemWrapperView>
            <LabelText>{t('PickDates')}</LabelText>
            <MarginView04/>
            <RadioButtonView>
              <RadioButtonTag onPress={() => setPrior(1)}>
                <RadioButtonLabel>{t('Low')}</RadioButtonLabel>
                <RadioButtonOuter>
                  <RadioButtonInner1 switch={prior}/>
                </RadioButtonOuter>
              </RadioButtonTag>
              <RadioButtonTag onPress={() => setPrior(2)}>
                <RadioButtonLabel>{t('Medium')}</RadioButtonLabel>
                <RadioButtonOuter>
                  <RadioButtonInner2 switch={prior}/>
                </RadioButtonOuter>
              </RadioButtonTag>
              <RadioButtonTag onPress={() => setPrior(3)}>
                <RadioButtonLabel>{t('High')}</RadioButtonLabel>
                <RadioButtonOuter>
                  <RadioButtonInner3 switch={prior}/>
                </RadioButtonOuter>
              </RadioButtonTag>
              <RadioButtonTag onPress={() => setPrior(4)}>
                <RadioButtonLabel>{t('NA')}</RadioButtonLabel>
                <RadioButtonOuter>
                  <RadioButtonInner4 switch={prior}/>
                </RadioButtonOuter>
              </RadioButtonTag>
            </RadioButtonView>
          </ItemWrapperView>
          <MarginView08/>
          <ItemWrapperView>
            <LabelText>{t('OtherComments')}</LabelText>
            <MarginView04/>
            <Input
              value={description}
              onChangeText={setDescription}
            ></Input>
          </ItemWrapperView>
          <MarginView04/>
          {/* ----------- */}
          <MarginView04/>
          <HrLine/>
          <MarginView04/>
          {/* ----------- */}
          <ItemWrapperView>
            <Button type={'submit'} onPress={handleSubmit}>
              {t('Send')}
            </Button>
          </ItemWrapperView>
          <MarginView08/>
          <MarginView08/>
          <MarginView08/>

          <Modal isVisible={toggleDates}>
            <ModalView>
              <CheckBoxWrapper>
              <MarginView04/>
              <LabelText>{t('StartDate')}</LabelText>
              <MarginView04/>
              <DateOptionsView>
                <DateOptions
                  mode={'datetime'}
                  date={startDate}
                  onDateChange={setStartDate}
                  locale='en'
                  minuteInterval={15}
                  // is24hourSource='locale'
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
                  locale='en'
                  minuteInterval={15}
                  // is24hourSource='locale'
                  androidVariant="nativeAndroid"
                  textColor="#000"
                  textSize="24"
                />
              </DateOptionsView>
              {/* ----------- */}
              <MarginView04/>
              <HrLine/>
              <MarginView04/>
              {/* ----------- */}

                <Button onPress={handleToggleDates}>
                  OK
                </Button>
              </CheckBoxWrapper>
            </ModalView>
          </Modal>

        </FormScrollView>
      </IosKeyboardAvoidingView>
    </Container>
  )
}
