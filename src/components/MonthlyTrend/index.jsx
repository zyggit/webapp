import React, { useEffect, useState } from 'react';
import { Card, DatePicker } from 'antd';
import ReactEcharts from 'echarts-for-react';
import dayjs from 'dayjs';
import './index.css';

const { MonthPicker } = DatePicker;

const MonthlyTrend = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [data, setData] = useState([]);

  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('feedingRecords') || '[]');
    const monthRecords = records.filter(record => 
      dayjs(record.time).format('YYYY-MM') === selectedMonth.format('YYYY-MM')
    );
    setData(monthRecords);
  }, [selectedMonth]);

  const getMonthlyTrendOption = () => {
    const daysInMonth = selectedMonth.daysInMonth();
    const dailyTotal = Array(daysInMonth).fill(0);
    
    data.forEach(record => {
      const day = dayjs(record.time).date() - 1;
      dailyTotal[day] += record.amount;
    });

    return {
      title: {
        text: '月度趋势'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: Array(daysInMonth).fill(0).map((_, i) => i + 1)
      },
      yAxis: {
        type: 'value',
        name: '奶量(ml)'
      },
      series: [{
        data: dailyTotal,
        type: 'line',
        name: '每日总量',
        smooth: true,
        areaStyle: {}
      }]
    };
  };

  return (
    <div className="monthly-trend">
      <Card title="月度趋势分析">
        <DatePicker 
          picker="month"
          value={selectedMonth}
          onChange={setSelectedMonth}
          className="month-picker"
        />
        <ReactEcharts option={getMonthlyTrendOption()} />
      </Card>
    </div>
  );
};

export default MonthlyTrend;
