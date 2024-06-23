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
  const [selectedAISetting, setSelectedAISetting] = useState('');
  const [aiSettings, setAISettings] = useState([]); 
  const [selectedVoiceSetting, setSelectedVoiceSetting] = useState([]);

  const [audioFiles, setAudioFiles] = useState([]);
  const audioRef = useRef(null);
  
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  
  const socketRef = useRef(null);
  const endEvent = useRef(false);
  const timeupdateEvent = useRef(false);
  const voiceSettings = [`sally`,`erin`,`kristy`, `emily`,`lindsey`,`monica`,`Bwyneth`,`carly`];

  useEffect(() => {
    deviceNameRef.current = deviceName
    console.log("deviceName")
    console.log(deviceNameRef.current)
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
    window.removeEventListener('beforeunload', handleBeforeUnload);
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
      if (updatedDeviceName === deviceNameRef.current) {
        setAudioFiles((prevFiles) => {
          if(prevFiles[0]){
            const token = localStorage.getItem('token');
            axios.delete(`${API_BASE_URL}/api/phone/audio/${deviceNameRef.current}/${prevFiles[0]}`, {
              headers: { 'x-auth-token': token }
            })
            .then(() => {
              console.log('Deleted audio file:', prevFiles[0]);
            })
            .catch(error => {
              console.error('Error deleting audio file:', error);
            });
          }
          setCurrentAudioIndex(0);
          return [newFile];
        });
      }
    });

    const fetchAISettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/ai-settings`, {
          headers: { 'x-auth-token': token }
        });
        setAISettings(response.data);
      } catch (error) {
        console.error('Error fetching AI settings:', error);
      }
    };
    fetchAISettings();

    return async() => {

      socketRef.current.disconnect();
      handleBeforeUnload();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/phone/activate`,
        { deviceName, tiktokUsername, aiSettingId: selectedAISetting, selectedVoiceSetting},
        { headers: { 'x-auth-token': token } }
      );

      socketRef.current.emit('registerDevice', socketRef.current.id, deviceNameRef.current);

      setIsLoading(false);
      setIsSubmitted(true);

      audioRef.current.src = require('./default_start.mp3');
      audioRef.current.load();
      audioRef.current.pause();
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      timeupdateEvent.current = true;

    } catch (error) {
      setIsLoading(false);
      console.error('Error submitting form:', error);
    }
  };

  const handleAudioEnded = () => {

    audioRef.current.removeEventListener('ended', handleAudioEnded);
    endEvent.current = false;

      audioRef.current.src = require('./default.mp3');
      audioRef.current.load();
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
  };

  const handleTimeUpdate = () => {
    if (timeupdateEvent.current && audioRef.current.duration && (audioRef.current.duration - audioRef.current.currentTime <= 2)) {
      
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);  
      timeupdateEvent.current = false;

      let deviceName = deviceNameRef.current;

      console.log("Sự kiện: Audio còn 2 giây nữa sẽ kết thúc" + deviceName);

      const token = localStorage.getItem('token');
      axios.post(`${API_BASE_URL}/api/phone/voice-ai`, { deviceName }, {
        headers: { 'x-auth-token': token }
      });
      
    }
  }

  useEffect(() => {
    if (audioRef.current && audioFiles[currentAudioIndex]) {

      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);  
      timeupdateEvent.current = false;

      audioRef.current.removeEventListener('ended', handleAudioEnded);
      endEvent.current = false;

      console.log('Setting audio source to:', `${API_BASE_URL}/audio/${deviceNameRef.current}/${audioFiles[currentAudioIndex]}`);
      audioRef.current.src = `${API_BASE_URL}/audio/${deviceNameRef.current}/${audioFiles[currentAudioIndex]}`;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        // Add the timeupdate event listener after the audio starts playing
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        timeupdateEvent.current = true;
        // Add the ended event listener
        audioRef.current.addEventListener('ended', handleAudioEnded);
        endEvent.current = true;
      }).catch((error) => {
        console.error('Error playing audio:', error);
      });
      
      
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
          <div className="input-group">
            <label>Chọn Sản Phẩm:</label>
            <select
              className="form-control"
              value={selectedAISetting}
              onChange={(e) => setSelectedAISetting(e.target.value)}
              required
            >
              <option value="">Chọn Sản Phẩm</option>
              {aiSettings.map((setting) => (
                <option key={setting._id} value={setting._id}>{setting.productName}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Cài Đặt Voice:</label>
            <select
              className="form-control"
              value={selectedVoiceSetting}
              onChange={(e) => setSelectedVoiceSetting(e.target.value)}
              required
            >
              <option value="">Chọn AI Voice</option>
              {voiceSettings.map((setting) => (
                <option key={setting} value={setting}>{setting.toUpperCase()}</option>
              ))}
            </select>
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
