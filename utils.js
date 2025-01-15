import axios from "axios";
import { useNavigate } from "react-router";
const apiUrl = "https://92rrp2s6-5000.inc1.devtunnels.ms";
const backendUrl = "https://92rrp2s6-8080.inc1.devtunnels.ms";

const utils = {
  BACKEND: async (path, methods, payload = {}) => {
    try {
      const url = `${backendUrl}${path}`;
      const session = localStorage.getItem("session");
      axios.defaults.headers.common["Authorization"] = `Bearer ${session}`;
      let data;
      if (methods == "GET") {
        data = await axios.get(url, payload);
      }
      if (methods == "POST") {
        data = await axios.post(url, payload);
      }
      if (methods == "DELETE") {
        data = await axios.delete(url, { data: payload });
      }

      localStorage.setItem("session", data?.headers?.session);
      if (data?.data?.auth == false) {
        localStorage.clear();
        const navigate = useNavigate();
        navigate("/login");
      }
      return data?.data;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },
  API: async (path, methods, payload = {}) => {
    try {
      const url = `${apiUrl}${path}`;
      const session = localStorage.getItem("session");
      axios.defaults.headers.common["Authorization"] = `Bearer ${session}`;
      let data;
      if (methods == "GET") {
        data = await axios.get(url, payload);
      }
      if (methods == "POST") {
        data = await axios.post(url, payload);
      }
      if (methods == "DELETE") {
        data = await axios.delete(url, { data: payload });
      }

      localStorage.setItem("session", data?.headers?.session);
      if (data?.data?.auth == false) {
        localStorage.clear();
        const navigate = useNavigate();
        navigate("/login");
      }
      return data?.data;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  },
  verifyValue: (value, type) => {
    const userRegex = /^[a-zA-Z0-9_]+$/;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const otpRegex = /^[0-9]{4}$/;
    if (type == "u") {
      if (userRegex.test(value)) {
        return "pass";
      } else {
        return "Only Letters,Numbers,Underscore Are Allowed";
      }
    }
    if (type == "e") {
      if (emailRegex.test(value)) {
        return "pass";
      } else {
        return "Enter A Valid Email";
      }
    }
    if (type == "u&e") {
      if (userRegex.test(value) || emailRegex.test(value)) {
        return "pass";
      } else {
        return "Enter A Valid Email or Username";
      }
    }
    if (type == "otp") {
      if (otpRegex.test(value)) {
        return "pass";
      } else {
        return "Enter A Valid OTP";
      }
    }
  },
};

export default utils;
