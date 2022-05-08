import produce from 'immer';
// -----------------------------------------------------------------------------
const INITIAL_STATE = {
  services: {},
};
// -----------------------------------------------------------------------------
export default function service(state= INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@service/UPDATE_SERVICES': {
        draft.services = action.payload;
        break;
      }
      default:
    }
  });
}
