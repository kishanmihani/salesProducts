// ✅ Common methods
import axios from "axios";

const API = axios.create({
  baseURL: "http://globalwayout.in", // replace with your API URL
  headers: {
    "Content-Type": "application/json",
  },
})
const api = {
  get: async (url, params = {}) => {
    try {
      const res = await API.get(url, { params });
      return { data: res.data, error: null };
    } catch (err) {
      return { data: null, error: err.response?.data || err.message };
    }
  },

  post: async (url, body = {}) => {
    try {
      const res = await API.post(url, body);
      return { data: res.data, error: null };
    } catch (err) {
      return { data: null, error: err.response?.data || err.message };
    }
  },

  put: async (url, body = {}) => {
    try {
      const res = await API.put(url, body);
      return { data: res.data, error: null };
    } catch (err) {
      return { data: null, error: err.response?.data || err.message };
    }
  },

  delete: async (url) => {
    try {
      const res = await API.delete(url);
      return { data: res.data, error: null };
    } catch (err) {
      return { data: null, error: err.response?.data || err.message };
    }
  },
};

export default api;