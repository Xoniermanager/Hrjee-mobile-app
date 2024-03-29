import client from './client';

const punchIn = (body, config) =>
  client.post('/secondPhaseApi/mark_attendance_in', body, config);

const punchOut = (body, config) =>
  client.post('/secondPhaseApi/mark_attendance_out', body, config);

const todayAttendence = (body, config) =>
  client.post('/api/today_attendance', body, config);

const getAttendance = (body, config) =>
  client.post('/Api/attendance', body, config);

const getActiveLocation = (body, config) =>
  client.post('/api/get_location_list', body, config);

export default {
  punchIn,
  punchOut,
  todayAttendence,
  getAttendance,
  getActiveLocation,
};
