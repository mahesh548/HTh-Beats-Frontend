import { useContext, useEffect, useCallback, useState, useRef } from "react";
import { songContext } from "./Song";
import utils from "../../../utils";
import { channelContext } from "./Channel";

const frequencies = [60, 180, 400, 1000, 3000, 6000, 12000];

export default function Audio() {
  const { Queue, setQueue } = useContext(songContext);
  const { channel, currentSong, roomInfo } = useContext(channelContext);
  const audioCtxRef = useRef(null);
  const filtersRef = useRef([]);
  const sourceRef = useRef(null);

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
  useEffect(() => {
    const audio = document.getElementById("audio");
    if (!audio) return;

    const setupEQ = () => {
      if (!audio.captureStream || Queue?.effect === "none") return;

      try {
        const stream = audio.captureStream();

        if (stream.getAudioTracks().length === 0) {
          console.warn("No audio tracks found in the stream");
          return;
        }

        // Create or reuse AudioContext
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }
        const audioCtx = audioCtxRef.current;

        // 🔁 Clean up previous connections
        if (filtersRef.current?.length) {
          filtersRef.current.forEach((filter) => filter.disconnect());
        }
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }

        // 🔄 Always create new MediaStreamSource for new stream
        sourceRef.current = audioCtx.createMediaStreamSource(stream);
        const source = sourceRef.current;

        // Create fresh filters
        const filters = frequencies.map((freq) => {
          const filter = audioCtx.createBiquadFilter();
          filter.type = "peaking";
          filter.frequency.value = freq;
          filter.Q.value = 1;
          filter.gain.value = Queue?.effect?.[freq] || 0;
          return filter;
        });

        filtersRef.current = filters;

        // Connect filter chain
        let node = source;
        filters.forEach((filter) => {
          node.connect(filter);
          node = filter;
        });
        node.connect(audioCtx.destination);

        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }

        audio.muted = true;
      } catch (err) {
        console.error("Audio EQ setup error:", err);
        audio.muted = false;
      }
    };

    audio.addEventListener("loadeddata", setupEQ);

    return () => {
      audio.removeEventListener("loadeddata", setupEQ);

      // Optional: clean up on unmount
      if (filtersRef.current?.length) {
        filtersRef.current.forEach((filter) => filter.disconnect());
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
    };
  }, [Queue?.effect, Queue?.song]); // ✅ Depend on song and EQ profile

  useEffect(() => {
    filtersRef.current.forEach((filter) => {
      const freq = filter.frequency.value;
      filter.gain.value = Queue?.effect?.[freq] || 0;
    });
  }, [Queue?.effect]);

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
