import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';  // Import axios
import { AuthContext } from '../../contexts/AuthContext';
import { io } from 'socket.io-client';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ActiveDevices from './ActiveDevices';
import AISettings from './AISettings';
import './Dashboard.css';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState('activeDevices');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedAISetting, setSelectedAISetting] = useState('');
  const [aiSettings, setAiSettings] = useState([]); // Define aiSettings here
  const { auth } = useContext(AuthContext);

  const handleLinkAISetting = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/phone/link-ai-settings`, {
        deviceId: selectedDevice._id,
        aiSettingId: selectedAISetting
      }, {
        headers: { 'x-auth-token': token }
      });

      handleCloseLinkModal();
    } catch (error) {
      console.error('Error linking AI setting:', error);
    }
  };

  const handleCloseLinkModal = () => setShowLinkModal(false);

  useEffect(() => {
    const fetchAISettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/ai-settings`, {
          headers: { 'x-auth-token': token }
        });
        setAiSettings(response.data);
      } catch (error) {
        console.error('Error fetching AI settings:', error);
      }
    };

    fetchAISettings();
  }, [auth]);

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <ul>
          <li onClick={() => setCurrentTab('activeDevices')}>Thiết Bị Đang Hoạt Động</li>
          <li onClick={() => setCurrentTab('aiSettings')}>Cài Đặt AI</li>
        </ul>
      </nav>
      <div className="dashboard-content">
        {currentTab === 'activeDevices' && (
          <ActiveDevices setShowLinkModal={setShowLinkModal} setSelectedDevice={setSelectedDevice} />
        )}
        {currentTab === 'aiSettings' && (
          <AISettings />
        )}
      </div>
      <Modal show={showLinkModal} onHide={handleCloseLinkModal}>
        <Modal.Header closeButton>
          <Modal.Title>Liên Kết Cài Đặt AI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            value={selectedAISetting}
            onChange={(e) => setSelectedAISetting(e.target.value)}
            className="form-control mb-2"
          >
            <option value="">Chọn Cài Đặt AI</option>
            {aiSettings.map((setting) => (
              <option key={setting._id} value={setting._id}>{setting.productName}</option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLinkModal}>Đóng</Button>
          <Button variant="primary" onClick={handleLinkAISetting}>Liên Kết</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
