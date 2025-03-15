import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Table } from 'antd';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { getRecordsByDate } from '../../utils/storage';
import './index.css';

const DailyRecord = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [records, setRecords] = useState([]);

  useEffect(() => {
    updateRecords();
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date ? date.toDate() : new Date());
  };

  const updateRecords = () => {
    const dailyRecords = getRecordsByDate(selectedDate);
    setRecords(dailyRecords.map((record, index) => ({
      ...record,
      key: index,
      time: format(new Date(record.timestamp), 'HH:mm:ss')
    })));
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => a.time.localeCompare(b.time)
    },
    {
      title: '奶量 (ml)',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount
    }
  ];

  const calculateTotal = () => {
    return records.reduce((sum, record) => sum + record.amount, 0);
  };

  return (
    <div className="daily-record">
      <Card 
        title="每日记录"
        extra={
          <DatePicker
            value={dayjs(selectedDate)}
            onChange={handleDateChange}
          />
        }
      >
        <Table 
          columns={columns} 
          dataSource={records}
          pagination={false}
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>{calculateTotal()} ml</Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  );
};

export default DailyRecord;
