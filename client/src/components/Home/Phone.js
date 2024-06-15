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
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

  const audioRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(API_BASE_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`);
    });

    socket.on('audioFiles', (files) => {
      setAudioFiles(files);
      if (files.length > 0) {
        setCurrentAudioIndex(0);
      }
    });

    socket.on('newAudioFile', ({ deviceName: updatedDeviceName, newFile }) => {
      if (updatedDeviceName === deviceName) {
        setAudioFiles((prevFiles) => [...prevFiles, newFile]);
        setCurrentAudioIndex((prevFiles) => prevFiles.length); // Set index to the newly added file
      }
    });

    socket.on('deleteAudioFile', ({ deviceName: updatedDeviceName, newFile }) => {
      if (updatedDeviceName === deviceName) {
        setAudioFiles((prevFiles) => prevFiles.filter(file => file !== newFile));
        if (currentAudioIndex >= audioFiles.length) {
          setCurrentAudioIndex(0); // Reset to the first file if the current index is out of bounds
        }
      }
    });

    socket.on('updateAudioFiles', ({ deviceName: updatedDeviceName, files }) => {
      if (updatedDeviceName === deviceName) {
        setAudioFiles(files);
        setCurrentAudioIndex(0); // Reset to the first file
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [deviceName]);

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

      socketRef.current.emit('getAudioFiles', deviceName);
    } catch (error) {
      setIsLoading(false);
      console.error('Error submitting form:', error);
    }
  };

  const handleDeactivate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/phone/deactivate`,
        { deviceName },
        { headers: { 'x-auth-token': token } }
      );
    } catch (error) {
      console.error('Error deactivating device:', error);
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleDeactivate);
    return () => {
      window.removeEventListener('beforeunload', handleDeactivate);
    };
  }, [deviceName]);

  const handleAudioEnded = useCallback(() => {
    const nextIndex = currentAudioIndex + 1;
    if (nextIndex < audioFiles.length) {
      setCurrentAudioIndex(nextIndex);
    } else {
      setCurrentAudioIndex(0);
      // chạy file tại client không có tiếng.
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  }, [currentAudioIndex, audioFiles]);

  useEffect(() => {
    if (audioRef.current && audioFiles[currentAudioIndex]) {
      audioRef.current.src = `${API_BASE_URL}/audio/${deviceName}/${audioFiles[currentAudioIndex]}`;
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
