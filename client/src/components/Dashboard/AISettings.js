import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './AISettings.css';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const AISettings = () => {
  const [aiSettings, setAISettings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    // Add other fields as necessary
  });
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAISettings();
  }, []);

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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      productName: '',
      description: '',
      // Reset other fields
    });
    setEditing(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editing) {
        await axios.put(`${API_BASE_URL}/api/ai-settings/${editingId}`, formData, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/ai-settings`, formData, {
          headers: { 'x-auth-token': token }
        });
      }
      fetchAISettings();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving AI setting:', error);
    }
  };

  const handleEdit = (setting) => {
    setFormData({
      productName: setting.productName,
      description: setting.description,
      // Set other fields
    });
    setEditing(true);
    setEditingId(setting._id);
    handleShowModal();
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/ai-settings/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchAISettings();
    } catch (error) {
      console.error('Error deleting AI setting:', error);
    }
  };

  return (
    <div className="ai-settings-container">
      <h2>Cài Đặt AI</h2>
      <Button variant="primary" onClick={handleShowModal}>Thêm Cài Đặt AI</Button>
      <table className="ai-settings-table">
        <thead>
          <tr>
            <th>Tên Sản Phẩm</th>
            <th>Mô Tả</th>
            {/* Add other headers */}
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {aiSettings.length > 0 ? (
            aiSettings.map((setting) => (
              <tr key={setting._id}>
                <td>{setting.productName}</td>
                <td>{setting.description}</td>
                {/* Add other fields */}
                <td>
                  <Button variant="secondary" onClick={() => handleEdit(setting)}>Sửa</Button>
                  <Button variant="danger" onClick={() => handleDelete(setting._id)}>Xóa</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Không có cài đặt AI nào</td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Chỉnh sửa Cài Đặt AI' : 'Thêm Cài Đặt AI'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="productName">
              <Form.Label>Tên Sản Phẩm</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {/* Add other form groups for other fields */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
          <Button variant="primary" onClick={handleSave}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AISettings;
