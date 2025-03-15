import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Button } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { getRecordsByMonth } from '../../utils/storage';
import './index.css';

// 注册 ChartJS 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyTrend = () => {
  const [selectedMonth1, setSelectedMonth1] = useState(() => new Date());
  const [selectedMonth2, setSelectedMonth2] = useState(null);
  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 31 }, (_, i) => i + 1),
    datasets: [{
      label: format(new Date(), 'yyyy年MM月'),
      data: Array(31).fill(0),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  });

  useEffect(() => {
    updateChartData();
  }, [selectedMonth1, selectedMonth2]);

  const handleMonth1Change = (date) => {
    setSelectedMonth1(date ? date.toDate() : new Date());
  };

  const handleMonth2Change = (date) => {
    setSelectedMonth2(date ? date.toDate() : null);
  };

  const getMonthData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const records = getRecordsByMonth(year, month);
    
    const dailyTotals = Array(31).fill(0);
    records.forEach(record => {
      const day = new Date(record.timestamp).getDate();
      dailyTotals[day - 1] += record.amount;
    });
    
    return dailyTotals;
  };

  const updateChartData = () => {
    const month1Data = getMonthData(selectedMonth1);
    const datasets = [
      {
        label: format(selectedMonth1, 'yyyy年MM月'),
        data: month1Data,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ];

    if (selectedMonth2) {
      const month2Data = getMonthData(selectedMonth2);
      datasets.push({
        label: format(selectedMonth2, 'yyyy年MM月'),
        data: month2Data,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      });
    }

    setChartData({
      labels: Array.from({ length: 31 }, (_, i) => i + 1),
      datasets
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
        text: '月度趋势对比'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '奶量 (ml)'
        }
      }
    }
  };

  return (
    <div className="monthly-trend">
      <Card title="月度趋势">
        <div className="controls">
          <DatePicker
            picker="month"
            value={dayjs(selectedMonth1)}
            onChange={handleMonth1Change}
            placeholder="选择月份"
          />
          <DatePicker
            picker="month"
            value={selectedMonth2 ? dayjs(selectedMonth2) : null}
            onChange={handleMonth2Change}
            placeholder="选择对比月份"
          />
          <Button onClick={() => setSelectedMonth2(null)}>清除对比</Button>
        </div>
        <div className="chart-container">
          <Line data={chartData} options={options} />
        </div>
      </Card>
    </div>
  );
};

export default MonthlyTrend;
