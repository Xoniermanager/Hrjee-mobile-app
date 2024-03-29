import client from './client';

const submit = (body, config) =>
  client.post('/api/user_disposal_request', body, config);

const getAll = (body, config) =>
  client.post('/api/get_all_disposal_request_by_userid', body, config);

const deleteForm = (body, config) =>
  client.post('/api/delete_disposal_request_by_id', body, config);

const getDetails = (body, config) =>
  client.post('/api/get_disposal_request_by_id', body, config);

const updateDetails = (body, config) =>
  client.post('/api/update_user_disposal_request', body, config);

export default {
  submit,
  getAll,
  deleteForm,
  getDetails,
  updateDetails,
};
