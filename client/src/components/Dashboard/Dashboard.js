import React, { useState } from 'react';
import ActiveDevices from './ActiveDevices'; // Import component ActiveDevices
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('devices');

  const renderContent = () => {
    switch (activeTab) {
      case 'devices':
        return <ActiveDevices />;
      default:
        return <div>Chọn một tab để xem nội dung.</div>;
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'devices' ? 'active' : ''}`} 
                onClick={() => setActiveTab('devices')}
              >
                Thiết bị đang hoạt động
              </button>
            </li>
            {/* Thêm các tab khác ở đây */}
          </ul>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
