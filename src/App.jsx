import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import FeedingInput from './components/FeedingInput';
import Dashboard from './components/Dashboard';
import DailyRecord from './components/DailyRecord';
import MonthlyTrend from './components/MonthlyTrend';
import DataExport from './components/DataExport';

const { Header, Content } = Layout;

const App = () => {
  return (
    <Layout>
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={[
            { key: '1', label: <Link to="/">录入</Link> },
            { key: '2', label: <Link to="/dashboard">大盘数据</Link> },
            { key: '3', label: <Link to="/daily">每日记录</Link> },
            { key: '4', label: <Link to="/monthly">月度趋势</Link> },
            { key: '5', label: <Link to="/export">数据导出</Link> }
          ]}
        />
      </Header>
      <Content className="container">
        <Routes>
          <Route path="/" element={<FeedingInput />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/daily" element={<DailyRecord />} />
          <Route path="/monthly" element={<MonthlyTrend />} />
          <Route path="/export" element={<DataExport />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
