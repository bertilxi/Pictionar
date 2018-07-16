import { addClass, removeClass } from "./utils";

let start = 0;
let end = 0;
let diff = 0;
let timerID = 0;

export const chronoStop = () => {
  clearTimeout(timerID);
  timerID = 0;
};

export const chrono = () => {
  end = new Date();
  diff = end - start;
  diff = new Date(diff);

  let msec = diff.getMilliseconds();
  let sec = diff.getSeconds();
  const timesUp = diff.getMinutes() >= 1;

  if (diff.getMinutes() >= 1) sec += diff.getMinutes() * 60;
  if (sec < 10) sec = "0" + sec;
  if (msec < 10) msec = "00" + msec;
  else if (msec < 100) msec = "0" + msec;

  document.getElementById("tiempo").innerHTML = sec + ":" + msec;

  if (timesUp) {
    chronoStop();
    document.getElementById("btnPalabraNoAdivinada").disabled = false;
    addClass(document.getElementById("tiempo"), "timesUp");
  } else timerID = setTimeout(chrono, 10);
};

export const chronoStart = () => {
  removeClass(document.getElementById("tiempo"), "timesUp");
  document.getElementById("tiempo").innerHTML = "00:000";
  start = new Date();
  chrono();
};
