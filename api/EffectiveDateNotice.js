import client from './client';

const submit = (body, config) =>
  client.post('/api/user_effitive_notice_request', body, config);

const getDetails = (body, config) =>
  client.post('/api/get_effitive_notice_request_by_id', body, config);

export default {
  submit,
  getDetails,
};
