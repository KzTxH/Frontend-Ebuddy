import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const ActiveDevices = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchActiveDevices = async () => {
      try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        const response = await axios.get(`${API_BASE_URL}/api/phone/active-devices`, {
          headers: { 'x-auth-token': token }
        });
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching active devices:', error);
      }
    };

    fetchActiveDevices();

    const socket = io(API_BASE_URL);

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('updateActiveDevices', (updatedDevices) => {
      console.log('Updated active devices:', updatedDevices);
      setDevices(updatedDevices);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Thiết bị đang hoạt động</h2>
      <ul className="list-group">
        {devices.length > 0 ? (
          devices.map((device) => (
            <li key={device._id} className="list-group-item">
              {device.deviceName} - {device.tiktokUsername}
            </li>
          ))
        ) : (
          <li className="list-group-item">Không có thiết bị nào đang hoạt động.</li>
        )}
      </ul>
    </div>
  );
};

export default ActiveDevices;
