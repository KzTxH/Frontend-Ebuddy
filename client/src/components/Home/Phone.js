import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './Phone.css';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const Phone = () => {
  const [deviceName, setDeviceName] = useState('');
  const deviceNameRef = useRef(deviceName);
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [audioFiles, setAudioFiles] = useState([]);
  const audioRef = useRef(null);
  
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  
  const socketRef = useRef(null);


  useEffect(() => {
    deviceNameRef.current = deviceName
    console.log("deviceName")
  },[deviceName])

  const handleBeforeUnload = async() => {
    if(deviceNameRef.current){
      try {
        const token = localStorage.getItem('token');
        const deviceName = deviceNameRef.current;
        await axios.post(
          `${API_BASE_URL}/api/phone/deactivate`,
          { deviceName },
          { headers: { 'x-auth-token': token } }
        );
      } catch (error) {
        console.error('Error deactivating device:', error);
      }
    }
  }

  useEffect(() => {

    window.addEventListener('beforeunload', handleBeforeUnload);

    const socket = io(API_BASE_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
    socketRef.current = socket;

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`);

    });

    socketRef.current.on('newAudioFile', ({ deviceName: updatedDeviceName, newFile }) => {
      console.log("newAudioFile")
      if (updatedDeviceName === deviceNameRef.current) {
        setAudioFiles((prevFiles) => {
          setCurrentAudioIndex(0);
          return [newFile];
        });
      }
    });

    return async() => {

      socketRef.current.disconnect();
      window.removeEventListener('beforeunload', handleBeforeUnload);

      try {
        const token = localStorage.getItem('token');
        const deviceName = deviceNameRef.current;
        await axios.post(
          `${API_BASE_URL}/api/phone/deactivate`,
          { deviceName },
          { headers: { 'x-auth-token': token } }
        );
      } catch (error) {
        console.error('Error deactivating device:', error);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/phone/activate`,
        { deviceName, tiktokUsername },
        { headers: { 'x-auth-token': token } }
      );

      setIsLoading(false);
      setIsSubmitted(true);

    } catch (error) {
      setIsLoading(false);
      console.error('Error submitting form:', error);
    }
  };

  const handleAudioEnded = () => {
    audioRef.current.removeEventListener('ended', handleAudioEnded);
    console.log("ended")

      const token = localStorage.getItem('token');
      axios.delete(`${API_BASE_URL}/api/phone/audio/${deviceName}/${audioFiles[currentAudioIndex]}`, {
        headers: { 'x-auth-token': token }
      })
      .then(() => {
        console.log('Deleted audio file:', audioFiles[currentAudioIndex]);
      })
      .catch(error => {
        console.error('Error deleting audio file:', error);
      });

      setCurrentAudioIndex(1);
      audioRef.current.src = require('./default.mp3');
      audioRef.current.load();
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });



      axios.post(`${API_BASE_URL}/api/phone/voice-ai`, { deviceName }, {
        headers: { 'x-auth-token': token }
      });
  };

  useEffect(() => {

    if (audioRef.current && audioFiles[currentAudioIndex]) {
      console.log('Setting audio source to:', `${API_BASE_URL}/audio/${deviceName}/${audioFiles[currentAudioIndex]}`);
      audioRef.current.src = `${API_BASE_URL}/audio/${deviceName}/${audioFiles[currentAudioIndex]}`;
      audioRef.current.load();
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
      console.log("play")
      audioRef.current.addEventListener('ended', handleAudioEnded);
      return () => {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      };
    }
  }, [audioFiles]);

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
