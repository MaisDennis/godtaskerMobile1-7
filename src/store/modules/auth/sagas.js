import { takeLatest, call, put, all} from 'redux-saga/effects';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
// -----------------------------------------------------------------------------
// import history from '~/services/history';
import api from '~/services/api';
import { signInSuccess, signFailure, signUpSuccess, signUpFailure } from './actions';
// -----------------------------------------------------------------------------
export function* signIn({ payload }) {
  // console.log(payload)

  try {
    const {
      email,
      password,
    } = payload;

    const response = yield call(api.post, 'sessions', {
      email,
    });

    const { token, user } = response.data;

    // console.log(response.data)

    api.defaults.headers.Authorization = `Bearer ${token}`;

    const responseWorkers = yield call(api.get, 'workers/mobile', {
      params: { test: '' },
    });

    const worker = responseWorkers.data.find(
      w => w.email == email
    );


    yield put(signInSuccess(token, user, worker));
    console.log('signed in')

  } catch (error) {
    yield put(signFailure());
    console.log(error)

  }
}
// -----------------------------------------------------------------------------
// export function setToken({payload }) {
//   if(!payload) return;
//   const { token } = payload.auth;
//   if (token) {
//     api.defaults.headers.Authorization = `Bearer ${token}`;
//   }
// }
// -----------------------------------------------------------------------------
export function* signUp({ payload }) {

  const {
    user_name,
    password,
    email,
    bio,
  } = payload;

  const response = yield call(api.post, 'users', {
    user_name,
    worker_name: user_name,
    password,
    email,
    bio,
    points: 0,
    subscriber: false
  })
}

// -----------------------------------------------------------------------------
export function signOnOut() {
  // history.push('/');
  auth()
  .signOut()
  .then(() => console.log('User signed out!'));
}
// -----------------------------------------------------------------------------
export default all([
  // takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOnOut),
]);
