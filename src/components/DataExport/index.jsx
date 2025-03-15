import React, { useState } from 'react';
import { Card, Button, DatePicker, message } from 'antd';
import { utils, writeFile } from 'xlsx';
import { getRecords } from '../../utils/storage';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import './index.css';

const { RangePicker } = DatePicker;

const DataExport = () => {
  const [dateRange, setDateRange] = useState(null);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates ? dates.map(date => date.toDate()) : null);
  };

  const handleExport = () => {
    let records = getRecords();

    if (dateRange) {
      const [startDate, endDate] = dateRange;
      records = records.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    const data = records.map(record => ({
      日期: format(new Date(record.timestamp), 'yyyy-MM-dd'),
      时间: format(new Date(record.timestamp), 'HH:mm:ss'),
      '奶量(ml)': record.amount
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, '喂奶记录');

    writeFile(wb, '宝宝喂奶记录.xlsx');
    message.success('导出成功！');
  };

  return (
    <div className="data-export">
      <Card title="数据导出">
        <div className="export-controls">
          <RangePicker
            value={dateRange ? dateRange.map(date => dayjs(date)) : null}
            onChange={handleDateRangeChange}
          />
          <Button type="primary" onClick={handleExport}>
            导出Excel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DataExport;
