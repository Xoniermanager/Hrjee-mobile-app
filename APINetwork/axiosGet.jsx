import axios from 'axios';
const axiosGet = async (url, token) => {
  try {
    const data = await axios({
      method: 'get',
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.log(error);

    return {status: 500};
  }
};
export default axiosGet;
