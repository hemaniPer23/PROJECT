import axios from 'axios';
//this url was php flie location url in xampp or wamp 
const API = axios.create({
  baseURL: 'http://10.114.247.23/PROJECT/backend',
});

export default API;