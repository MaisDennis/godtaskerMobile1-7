import 'react-native-gesture-handler';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import Follow from './pages/Contacts/FollowPage';
import Followed from './pages/Contacts/FollowedPage';

import HeaderView from './components/HeaderRoutesView'
import HeaderMessageConversationView from './components/HeaderMessageConversationView'

import MessagesConversationPage from './pages/Messages/MessagesConversationPage/index';

import ServiceCreate from './pages/Services/ServiceCreatePage';
import ServiceDisplay from './pages/Services/ServiceDisplayPage';
import ServiceEdit from './pages/Services/ServiceEditPage';
import ServiceSend from './pages/Services/ServiceSendPage';
import ServiceWorkerSend from './pages/Services/ServiceWorkerSendPage';

import Settings from '~/pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import TabRoutes from '~/components/TabRoutes';
import TaskCreate from './pages/Tasks/TaskCreatePage';
import TaskEdit from './pages/Tasks/TaskEditPage';

import UpdateProfile from './pages/UpdateProfile';

import WorkerPage from './pages/WorkerPage';


// -----------------------------------------------------------------------------
const Stack = createStackNavigator();
const headerBackVisible = false;
const headerHeight = Platform.OS === 'ios' ? 60 : 42;
const headerMessageConversationHeight = Platform.OS === 'ios' ? 70 : 60;
const headerBackFontSize = 12;
// -----------------------------------------------------------------------------
export default function App() {
  const {t, i18n} = useTranslation()
  const signed = useSelector(state => state.auth.signed);
  const userData = useSelector(state => state.message.userData);
  const workerData = useSelector(state => state.message.workerData);
  const inverted = useSelector(state => state.message.inverted);
  // console.log(workerData)
  // -----------------------------------------------------------------------------
  return (
    <NavigationContainer
      // theme={DarkTheme}
    >
      <Stack.Navigator
        initialRouteName={signed ? 'Home' : 'SignIn'}
        // initialRouteName={'SignIn'}
        screenOptions={{
          headerTitleAlign: "center",
          ...TransitionPresets.ModalTransition,
        }}
      >
      <Stack.Screen name="SignIn" component={SignIn}
        options={{
          title: 'Entrar',
          headerShown: false,
        }}
      />
      <Stack.Screen name="SignUp" component={SignUp}
        options={{
          headerTitle: (() => (<HeaderView data={'Sign Up'}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      <Stack.Screen
        name="Home"
        // component={signed && !userData.first_name ? SignUp03 : TabRoutes}
        component={TabRoutes }
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ServiceCreate"
        component={ServiceCreate}
        options={{
          headerTitle: (() => (<HeaderView data={'Create Saved Task'}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      <Stack.Screen
        name="ServiceDisplay"
        component={ServiceDisplay}
        options={{
          headerTitle: (() => (<HeaderView data={'Offer this Service'}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      <Stack.Screen
        name="ServiceEdit"
        component={ServiceEdit}
        options={{
          headerTitle: (() => (<HeaderView data={'Edit Saved Task'}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      <Stack.Screen
        name="ServiceSend"
        component={ServiceSend}
        options={{
          headerTitle: (() => (<HeaderView data={'Send Task'}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      <Stack.Screen
        name="ServiceWorkerSend"
        component={ServiceWorkerSend}
        options={{
          headerTitle: (() => (<HeaderView data={'Hire this Service'}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      <Stack.Screen
        name="TaskCreate"
        component={TaskCreate}
        options={{
          headerTitle: (() => (<HeaderView data={t('CreateTask')}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      <Stack.Screen
        name="TaskEdit"
        component={TaskEdit}
        options={{
          headerTitle: (() => (<HeaderView data={t('EditTask')}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTitle: (() => (<HeaderView data={t('Settings')}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      <Stack.Screen
        name="Followed"
        component={Followed}
        options={{
          headerTitle: (() => (<HeaderView data={t('Followers')}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
            <Stack.Screen
        name="Follow"
        component={Follow}
        options={{
          headerTitle: (() => (<HeaderView data={t('Following')}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      <Stack.Screen
        name="WorkerPage"
        component={WorkerPage}
        options={{
          headerTitle: (() => (<HeaderView data={t('ContactProfile')}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      <Stack.Screen
        name="MessagesConversationPage"
        component={MessagesConversationPage}
        options={{
          headerTitle: (() => (
            <HeaderMessageConversationView data={{userData, workerData, inverted}}/>
          )),
          headerShown: true,
          headerStyle: {
            height: headerMessageConversationHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{
          headerTitle: (() => (<HeaderView data={'Edit Profile'}/>)),
          headerShown: true,
          headerStyle: {
            height: headerHeight,
            backgroundColor: '#fff',
          },
          headerBackTitleVisible: headerBackVisible,
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontSize: headerBackFontSize,
            marginLeft: 8,
            color: '#4433ee',
          },
        }}
      />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
