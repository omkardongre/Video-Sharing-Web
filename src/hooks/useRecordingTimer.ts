import { useState, useRef } from "react";

export const useRecordingTimer = () => {
  const [timer, setTimer] = useState(0);
  const timerInterval = useRef<NodeJS.Timeout>();

  const startTimer = () => {
    timerInterval.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    setTimer(0);
  };

  return {
    timer,
    timerInterval,
    startTimer,
    stopTimer,
  };
};
