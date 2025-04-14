import axios from "axios";
// console.log(process.env.REACT_APP_base_URL)
export const authAxios = axios.create({
    baseURL:'http://globalwayout.in',
    headers: {
        'Content-Type': 'application/json'
      }
})