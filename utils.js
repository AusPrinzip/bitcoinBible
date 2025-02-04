import { spawn } from 'child_process';

export function wait(ms) {
	return new Promise(resolve => {
		setTimeout(() => {
			return resolve()
		}, ms)
	})
}


const videoUrl = "https://www.youtube.com/watch?v=1UJGjEKC1GI&autoplay=1&mute=1";

// Determine the platform and appropriate command
export const alertHuman = () => {
  const platform = process.platform;

  if (platform === 'win32') {
    // Windows: Use "start"
    spawn('cmd', ['/c', 'start', videoUrl]);
  } else if (platform === 'darwin') {
    // macOS: Use "open"
    spawn('open', [videoUrl]);
  } else {
    // Linux: Use "xdg-open"
    spawn('xdg-open', [videoUrl]);
  }
};

export const hasRepeatedChars = (str, n) => new RegExp(`(.)\\1{${n-1}}`).test(str);

export const hasRepeatedElement = (arr, n) => Object.values(arr.reduce((acc, str) => ({ ...acc, [str]: (acc[str] || 0) + 1 }), {})).some(count => count > n);
