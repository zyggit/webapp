import React, { useState } from 'react';
import { Card, Button, InputNumber, message } from 'antd';
import dayjs from 'dayjs';
import './index.css';

const FeedingInput = () => {
  const [amount, setAmount] = useState(120);
  
  const handleQuickInput = (value) => {
    setAmount(value);
  };

  const handleSubmit = () => {
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const record = {
      time,
      amount,
    };

    // 获取现有记录
    const records = JSON.parse(localStorage.getItem('feedingRecords') || '[]');
    records.push(record);
    localStorage.setItem('feedingRecords', JSON.stringify(records));
    
    message.success('记录成功！');
    setAmount(120);
  };

  const quickAmounts = [60, 90, 120, 150, 180];

  return (
    <Card title="快速记录" className="feeding-input">
      <div className="amount-display">{amount}ml</div>
      <div className="quick-buttons">
        {quickAmounts.map(value => (
          <Button 
            key={value}
            type={amount === value ? 'primary' : 'default'}
            onClick={() => handleQuickInput(value)}
          >
            {value}ml
          </Button>
        ))}
      </div>
      <div className="custom-input">
        <InputNumber 
          value={amount}
          onChange={setAmount}
          min={0}
          max={300}
          step={10}
          addonAfter="ml"
        />
      </div>
      <Button type="primary" size="large" block onClick={handleSubmit}>
        记录
      </Button>
    </Card>
  );
};

export default FeedingInput;
