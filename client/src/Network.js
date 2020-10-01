import axios from 'axios';

const network = axios.create({});

const getToken = () => {
  return localStorage.getItem('token');
}

network.interceptors.request.use(
  config => {
    config.headers["Username"] = localStorage.getItem('username');
    config.headers["isUserAdmin"] = localStorage.getItem('admin');
    config.headers["Authorization"] = "bearer " + getToken();
    return config;
  }
);

network.interceptors.response.use(
  config => {
    console.log('RESPONSE', config)
    return config;
  },
  (error) => {
    return error;
  }
);

export default network;