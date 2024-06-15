/* eslint-env worker */
import { io } from 'socket.io-client';

const API_BASE_URL = 'http://192.168.1.26:3002';
const socket = io(API_BASE_URL);

socket.on('connect', () => {
  console.log('Worker: Connected to server');
  postMessage({ type: 'status', status: 'connected' });
});

socket.on('disconnect', (reason) => {
  console.log(`Worker: Disconnected: ${reason}`);
  postMessage({ type: 'status', status: 'disconnected' });
});

socket.on('audioFiles', (files) => {
  postMessage({ type: 'audioFiles', files });
});

socket.on('updateAudioFiles', ({ deviceName, files }) => {
  postMessage({ type: 'updateAudioFiles', deviceName, files });
});

onmessage = (e) => {
  if (e.data.type === 'getAudioFiles') {
    socket.emit('getAudioFiles', e.data.deviceName);
  }
};
