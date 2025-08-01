import axios from "axios";
import { showToast } from "./src/pages/components/showToast";
import { Vibrant } from "node-vibrant/browser";

const apiUrl = import.meta.env.VITE_API;
const backendUrl = import.meta.env.VITE_BACKEND;

const activeDownloads = new Set();

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
      Vibrant.from(imageUrl)
        .getPalette()
        .then((palette) => {
          const color = palette.DarkVibrant;
          if (color) {
            const [r, g, b] = color.rgb;
            resolve(
              `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`
            );
          } else {
            resolve("#f5deb3"); // fallback if DarkVibrant is not found
          }
        })
        .catch(() => {
          resolve("#f5deb3"); // handle error case
        });
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
    const quality = localStorage.getItem("stream_quality") || "96";
    return plaintext.replace("_96.mp4", `_${quality}.mp4`);
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
  timeLineStyleReel: (audioElement, displayDuration, offset = 0) => {
    const played = audioElement.currentTime - offset;
    const value = (played / displayDuration) * 100;

    return (
      "linear-gradient(to right, #ffffff 0%, #ffffff " +
      value +
      "%, #ffffff80 " +
      value +
      "%, #ffffff80 100%)"
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
  getUserHomeGreeting: (username = "") => {
    const hour = new Date().getHours();
    let timeGreeting = "Hello";

    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 18) timeGreeting = "Good afternoon";
    else timeGreeting = "Good evening";

    const messages = [
      "Time to find your vibe.",
      "Let’s discover your sound.",
      "Start your music journey.",
      "Press play and explore.",
      "Your soundtrack starts here.",
      "Tunes waiting for you.",
      "Pick your first favorite.",
      "Let the music begin.",
    ];

    const vibeText = messages[Math.floor(Math.random() * messages.length)];

    return {
      greeting: `${timeGreeting}, ${username}`,
      vibeText: vibeText,
    };
  },
  stickerUrl: (sticker, id) => {
    return `https://cdn.jsdelivr.net/gh/mahesh548/hth-beats-stickers/${sticker}/${sticker}_${id}.gif `;
  },
  longAgoText: (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ago`;
  },
  downloadThis: async (url, title, batch = false) => {
    const downloadPermission = window.checkDownloadAccess();
    if (!downloadPermission) return;
    const audioUrl = utils.decryptor(url);
    const streamQuality = localStorage.getItem("stream_quality") || "96";
    const downloadQuality = localStorage.getItem("download_quality") || "96";
    const qualityUrl = audioUrl.replace(
      `_${streamQuality}.mp4`,
      `_${downloadQuality}.mp4`
    );

    // Skip download if already in progress
    if (activeDownloads.has(qualityUrl)) {
      if (!batch) showToast({ text: "Already downloading..." });
      return { status: false, file: title };
    }

    // Add to active downloads set
    activeDownloads.add(qualityUrl);

    // If not a batch download, show toast that download is starting
    if (!batch) showToast({ text: "Starting download..." });

    try {
      const response = await fetch(qualityUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Create and click an anchor tag to start download
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${
        utils.refineText(title) || "song"
      } (${downloadQuality}kbps) from HTh-Beats.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      // If it's not a batch download, show the completion toast
      if (!batch) showToast({ text: `Downloaded ${title}` });

      // Delay for 2 second before next download
      return { status: true, file: title };
    } catch (err) {
      // If it's not a batch download, show the error toast
      if (!batch) showToast({ text: "Failed to download" });
      return { status: false, file: title };
    } finally {
      activeDownloads.delete(qualityUrl); // Clean up active download set
    }
  },
  batchDownload: async (songs) => {
    const downloadPermission = window.checkDownloadAccess();
    if (!downloadPermission) return;

    let completed = 0;

    showToast({
      text: `Starting downloads...`,
    });

    for (let i = 0; i < songs.length; i++) {
      const { url, title } = songs[i];

      try {
        const result = await utils.downloadThis(url, title, true);

        if (result.status === true) {
          completed++;
        }

        showToast({
          text: `Downloaded ${completed}/${songs.length} songs`,
        });
      } catch (error) {
        showToast({
          text: `Failed to download ${title}`,
        });
      }
      await new Promise((resolve) => setTimeout(() => resolve(), 3000));
    }
  },

  editMeta: (title = "", theme = "") => {
    if (title.length > 0) {
      document.getElementsByTagName("title")[0].innerText = title;
    }
    if (theme.length > 0) {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", theme);
      }
    }
  },
};

export default utils;
