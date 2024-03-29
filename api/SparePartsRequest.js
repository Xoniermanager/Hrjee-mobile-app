import client from './client';

const submit = (body, config) =>
  client.post('/api/user_accessories_request', body, config);

const getAll = (body, config) =>
  client.post('/api/get_all_accessories_request_by_userid', body, config);

const deleteForm = (body, config) =>
  client.post('/api/delete_accessories_request_by_id', body, config);

const getDetails = (body, config) =>
  client.post('/api/get_accessories_request_by_id', body, config);

const updateDetails = (body, config) =>
  client.post('/api/update_user_accessories_request', body, config);

export default {
  submit,
  getAll,
  deleteForm,
  getDetails,
  updateDetails,
};
