import client from './client';

const submit = (body, config) =>
  client.post('/api/user_acknowledgement', body, config);

const getDetails = (body, config) =>
  client.post('/api/get_user_acknowledgement_by_id', body, config);

export default {
  submit,
  getDetails,
};
