import axios from "axios";
export const authAxios = axios.create({
    baseURL:'http://globalwayout.in',
    headers: {
        'Content-Type': 'application/json'
      }
})