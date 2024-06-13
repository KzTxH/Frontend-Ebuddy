import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './Phone.css';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const Phone = () => {
  const [deviceName, setDeviceName] = useState('');
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');

  const audioRef = useRef(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [socket, setSocket] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/phone/activate`,
        { deviceName, tiktokUsername },
        { headers: { 'x-auth-token': token } }
      );
      setIsLoading(false);
      setIsSubmitted(true);
      setStreamUrl(response.data.streamUrl);
      console.log('Server Response:', response.data);

      // Open Radio Broadcast after receiving server response
      const newSocket = io(API_BASE_URL);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('getAudioFiles', deviceName);
      });

      newSocket.on('audioFiles', (files) => {
        console.log('Received audio files:', files);
        if (files.length > 0) {
          setAudioFiles(files);
          setCurrentAudioIndex(0);
        } else {
          console.warn('No audio files found for the device');
        }
      });

      newSocket.on('updateAudioFiles', ({ deviceName: updatedDeviceName, files }) => {
        console.log('Updated audio files:', files);
        if (updatedDeviceName === deviceName) {
          setAudioFiles(files);
          setCurrentAudioIndex(files.length - 1);
        }
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      return () => {
        newSocket.disconnect();
      };
    } catch (error) {
      setIsLoading(false);
      console.error('Error submitting form:', error);
    }
  };

  const handleAudioEnded = useCallback(() => {
    const nextIndex = currentAudioIndex + 1;
    if (nextIndex < audioFiles.length) {
      setCurrentAudioIndex(nextIndex);
    } else {
      setCurrentAudioIndex(0); // Reset to the first file if we reach the end
    }
  }, [currentAudioIndex, audioFiles]);

  useEffect(() => {
    if (audioRef.current && audioFiles[currentAudioIndex]) {
      const audioSrc = `${API_BASE_URL}/audio/${deviceName}/${audioFiles[currentAudioIndex]}`;
      console.log('Setting audio source to:', audioSrc);
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  }, [currentAudioIndex, audioFiles, deviceName]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnded);
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [handleAudioEnded]);

  useEffect(() => {
    const handleUnload = (event) => {
      // This function runs when the component is unmounted or the page is reloaded/navigated away from
      const deactivateDevice = async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            `${API_BASE_URL}/api/phone/deactivate`,
            { deviceName },
            { headers: { 'x-auth-token': token } }
          );
          console.log('Device deactivated');
        } catch (error) {
          console.error('Error deactivating device:', error);
        }
      };

      if (isSubmitted) {
        deactivateDevice();
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [deviceName, isSubmitted]);

  return (
    <div className="phone-container">
      {!isSubmitted ? (
        <form className="phone-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Tên Máy:</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Tên Tài Khoản Tiktok:</label>
            <input
              type="text"
              value={tiktokUsername}
              onChange={(e) => setTiktokUsername(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang gửi...' : 'Gửi'}
          </button>
        </form>
      ) : (
        <div className="radio-broadcast">
          <p>Radio Broadcast đang phát...</p>
          <audio ref={audioRef} controls autoPlay>
            <source src={audioFiles[currentAudioIndex] ? `${API_BASE_URL}/audio/${deviceName}/${audioFiles[currentAudioIndex]}` : ''} type="audio/mpeg" />
            Trình duyệt của bạn không hỗ trợ thẻ audio.
          </audio>
        </div>
      )}
    </div>
  );
};

export default Phone;
