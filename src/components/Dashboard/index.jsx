import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import ReactEcharts from 'echarts-for-react';
import dayjs from 'dayjs';
import './index.css';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('feedingRecords') || '[]');
    setData(records);
  }, []);

  const getTimeDistributionOption = () => {
    const timeSlots = Array(24).fill(0);
    data.forEach(record => {
      const hour = dayjs(record.time).hour();
      timeSlots[hour] += record.amount;
    });

    return {
      title: {
        text: '每日时段分布'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: Array(24).fill(0).map((_, i) => `${i}:00`)
      },
      yAxis: {
        type: 'value',
        name: '奶量(ml)'
      },
      series: [{
        data: timeSlots,
        type: 'bar',
        name: '奶量'
      }]
    };
  };

  return (
    <div className="dashboard">
      <Card title="数据总览">
        <ReactEcharts option={getTimeDistributionOption()} />
      </Card>
    </div>
  );
};

export default Dashboard;
