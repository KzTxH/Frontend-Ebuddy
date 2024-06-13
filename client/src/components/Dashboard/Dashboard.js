import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import config from '../../config';
import './Dashboard.css';

const API_BASE_URL = config.apiUrl;

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [inputs, setInputs] = useState(['']);

  useEffect(() => {
    const fetchActiveDevices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/phone/active-devices`, {
          headers: { 'x-auth-token': token }
        });
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching active devices:', error);
      }
    };

    fetchActiveDevices();
  }, []);

  const handleShowModal = (device) => {
    setCurrentDevice(device);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
    setCurrentDevice(null);
    setInputs(['']);
  };

  const handleAddInput = () => {
    setInputs([...inputs, '']);
  };

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Submitted inputs:', inputs);
    handleHideModal();
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <table className="device-table">
        <thead>
          <tr>
            <th>Device Name</th>
            <th>TikTok Username</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, index) => (
            <tr key={device._id || index}>
              <td>{device.deviceName}</td>
              <td>{device.tiktokUsername}</td>
              <td>{device.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => handleShowModal(device)}>Cài đặt</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleHideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cài đặt cho {currentDevice?.deviceName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {inputs.map((input, index) => (
            <div key={index} className="input-group">
              <label>Input {index + 1}</label>
              <input
                type="text"
                value={input}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleAddInput}>Thêm</button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
