import axios from 'axios';

const network = axios.create({});

const getToken = () => {
  return localStorage.getItem('token');
}

network.interceptors.request.use(
  config => {
    config.headers["Username"] = localStorage.getItem('username');
    config.headers["Authorization"] = "bearer " + getToken();
    return config;
  }
);

network.interceptors.response.use(
  config => {
    return config;
  },
  (error) => {
    return error;
  }
);

export default network;