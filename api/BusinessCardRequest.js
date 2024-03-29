import client from './client';

const submit = (body, config) =>
  client.post('/api/user_business_card_request', body, config);

const getDetails = (body, config) =>
  client.post('/api/get_business_card_by_userid', body, config);

export default {
  submit,
  getDetails,
};
