import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ActiveDevices.css';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const ActiveDevices = () => {
  const [devices, setDevices] = useState([]);
  const [aiSettings, setAISettings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedAISetting, setSelectedAISetting] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchDevices();
    fetchAISettings();

    const socket = io(API_BASE_URL);
    socket.on('updateActiveDevices', (updatedDevices) => {
      setDevices(updatedDevices);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLinkAISettings = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/phone/link-ai-settings`, {
        deviceName: selectedDevice,
        aiSettingId: selectedAISetting
      }, {
        headers: { 'x-auth-token': token }
      });

      // Update the devices list to reflect the new AI setting link
      const response = await axios.get(`${API_BASE_URL}/api/phone/active-devices`, {
        headers: { 'x-auth-token': token }
      });
      setDevices(response.data);

      setShowModal(false);
      setSelectedDevice(null);
      setSelectedAISetting('');
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="active-devices-container">
      <h2>Thiết Bị Đang Hoạt Động</h2>
      <table className="active-devices-table">
        <thead>
          <tr>
            <th>Tên Máy</th>
            <th>Tên Tài Khoản TikTok</th>
            <th>Cài Đặt AI</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {devices.length > 0 ? (
            devices.map((device) => (
              <tr key={device._id}>
                <td>{device.deviceName}</td>
                <td>{device.tiktokUsername}</td>
                <td>{device.aiSetting ? device.aiSetting.productName : 'Chưa liên kết'}</td>
                <td>
                  <Button variant="secondary" onClick={() => {
                    setSelectedDevice(device.deviceName);
                    setShowModal(true);
                  }}>Liên Kết Cài Đặt AI</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No devices found</td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Liên Kết Cài Đặt AI</Modal.Title>
        </Modal.Header>
        {error && <p className="error-message">{error}</p>}
        <Modal.Body>
          <select
            className="form-control"
            value={selectedAISetting}
            onChange={(e) => setSelectedAISetting(e.target.value)}
          >
            <option value="">Chọn Cài Đặt AI</option>
            {aiSettings.map((setting) => (
              <option key={setting._id} value={setting._id}>{setting.productName}</option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
          <Button variant="primary" onClick={handleLinkAISettings}>Liên Kết</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ActiveDevices;
