import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { io } from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import './ActiveDevices.css';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const ActiveDevices = ({ setShowLinkModal, setSelectedDevice }) => {
  const [activeDevices, setActiveDevices] = useState([]);
  const { auth } = useContext(AuthContext);
  const socket = useRef(null);


  useEffect(() => {
    const fetchActiveDevices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/phone/active-devices`, {
          headers: { 'x-auth-token': token }
        });
        setActiveDevices(response.data);
      } catch (error) {
        console.error('Error fetching active devices:', error);
      }
    };

    fetchActiveDevices();

    socket.current = io(API_BASE_URL);
    socket.current.on('updateActiveDevices', (devices) => {
      setActiveDevices(devices);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [auth]);

  return (
    <div className="active-devices-container">
      <h2>Thiết Bị Đang Hoạt Động</h2>
      <table className="active-devices-table">
        <thead>
          <tr>
            <th>Tên Máy</th>
            <th>Tên Tài Khoản TikTok</th>
            <th>Cài Đặt AI</th>
          </tr>
        </thead>
        <tbody>
          {activeDevices.map((device) => (
            <tr key={device._id}>
              <td>{device.deviceName}</td>
              <td>{device.tiktokUsername}</td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedDevice(device);
                    setShowLinkModal(true);
                  }}
                >
                  Cài Đặt AI
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveDevices;
