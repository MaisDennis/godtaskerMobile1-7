export function updateServices(data) {
  return {
    type: '@service/UPDATE_SERVICES',
    payload: { data },
  };
}
