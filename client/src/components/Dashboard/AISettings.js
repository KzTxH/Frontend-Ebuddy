import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { io } from 'socket.io-client';
import './AISettings.css';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const AISettings = () => {
  const [aiSettings, setAiSettings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [productName, setProductName] = useState('');
  const [inputFields, setInputFields] = useState(['']);

  useEffect(() => {
    const fetchAISettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/ai-settings`, {
          headers: { 'x-auth-token': token }
        });
        setAiSettings(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching AI settings:', error);
      }
    };

    fetchAISettings();

    const socket = io(API_BASE_URL);
    socket.on('updateAISettings', (settings) => {
      console.log(settings)
      setAiSettings(Array.isArray(settings) ? settings : []);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAddField = () => {
    setInputFields([...inputFields, '']);
  };

  const handleRemoveField = (index) => {
    const fields = [...inputFields];
    fields.splice(index, 1);
    setInputFields(fields);
  };

  const handleFieldChange = (index, value) => {
    const fields = [...inputFields];
    fields[index] = value;
    setInputFields(fields);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editMode) {
        await axios.put(`${API_BASE_URL}/api/ai-settings/${currentSetting._id}`, {
          productName,
          fields: inputFields
        }, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/ai-settings`, {
          productName,
          fields: inputFields
        }, {
          headers: { 'x-auth-token': token }
        });
      }

      setShowModal(false);
      setProductName('');
      setInputFields(['']);
      setCurrentSetting(null);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving AI setting:', error);
    }
  };

  const handleEdit = (setting) => {
    setCurrentSetting(setting);
    setProductName(setting.productName);
    setInputFields(setting.fields || []);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/ai-settings/${id}`, {
        headers: { 'x-auth-token': token }
      });
    } catch (error) {
      console.error('Error deleting AI setting:', error);
    }
  };

  return (
    <div className="ai-settings-container">
      <h2>Cài Đặt AI</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>Thêm</Button>
      <table className="ai-settings-table">
        <thead>
          <tr>
            <th>Tên Sản Phẩm</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {aiSettings.length > 0 ? (
            aiSettings.map((setting) => (
              <tr key={setting._id}>
                <td>{setting.productName}</td>
                <td>
                  <Button variant="secondary" onClick={() => handleEdit(setting)}>Sửa</Button>
                  <Button variant="danger" onClick={() => handleDelete(setting._id)}>Xóa</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">Không có cài đặt AI nào</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Sửa' : 'Thêm'} Cài Đặt AI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Tên Sản Phẩm"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          {inputFields.map((field, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Nội dung"
                value={field}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                required
              />
              <Button variant="danger" onClick={() => handleRemoveField(index)}>Xóa</Button>
            </div>
          ))}
          <Button variant="secondary" onClick={handleAddField}>Thêm</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
          <Button variant="primary" onClick={handleSave}>{editMode ? 'Lưu' : 'Thêm'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AISettings;
