import axios from 'axios';
import apiUrl from '../src/reusable/apiUrl';

const apiClient = axios.create({
  // Later read this URL from an environment variable
  baseURL: apiUrl,
});

export default apiClient;
