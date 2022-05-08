import { combineReducers } from 'redux';
import auth from './auth/reducer';
import contact from './contact/reducer';
import image from './image/reducer';
import message from './message/reducer';
import service from './service/reducer';
import task from './task/reducer';
import user from './user/reducer';
import worker from './worker/reducer';

export default combineReducers({ auth, contact, image, message, service, task, user, worker });
