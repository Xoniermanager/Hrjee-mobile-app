import client from './client';

const resetPassword = body => client.post('/users/reset_password', body);

export default {
  resetPassword,
};
