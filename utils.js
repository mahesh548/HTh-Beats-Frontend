import axios from "axios";
const apiUrl = "https://m8b5chhv-5000.inc1.devtunnels.ms/api";
const backendUrl = "https://m8b5chhv-8080.inc1.devtunnels.ms";

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
  isDifferentDay: (timestamp1, timestamp2) => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    return (
      date1.getFullYear() !== date2.getFullYear() ||
      date1.getMonth() !== date2.getMonth() ||
      date1.getDate() !== date2.getDate()
    );
  },
  formatTimestamp: (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1); // Set yesterday's date

    // Extract year, month, and date
    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (isSameDay(date, today)) {
      return "Today";
    } else if (isSameDay(date, yesterday)) {
      return "Yesterday";
    } else {
      // Format as "Tue, 24 Mar, 2025"
      return date
        .toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(",", "");
    }
  },
  capitalLetter: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1, str.length);
  },
  getAverageColor: (imageUrl, factor = 1) => {
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
        r = Math.floor((r / pixelCount) * factor);
        g = Math.floor((g / pixelCount) * factor);
        b = Math.floor((b / pixelCount) * factor);

        resolve(`rgb(${r}, ${g}, ${b})`);
      };

      img.onerror = () => {
        console.error("Failed to load image.");
        resolve("");
      };
    });
  },
  Logout: () => {
    localStorage.clear();
    window.location.href = "/login";
  },
  refineText: (str) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  },
  getItemFromId: (id, array) => {
    return array.filter((item) => item.id == id)[0];
  },
  decryptor: (encryptedUrl) => {
    const key = CryptoJS.enc.Utf8.parse("38346591");
    const ciphertext = encryptedUrl;
    const decrypted = CryptoJS.TripleDES.decrypt(ciphertext, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    return plaintext.replace("_96.mp4", "_320.mp4");
  },
  formatDuration: (time) => {
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    var ret = "";
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  },
  timelineUpdater: () => {
    const audio = document.getElementById("audio");
    const currentDurationItem = [...document.getElementsByClassName("CD")];
    const rangeItem = [...document.getElementsByClassName("RANGE")];
    if (currentDurationItem.length != 0) {
      currentDurationItem.forEach(
        (item) => (item.innerText = utils.formatDuration(audio.currentTime))
      );
    }
    if (rangeItem.length != 0) {
      rangeItem.forEach((item) => {
        item.value = audio.currentTime;
        item.style.background = utils.timeLineStyle(audio);
      });
    }
  },
  timeLineStyle: (audioElement) => {
    const value = (audioElement.currentTime / audioElement.duration) * 100;

    return (
      "linear-gradient(to right, #ffffff 0%, #ffffff " +
      value +
      "%, #80808096 " +
      value +
      "%, #80808096 100%)"
    );
  },
  formatMetric: (num) => {
    if (num < 1000) return num.toString();

    const units = ["", "K", "M", "B", "T"];
    let unitIndex = 0;

    while (num >= 1000 && unitIndex < units.length - 1) {
      num /= 1000;
      unitIndex++;
    }

    return num.toFixed(1).replace(/\.0$/, "") + units[unitIndex];
  },
  checkPlaylistType: (response, userId) => {
    if (response?.type == "playlist") {
      if (response.hasOwnProperty("userId") && response.userId.length > 0) {
        return response.userId.filter((item) => item != "viewOnly").length > 1
          ? "collab"
          : response.userId.length == 1 &&
            response.userId[0] == userId &&
            response.id == userId
          ? "liked"
          : "private";
      }
    }
    return response.type;
  },
};

export default utils;
