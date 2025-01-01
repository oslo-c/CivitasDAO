// utils/timeUtils.js  
// import { resolve } from '../socket/index.js';

export function currentTime() {
    // Just calls timeToResolve() for the current date
    return timeToResolve(new Date());
  }
  
  export function timeToResolve(date) {
    const nextHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1, 0, 0);
    const timeDifference = nextHour.getTime() - date.getTime();
  
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
    if (seconds === 0 && minutes === 0) {
      resolve();
      return null;
    }
  
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `[Time to resolve: ${paddedMinutes}m ${paddedSeconds}s]`;
  }
  