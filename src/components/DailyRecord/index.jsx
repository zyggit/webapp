import React, { useState, useEffect } from 'react';
import { Card, DatePicker, List } from 'antd';
import dayjs from 'dayjs';
import './index.css';

const DailyRecord = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const allRecords = JSON.parse(localStorage.getItem('feedingRecords') || '[]');
    const filteredRecords = allRecords.filter(record => 
      dayjs(record.time).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
    );
    setRecords(filteredRecords);
  }, [selectedDate]);

  return (
    <div className="daily-record">
      <Card title="每日详细记录">
        <DatePicker 
          value={selectedDate}
          onChange={setSelectedDate}
          className="date-picker"
        />
        <List
          className="record-list"
          itemLayout="horizontal"
          dataSource={records}
          renderItem={record => (
            <List.Item>
              <List.Item.Meta
                title={dayjs(record.time).format('HH:mm:ss')}
                description={`奶量: ${record.amount}ml`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default DailyRecord;
