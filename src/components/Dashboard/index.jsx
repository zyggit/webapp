import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { getRecordsByDate } from '../../utils/storage';
import './index.css';

// 注册 ChartJS 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 生成时间段标签
const generateTimeLabels = () => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00-${hour}:59`;
  });
};

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [chartData, setChartData] = useState({
    labels: generateTimeLabels(),
    datasets: [{
      label: '奶量 (ml)',
      data: Array(24).fill(0),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  });

  useEffect(() => {
    updateChartData();
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date ? date.toDate() : new Date());
  };

  const updateChartData = () => {
    const records = getRecordsByDate(selectedDate);
    
    // 按时间段分组数据
    const timeSlots = Array(24).fill(0);
    const feedingCounts = Array(24).fill(0); // 记录每个时段的喂奶次数

    records.forEach(record => {
      const hour = new Date(record.timestamp).getHours();
      timeSlots[hour] += record.amount;
      feedingCounts[hour] += 1;
    });

    setChartData({
      labels: generateTimeLabels(),
      datasets: [
        {
          label: '奶量 (ml)',
          data: timeSlots,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }
      ]
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '每日喂奶时间分布'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            const value = context.dataset.data[dataIndex];
            return `奶量: ${value} ml`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '奶量 (ml)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  const formatDate = (date) => {
    return dayjs(date).format('YYYY年MM月DD日');
  };

  const calculateDailySummary = () => {
    const records = getRecordsByDate(selectedDate);
    const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);
    const feedingCount = records.length;
    return {
      totalAmount,
      feedingCount
    };
  };

  const { totalAmount, feedingCount } = calculateDailySummary();

  return (
    <div className="dashboard">
      <Card title={`大盘数据 - ${formatDate(selectedDate)}`}>
        <div className="summary-section">
          <div className="summary-item">
            <div className="summary-label">总奶量</div>
            <div className="summary-value">{totalAmount} ml</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">喂奶次数</div>
            <div className="summary-value">{feedingCount} 次</div>
          </div>
        </div>
        <div className="date-picker-container">
          <DatePicker
            value={dayjs(selectedDate)}
            onChange={handleDateChange}
          />
        </div>
        <div className="chart-container">
          <Bar data={chartData} options={options} />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
