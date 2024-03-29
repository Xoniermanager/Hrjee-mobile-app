import client from './client';

const add = (body, config) => client.post('/api/add_user_post', body, config);

const get_cmp_post = (body, config) =>
  client.post('/api/get_all_post_by_cmpid', body, config);

const get_user_post = (body, config) =>
  client.post('/api/get_all_post_by_userid', body, config);

const delete_post = (body, config) =>
  client.post('/api/delete_post_by_id', body, config);

const like_post = (body, config) =>
  client.post('/api/user_like_post', body, config);

const dislike_post = (body, config) =>
  client.post('/api/user_dislike_post', body, config);

const get_post_details = (body, config) =>
  client.post('/api/get_post_by_id', body, config);

const add_comment = (body, config) =>
  client.post('/api/add_user_post_comment', body, config);

const delete_comment = (body, config) =>
  client.post('/api/delete_post_comment_by_id', body, config);

const like_comment = (body, config) =>
  client.post('/api/user_like_comment', body, config);

const dislike_comment = (body, config) =>
  client.post('/api/user_dislike_comment', body, config);

const add_user_repost = (body, config) =>
  client.post('/api/add_user_repost', body, config);

const update_user_repost = (body, config) =>
  client.post('/api/update_user_repost', body, config);

export default {
  add,
  get_cmp_post,
  delete_post,
  like_post,
  dislike_post,
  get_post_details,
  add_comment,
  delete_comment,
  get_user_post,
  like_comment,
  dislike_comment,
  add_user_repost,
  update_user_repost,
};
