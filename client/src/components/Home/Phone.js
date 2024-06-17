import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './Phone.css';
import config from '../../config';

import myAudioFile from './default.mp3';

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
    console.log(deviceName)
  },[deviceName])

  const handleBeforeUnload = async() => {
    if(deviceNameRef.current){
      try {
        const token = localStorage.getItem('token');
        console.log()
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
      console.log(updatedDeviceName)
      console.log(deviceName)
      console.log(deviceNameRef.current)
      if (updatedDeviceName === deviceNameRef.current) {
        
        setAudioFiles((prevFiles) => {
          const updatedFiles = [...prevFiles, newFile];
          setCurrentAudioIndex(0); // Set index to the newly added file
          return [newFile];
        });
      }
    });

    // socketRef.current.on('deleteAudioFile', ({ deviceName: updatedDeviceName, newFile }) => {
    //   if (updatedDeviceName === deviceName) {
    //     setAudioFiles((prevFiles) => prevFiles.filter(file => file !== newFile));
    //     if (currentAudioIndex >= audioFiles.length) {
    //       setCurrentAudioIndex(0); // Reset to the first file if the current index is out of bounds
    //     }
    //   }
    // });

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
    console.log("hello")
    // const nextIndex = currentAudioIndex + 1;
    // if (nextIndex < audioFiles.length) {
    //   setCurrentAudioIndex(nextIndex);
    // } else {
      setCurrentAudioIndex(1);
    //   // chạy file tại client không có tiếng.myAudioFile
      audioRef.current.src = require('./default.mp3');
      audioRef.current.load();
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    // }

    // const currentFile = audioFiles[currentAudioIndex];
    // if (currentFile) {
      const token = localStorage.getItem('token');
    //   axios.delete(`${API_BASE_URL}/api/phone/audio/${deviceName}/${currentFile}`, {
    //     headers: { 'x-auth-token': token }
    //   })
    //   .then(() => {
        // console.log('Deleted audio file:', currentFile);
        axios.post(`${API_BASE_URL}/api/phone/voice-ai`, { deviceName }, {
          headers: { 'x-auth-token': token }
        });
      // })
      // .catch(error => {
      //   console.error('Error deleting audio file:', error);
      // });
    // }
  };

  useEffect(() => {

    if (audioRef.current && audioFiles[currentAudioIndex]) {
      console.log('Setting audio source to:', `${API_BASE_URL}/audio/${deviceName}/${audioFiles[currentAudioIndex]}`);
      audioRef.current.src = `${API_BASE_URL}/audio/${deviceName}/${audioFiles[currentAudioIndex]}`;
      audioRef.current.load();
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
      console.log("adddđ")
      audioRef.current.addEventListener('ended', handleAudioEnded);
      return () => {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      };
    }
  }, [audioFiles]);

  // useEffect(() => {
  //   const audioElement = audioRef.current;
  //   if (audioElement) {
  //     audioElement.addEventListener('ended', handleAudioEnded);
  //   }
  //   return () => {
  //     if (audioElement) {
  //       audioElement.removeEventListener('ended', handleAudioEnded);
  //     }
  //   };
  // }, [audioFiles]);

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
