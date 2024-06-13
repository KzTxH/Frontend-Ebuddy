import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './AISettings.css';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const AISettings = () => {
  const [aiSettings, setAiSettings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [textInputs, setTextInputs] = useState(['']);
  const [editId, setEditId] = useState(null);
  const { auth } = useContext(AuthContext);


  const handleShowModal = () => {
    setProductName('');
    setTextInputs(['']);
    setEditId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleAddInput = () => setTextInputs([...textInputs, '']);

  const handleInputChange = (index, value) => {
    const newInputs = [...textInputs];
    newInputs[index] = value;
    setTextInputs(newInputs);
  };

  const handleSaveSettings = async () => {
    if (!productName) {
      alert('Tên Sản Phẩm là bắt buộc');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (editId) {
        await axios.put(
          `${API_BASE_URL}/api/ai-settings/${editId}`,
          { productName, settings: textInputs },
          { headers: { 'x-auth-token': token } }
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/api/ai-settings`,
          { productName, settings: textInputs },
          { headers: { 'x-auth-token': token } }
        );
      }

      const response = await axios.get(`${API_BASE_URL}/api/ai-settings`, {
        headers: { 'x-auth-token': token }
      });
      setAiSettings(response.data);

      handleCloseModal();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleEdit = (setting) => {
    setProductName(setting.productName);
    setTextInputs(setting.settings);
    setEditId(setting._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/ai-settings/${id}`, {
        headers: { 'x-auth-token': token }
      });

      const response = await axios.get(`${API_BASE_URL}/api/ai-settings`, {
        headers: { 'x-auth-token': token }
      });
      setAiSettings(response.data);
    } catch (error) {
      console.error('Error deleting settings:', error);
    }
  };

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
    <div>
      <h2>Cài Đặt AI</h2>
      <Button variant="primary" onClick={handleShowModal} className="add-button">
        Thêm
      </Button>
      <table>
        <thead>
          <tr>
            <th>Tên Sản Phẩm</th>
            <th>Cài Đặt</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {aiSettings.map((setting) => (
            <tr key={setting._id}>
              <td>{setting.productName}</td>
              <td>
                <ul>
                  {setting.settings.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </td>
              <td>
                <Button variant="secondary" onClick={() => handleEdit(setting)}>Sửa</Button>
                <Button variant="danger" onClick={() => handleDelete(setting._id)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Sửa Cài Đặt AI' : 'Thêm Cài Đặt AI'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="Tên Sản Phẩm"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="form-control mb-2"
            required
          />
          {textInputs.map((input, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Nhập thông tin ${index + 1}`}
              value={input}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="form-control mb-2"
            />
          ))}
          <Button variant="secondary" onClick={handleAddInput}>Thêm</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
          <Button variant="primary" onClick={handleSaveSettings}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AISettings;
