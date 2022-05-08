import React from 'react';

export function signInSuccess(worker) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: { workerPhoneNumber, workerData },
  };
};

export function updateWorkers(data) {
  return {
    type: '@message/UPDATE_WORKERS',
    payload: { data },
  };
}
