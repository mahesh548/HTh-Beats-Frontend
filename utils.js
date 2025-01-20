import axios from "axios";
import { useNavigate } from "react-router";
const apiUrl = "https://92rrp2s6-5000.inc1.devtunnels.ms/api";
const backendUrl = "https://92rrp2s6-8080.inc1.devtunnels.ms";

const utils = {
  BACKEND: async (path = "/", methods = "POST", payload = {}) => {
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
        utils.Logout();
      }
      return data?.data;
    } catch (error) {
      if (error?.response?.data?.auth == false) {
        utils.Logout();
      } else {
        return error.response;
      }
    }
  },
  API: async (path = "/", methods = "GET", payload = {}) => {
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
      console.log(data?.headers?.session);
      localStorage.setItem("session", data?.headers?.session);
      if (data?.data?.auth == false) {
        utils.Logout();
      }
      return data?.data;
    } catch (error) {
      if (error?.response?.data?.auth == false) {
        utils.Logout();
      } else {
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
  dura: (time) => {
    const now = new Date();
    const old = new Date(time);
    const mili = now - old;
    const sec = Math.floor(mili / 1000);
    const min = Math.floor(sec / 60);
    const hrs = Math.floor(min / 60);
    return { mili, sec, min, hrs };
  },
  capitalLetter: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1, str.length);
  },
  getAverageColor: (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let r = 0,
          g = 0,
          b = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
        }

        const pixelCount = pixels.length / 4;
        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);

        resolve(`rgb(${r}, ${g}, ${b})`);
      };

      img.onerror = () => {
        console.error("Failed to load image.");
        resolve("");
      };
    });
  },
  Logout: () => {
    /* localStorage.clear();
    window.location.href = "/login"; */
    console.log("logging out");
  },
};

export default utils;
