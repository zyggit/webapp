import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import FeedingInput from './components/FeedingInput';
import Dashboard from './components/Dashboard';
import DailyRecord from './components/DailyRecord';
import MonthlyTrend from './components/MonthlyTrend';

const { Header, Content } = Layout;

const App = () => {
  const menuItems = [
    { key: '/', label: '记录喝奶' },
    { key: '/dashboard', label: '数据总览' },
    { key: '/daily', label: '每日记录' },
    { key: '/monthly', label: '月度趋势' },
  ];

  return (
    <Layout className="layout">
      <Header>
        <div className="logo">宝宝喝奶记录</div>
        <Menu
          theme="dark"
          mode="horizontal"
          items={menuItems}
          onClick={({ key }) => window.location.hash = key}
        />
      </Header>
      <Content className="content">
        <Routes>
          <Route path="/" element={<FeedingInput />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/daily" element={<DailyRecord />} />
          <Route path="/monthly" element={<MonthlyTrend />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
