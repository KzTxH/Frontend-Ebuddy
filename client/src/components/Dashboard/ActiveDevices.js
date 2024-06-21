import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Button from 'react-bootstrap/Button';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './ActiveDevices.css';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const ActiveDevices = () => {
  const [devices, setDevices] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState('');
  



  useEffect(()=>{
    const fetchDevices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/phone/active-devices`, {
          headers: { 'x-auth-token': token }
        });
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };
    fetchDevices();


    const socket = io(API_BASE_URL);

    socket.on('updateActiveDevices', () => {
      fetchDevices();
    });

    // socket.on('updateIsOnline', (isonline) => {
    //   setIsOnline(isonline);
    // });
    

    return () => {
      socket.disconnect();
    };

  },[])

  return (
    <div className="active-devices-container">
      <h2>Thiết Bị Đang Hoạt Động</h2>
      <table className="active-devices-table">
        <thead>
          <tr>
            <th>Tên Máy</th>
            <th>Trạng Thái</th>
            <th>Tên Tài Khoản TikTok</th>
            <th>Voice AI</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {devices.length > 0 ? (
            devices.map((device) => (
              <tr key={device._id}>
                <td>{device.deviceName}</td>
                <td>
                <span
                  className={`d-inline-block rounded-circle ${device.isOnline ? 'bg-success' : 'bg-danger'}`}
                  style={{ width: '15px', height: '15px' }}
                ></span>
                </td>
                <td>{device.tiktokUsername}</td>
                <td>{device.aiSetting ? device.aiSetting.productName : "Chưa kết nối"}</td>
                <td>
                  <Button variant="secondary" onClick={() => {
                    // setSelectedDevice(device.deviceName);
                    // setShowModal(true);
                  }}>Làm sau</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Không có thiết bị nào đang hoạt động</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveDevices;
