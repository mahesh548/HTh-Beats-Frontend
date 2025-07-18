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
  const volNodeRef = useRef(null);

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

  const setupEQ = () => {
    const audio = document.getElementById("audio");
    const flat = isFlat(Queue.effect);

    if (flat) {
      audio.muted = false;
      if (Queue?.fx !== "none") addEffect(Queue?.fx);
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
      volNodeRef.current?.disconnect();

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
      gainNodeRef.current = gainNode;

      // 🎯 New Volume Node (added at end)
      const volumeNode = audioCtx.createGain();
      const storedVol = parseFloat(localStorage.getItem("volume"));
      volumeNode.gain.value = isNaN(storedVol) ? 1 : storedVol;
      volNodeRef.current = volumeNode;

      // Chain setup
      let node = source;
      filters.forEach((filter) => {
        node.connect(filter);
        node = filter;
      });

      node.connect(gainNode);
      gainNode.connect(volumeNode); // connect to volume node
      volumeNode.connect(audioCtx.destination); // final output

      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      audio.muted = true;
    } catch (err) {
      console.error("EQ setup error:", err);
      audio.muted = false;
    }
  };

  useEffect(() => {
    const audio = document.getElementById("audio");
    if (!audio || !Queue?.song) return;

    setupEQ();

    audio.addEventListener("loadeddata", setupEQ);

    return () => {
      audio.removeEventListener("loadeddata", setupEQ);
      filtersRef.current?.forEach((f) => f.disconnect());
      sourceRef.current?.disconnect();
      fxNodeRef.current?.disconnect();
      volNodeRef.current?.disconnect();
      filtersRef.current = [];
      sourceRef.current = null;
      volNodeRef.current = null;

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
      volNodeRef.current?.disconnect();

      filtersRef.current = [];
      sourceRef.current = null;
      fxNodeRef.current = null;
      volNodeRef.current = null;

      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }

      audio.muted = false;
      audio.playbackRate = 1;

      if (!audio || !Queue?.fx || Queue.fx === "none") return;
      addEffect(Queue?.fx);
      return;
    }
    if (fxNodeRef.current) {
      try {
        // Disconnect current FX node
        fxNodeRef.current.disconnect();

        // Reconnect filter end directly to gain → volume → destination
        filtersRef.current?.[filtersRef.current.length - 1]?.connect(
          gainNodeRef.current
        );

        // 🧠 Make sure gainNode is connected to volumeNode (if not already)
        gainNodeRef.current?.disconnect();
        gainNodeRef.current?.connect(volNodeRef.current);

        // ⚠️ DO NOT connect volumeNode to destination here — that’s already done in setup

        // Clear the ref
        fxNodeRef.current = null;
      } catch (err) {
        console.error("Error while disconnecting FX:", err);
      }
    }

    audio.playbackRate = 1;

    if (!audioCtxRef.current) {
      setupEQ();
    } else {
      filtersRef.current.forEach((filter) => {
        const freq = filter.frequency.value.toString();
        const gain = Queue.effect[freq] ?? 0;
        try {
          filter.gain.value = gain;
          gainNodeRef.current.gain.value = Preamp(Object.values(Queue.effect));
        } catch (err) {
          console.error(`Gain set failed for ${freq}:`, err);
        }
      });
    }
  }, [Queue?.effect, Queue.fx]);

  const addEffect = (fx) => {
    const audio = document.getElementById("audio");
    try {
      const stream = audio.captureStream?.();
      if (!stream || stream.getAudioTracks().length === 0) return;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      if (audioCtx.state === "suspended") audioCtx.resume();
      audio.muted = true;

      const ctx = audioCtxRef.current;

      // Create gain node
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.8;
      gainNodeRef.current = gainNode;

      // 🎯 Create volume node
      const volumeNode = ctx.createGain();
      const storedVol = parseFloat(localStorage.getItem("volume"));
      volumeNode.gain.value = isNaN(storedVol) ? 1 : storedVol;
      volNodeRef.current = volumeNode;

      // Setup EQ filters
      const filters = frequencies.map((freq) => {
        const filter = ctx.createBiquadFilter();
        filter.type = "peaking";
        filter.frequency.value = freq;
        filter.Q.value = 1;
        filter.gain.value = Queue?.effect?.[freq] ?? 0;
        return filter;
      });
      filtersRef.current = filters;

      // Chain EQ filters
      let filterChainStart = filters[0];
      let filterChainEnd = filters[filters.length - 1];
      filters.reduce((prev, curr) => {
        prev.connect(curr);
        return curr;
      });

      let newFxNode = null;

      switch (fx) {
        case "8d": {
          audio.playbackRate = 1;

          const panner = ctx.createPanner();
          panner.panningModel = "HRTF";
          panner.distanceModel = "inverse";
          panner.refDistance = 1;

          ctx.listener.setPosition(0, 0, 0);

          let angle = 0;
          const radius = 1;
          const interval = setInterval(() => {
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            panner.setPosition(x, 0, z);
            angle += 0.03;
            if (angle >= 2 * Math.PI) angle = 0;
          }, 50);

          panner._interval = interval;
          newFxNode = panner;
          break;
        }

        case "slowreverb": {
          audio.playbackRate = 0.85;

          const convolver = ctx.createConvolver();
          const preDelay = ctx.createDelay();
          preDelay.delayTime.value = 0.05;

          const highShelf = ctx.createBiquadFilter();
          highShelf.type = "highshelf";
          highShelf.frequency.value = 3000;
          highShelf.gain.value = 1.5;

          const reverbInput = preDelay;
          const reverbOutput = ctx.createGain();

          preDelay.connect(convolver);
          convolver.connect(highShelf);
          highShelf.connect(reverbOutput);

          fetch(
            "https://res.cloudinary.com/dzjflzbxz/video/upload/v1750844914/vocal_ghsdz4.wav"
          )
            .then((r) => r.arrayBuffer())
            .then((d) => ctx.decodeAudioData(d))
            .then((buffer) => {
              convolver.buffer = buffer;

              source.connect(filterChainStart);
              filterChainEnd.connect(reverbInput);
              reverbOutput.connect(gainNode);
              gainNode.connect(volumeNode); // 🧠 connect gain → volume
              volumeNode.connect(ctx.destination); // 🎯 volume is final output

              fxNodeRef.current = reverbInput;
            })
            .catch(console.error);

          return;
        }
      }

      // Final connection (for "8d" or no FX): filters → [fx?] → gain → volume → destination
      source.connect(filterChainStart);
      if (newFxNode) {
        filterChainEnd.connect(newFxNode);
        newFxNode.connect(gainNode);
      } else {
        filterChainEnd.connect(gainNode);
      }

      gainNode.connect(volumeNode); // 🧠 gain → volume
      volumeNode.connect(ctx.destination); // 🎯 final output

      fxNodeRef.current = newFxNode;
    } catch (error) {
      audio.muted = false;
      console.log("error creating audio context: ", error);
    }
  };

  useEffect(() => {
    if (typeof Queue?.volume !== "number") return;
    const audio = document.getElementById("audio");

    const volumeValue = Queue.volume;
    audio.volume = volumeValue;

    // Update volume node if it exists
    if (volNodeRef.current) {
      volNodeRef.current.gain.setValueAtTime(
        volumeValue,
        volNodeRef.current.context.currentTime
      );
    }
  }, [Queue?.volume]);

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
      setupEQ();
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
