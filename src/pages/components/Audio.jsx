import { useContext, useEffect, useCallback, useState, useRef } from "react";
import { songContext } from "./Song";
import utils from "../../../utils";
import { channelContext } from "./Channel";

const frequencies = [60, 150, 400, 1000, 2400, 15000];

function Preamp(bandValues) {
  const maxGain = Math.max(...bandValues);
  const preampDb = -maxGain;
  const linearGain = Math.pow(10, preampDb / 20);
  return linearGain;
}

export default function Audio() {
  const { Queue, setQueue } = useContext(songContext);
  const { channel, currentSong, roomInfo } = useContext(channelContext);
  const audioCtxRef = useRef(null);
  const filtersRef = useRef([]);
  const sourceRef = useRef(null);
  const fxNodeRef = useRef(null);
  const gainNodeRef = useRef(null);

  const mediaNotification = (mediaData) => {
    if (navigator?.mediaSession) {
      const defaultArtwork = `https://res.cloudinary.com/dzjflzbxz/image/upload/v1748345555/logo_s03jy9.png`;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: mediaData?.title || "",
        artist: mediaData?.artist || "",
        album: mediaData?.album || "",
        artwork: [
          {
            src: mediaData?.img || defaultArtwork,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        setQueue({ type: "STATUS", value: "resume" });
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        setQueue({ type: "STATUS", value: "pause" });
      });

      navigator.mediaSession.setActionHandler("seekto", (event) => {
        document.getElementById("audio").currentTime = event.seekTime;
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        setQueue({ type: "PREV" });
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        setQueue({ type: "NEXT" });
      });

      navigator.mediaSession.setActionHandler("stop", null);
      navigator.mediaSession.setActionHandler("seekforward", null);
      navigator.mediaSession.setActionHandler("seekbackward", null);
    }
  };

  const isFlat = (effect = {}) =>
    Object.values(effect).every((gain) => gain === 0);

  useEffect(() => {
    const audio = document.getElementById("audio");
    if (!audio || !Queue?.song) return;

    const setupEQ = () => {
      const flat = isFlat(Queue.effect);
      if (flat) {
        audio.muted = false;
        return;
      }

      try {
        const stream = audio.captureStream?.();
        if (!stream || stream.getAudioTracks().length === 0) {
          console.warn("No audio tracks found");
          return;
        }

        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }

        const audioCtx = audioCtxRef.current;

        // Disconnect previous nodes
        filtersRef.current?.forEach((filter) => filter.disconnect());
        sourceRef.current?.disconnect();
        fxNodeRef.current?.disconnect();

        // Setup source
        const source = audioCtx.createMediaStreamSource(stream);
        sourceRef.current = source;

        // Setup EQ filters
        const filters = frequencies.map((freq) => {
          const filter = audioCtx.createBiquadFilter();
          filter.type = "peaking";
          filter.frequency.value = freq;
          filter.Q.value = 1;
          filter.gain.value = Queue?.effect?.[freq] ?? 0;
          return filter;
        });
        filtersRef.current = filters;

        // Gain
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = Preamp(Object.values(Queue.effect));
        console.log("preamp is", Preamp(Object.values(Queue.effect)));
        gainNodeRef.current = gainNode;

        // Chain setup
        let node = source;
        filters.forEach((filter) => {
          node.connect(filter);
          node = filter;
        });

        if (fxNodeRef.current) {
          node.connect(fxNodeRef.current);
          node = fxNodeRef.current;
        }

        node.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }

        audio.muted = true;
      } catch (err) {
        console.error("EQ setup error:", err);
        audio.muted = false;
      }
    };

    audio.addEventListener("loadeddata", setupEQ);

    return () => {
      audio.removeEventListener("loadeddata", setupEQ);
      filtersRef.current?.forEach((f) => f.disconnect());
      sourceRef.current?.disconnect();
      fxNodeRef.current?.disconnect();
      filtersRef.current = [];
      sourceRef.current = null;

      if (audioCtxRef.current && !isFlat(Queue.effect)) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }

      audio.muted = false;
    };
  }, [Queue?.song]);

  useEffect(() => {
    const audio = document.getElementById("audio");
    if (!audio || !Queue?.effect) return;

    const flat = isFlat(Queue.effect);

    if (flat) {
      filtersRef.current?.forEach((f) => f.disconnect());
      sourceRef.current?.disconnect();
      fxNodeRef.current?.disconnect();

      filtersRef.current = [];
      sourceRef.current = null;
      fxNodeRef.current = null;

      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }

      audio.muted = false;
      return;
    }

    if (!audioCtxRef.current) {
      const stream = audio.captureStream?.();
      if (!stream || stream.getAudioTracks().length === 0) return;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const filters = frequencies.map((freq) => {
        const filter = audioCtx.createBiquadFilter();
        filter.type = "peaking";
        filter.frequency.value = freq;
        filter.Q.value = 1;
        filter.gain.value = Queue?.effect?.[freq] ?? 0;
        return filter;
      });
      filtersRef.current = filters;

      const gainNode = audioCtx.createGain();
      gainNode.gain.value = Preamp(Object.values(Queue.effect));
      console.log("preamp is", Preamp(Object.values(Queue.effect)));
      gainNodeRef.current = gainNode;

      let node = source;
      filters.forEach((filter) => {
        node.connect(filter);
        node = filter;
      });

      if (fxNodeRef.current) {
        node.connect(fxNodeRef.current);
        node = fxNodeRef.current;
      }

      node.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      audio.muted = true;
    } else {
      filtersRef.current.forEach((filter) => {
        const freq = filter.frequency.value.toString();
        const gain = Queue.effect[freq] ?? 0;
        try {
          filter.gain.value = gain;
          gainNodeRef.current.gain.value = Preamp(Object.values(Queue.effect));
          console.log("new preamp value", Preamp(Object.values(Queue.effect)));
        } catch (err) {
          console.error(`Gain set failed for ${freq}:`, err);
        }
      });
    }
  }, [Queue?.effect]);

  useEffect(() => {
    console.log("Applying FX:", Queue?.fx);

    const audio = document.getElementById("audio");
    if (!audio || !Queue?.fx || Queue.fx === "none") return;

    // ⚡ Create AudioContext if EQ is flat and there's no context yet
    const isEQFlat = isFlat(Queue.effect);
    const audioCtx = audioCtxRef.current || new AudioContext();

    if (!audioCtxRef.current) {
      try {
        const stream = audio.captureStream?.();
        if (!stream || stream.getAudioTracks().length === 0) return;

        audioCtxRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        sourceRef.current = source;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.8;

        let node = source;

        // No EQ applied, directly go to FX
        if (fxNodeRef.current) {
          node.connect(fxNodeRef.current);
          node = fxNodeRef.current;
        }

        node.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (audioCtx.state === "suspended") audioCtx.resume();

        audio.muted = true;
      } catch (err) {
        console.error("AudioContext setup for FX failed:", err);
        audio.muted = false;
        return;
      }
    }

    // 🧠 Always use current context from here
    const ctx = audioCtxRef.current;
    const lastNode =
      filtersRef.current?.length && !isEQFlat
        ? filtersRef.current.at(-1)
        : sourceRef.current;

    if (!lastNode) return;

    // 🧹 Clean up old FX
    if (fxNodeRef.current) {
      try {
        fxNodeRef.current.disconnect();
      } catch (err) {
        console.warn("Previous FX node disconnect failed:", err);
      }
      if (fxNodeRef.current._interval)
        clearInterval(fxNodeRef.current._interval);
    }

    let newFxNode = null;

    switch (Queue?.fx) {
      case "8d": {
        const panner = ctx.createPanner();
        panner.panningModel = "HRTF";
        panner.distanceModel = "inverse";
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;

        ctx.listener.setPosition(0, 0, 0);

        let angle = 0;
        const radius = 1;

        const interval = setInterval(() => {
          const x = radius * Math.cos(angle); // left/right
          const z = radius * Math.sin(angle); // front/back
          panner.setPosition(x, 0, z);

          angle += 0.03;
          if (angle >= 2 * Math.PI) {
            angle = 0; // Reset after full circle
          }
        }, 50);

        panner._interval = interval;
        newFxNode = panner;
        break;
      }

      case "slowreverb": {
        audio.playbackRate = 0.85;

        const convolver = ctx.createConvolver();

        fetch(
          "https://res.cloudinary.com/dzjflzbxz/video/upload/v1750844914/vocal_ghsdz4.wav"
        )
          .then((r) => r.arrayBuffer())
          .then((d) => ctx.decodeAudioData(d))
          .then((buffer) => {
            convolver.buffer = buffer;
          })
          .catch(console.error);
        const preDelay = ctx.createDelay();
        preDelay.delayTime.value = 0.05;

        const highShelf = ctx.createBiquadFilter();
        highShelf.type = "highshelf";
        highShelf.frequency.value = 3000;
        highShelf.gain.value = 1.5;

        newFxNode = preDelay;
        preDelay.connect(convolver);
        convolver.connect(highShelf);
        highShelf.connect(ctx.destination);
        break;
      }

      default:
        audio.playbackRate = 1;
        break;
    }

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.8;

    try {
      lastNode.disconnect();

      if (newFxNode) {
        lastNode.connect(newFxNode);
        newFxNode.connect(gainNode);
        fxNodeRef.current = newFxNode;
      } else {
        lastNode.connect(gainNode);
        fxNodeRef.current = null;
      }

      gainNode.connect(ctx.destination);
    } catch (err) {
      console.error("FX connection error:", err);
    }

    return () => {
      if (fxNodeRef.current) {
        audio.playbackRate = 1;
        try {
          fxNodeRef.current.disconnect();
        } catch {}
        if (fxNodeRef.current._interval)
          clearInterval(fxNodeRef.current._interval);
      }
    };
  }, [Queue?.fx]);

  useEffect(() => {
    const play = () => {
      const audio = document.getElementById("audio");
      const song = utils.getItemFromId(Queue.song, Queue.playlist.list);
      audio.src = utils.decryptor(song.more_info.encrypted_media_url);
      audio.play();

      mediaNotification({
        title: utils.refineText(song?.title || ""),
        artist: utils.refineText(song?.subtitle || ""),
        img: song.image.replace("150x150", "500x500"),
      });
    };

    const pause = () => {
      const audio = document.getElementById("audio");
      audio.pause();
    };
    const resume = () => {
      const audio = document.getElementById("audio");
      audio.play();
    };
    if (Queue.status == "play") {
      play();
    }

    if (Queue.status == "pause") {
      pause();
    }
    if (Queue.status == "resume") {
      resume();
    }
  }, [Queue?.status, Queue?.song]);

  const ended = useCallback(() => {
    if (
      channel &&
      currentSong &&
      roomInfo &&
      currentSong.clientId !== roomInfo.clientId
    )
      return;
    const repeatOne = JSON.parse(localStorage.getItem("repeat")) || false;
    if (repeatOne) {
      document.getElementById("audio").currentTime = 0;
      const audio = document.getElementById("audio");
      audio.play();
    } else {
      setQueue({ type: "NEXT" });
    }
  }, [channel, currentSong, roomInfo, setQueue]);

  return (
    <audio
      src=""
      controls
      autoPlay={false}
      style={{ display: "none" }}
      id="audio"
      crossOrigin="anonymous"
      onTimeUpdate={utils.timelineUpdater}
      onEnded={() => ended()}
    ></audio>
  );
}
