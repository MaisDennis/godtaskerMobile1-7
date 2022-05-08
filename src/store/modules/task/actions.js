export function updateTasks(data) {
  return {
    type: '@task/UPDATE_TASKS',
    payload: { data },
  };
}
