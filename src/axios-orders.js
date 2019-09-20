import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-server-86cef.firebaseio.com/'
});

export default instance