import client from './client';

const submit = (body, config) =>
  client.post(
    '/api/user_acknowledgement_receiving_internal_policy',
    body,
    config,
  );

const getDetails = (body, config) =>
  client.post(
    '/api/get_acknowledgement_receiving_internal_policy_by_id',
    body,
    config,
  );

export default {
  submit,
  getDetails,
};
