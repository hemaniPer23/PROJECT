import axios from 'axios';
//this url was php flie location url in xampp or wamp 
const API = axios.create({
  baseURL: 'http://localhost/PROJECT/backend',
});

export default API;