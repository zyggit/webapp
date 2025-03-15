import React, { useState } from 'react';
import { Card, Button, InputNumber, message, DatePicker, Space, Tabs } from 'antd';
import { saveRecord } from '../../utils/storage';
import dayjs from 'dayjs';
import './index.css';

const { TabPane } = Tabs;

const FeedingInput = () => {
  const [amount, setAmount] = useState(90);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [activeTab, setActiveTab] = useState('quick');

  const QUICK_AMOUNTS = [60, 90, 120, 160];

  const handleQuickInput = (value) => {
    setAmount(value);
    saveFeeding(value, new Date());
  };

  const handleAdjust = (delta) => {
    const newAmount = amount + delta;
    if (newAmount >= 0) {
      setAmount(newAmount);
    }
  };

  const saveFeeding = (value, timestamp) => {
    const record = {
      amount: value,
      timestamp: timestamp.toISOString()
    };
    saveRecord(record);
    message.success('记录成功！');
  };

  const handleManualSave = () => {
    if (!selectedDateTime) {
      message.warning('请选择日期时间！');
      return;
    }
    saveFeeding(amount, selectedDateTime.toDate());
    setSelectedDateTime(null); // 重置日期时间选择
  };

  const handleDateTimeChange = (value) => {
    setSelectedDateTime(value);
  };

  const disabledDate = (current) => {
    // 禁用未来的日期
    return current && current > dayjs().endOf('day');
  };

  const disabledTime = () => {
    if (selectedDateTime && dayjs().isSame(selectedDateTime, 'day')) {
      const currentHour = dayjs().hour();
      const currentMinute = dayjs().minute();
      return {
        disabledHours: () => [...Array(24).keys()].slice(currentHour + 1),
        disabledMinutes: () => selectedDateTime.hour() === currentHour ? [...Array(60).keys()].slice(currentMinute + 1) : []
      };
    }
    return {};
  };

  return (
    <Card title="录入奶量" className="feeding-input">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="快速录入" key="quick">
          <div className="quick-buttons">
            {QUICK_AMOUNTS.map(value => (
              <Button
                key={value}
                size="large"
                type={amount === value ? 'primary' : 'default'}
                onClick={() => handleQuickInput(value)}
              >
                {value}ml
              </Button>
            ))}
          </div>
          
          <div className="amount-adjuster">
            <Button onClick={() => handleAdjust(-10)}>-10ml</Button>
            <InputNumber
              value={amount}
              onChange={(value) => setAmount(value)}
              min={0}
              step={10}
            />
            <Button onClick={() => handleAdjust(10)}>+10ml</Button>
          </div>
          
          <Button
            type="primary"
            size="large"
            className="save-button"
            onClick={() => saveFeeding(amount, new Date())}
          >
            立即保存
          </Button>
        </TabPane>

        <TabPane tab="手动录入" key="manual">
          <div className="manual-input">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div className="datetime-picker">
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="选择日期和时间"
                  value={selectedDateTime}
                  onChange={handleDateTimeChange}
                  disabledDate={disabledDate}
                  disabledTime={disabledTime}
                  showNow={false}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="amount-input">
                <div className="quick-buttons">
                  {QUICK_AMOUNTS.map(value => (
                    <Button
                      key={value}
                      type={amount === value ? 'primary' : 'default'}
                      onClick={() => setAmount(value)}
                    >
                      {value}ml
                    </Button>
                  ))}
                </div>

                <div className="amount-adjuster">
                  <Button onClick={() => handleAdjust(-10)}>-10ml</Button>
                  <InputNumber
                    value={amount}
                    onChange={(value) => setAmount(value)}
                    min={0}
                    step={10}
                  />
                  <Button onClick={() => handleAdjust(10)}>+10ml</Button>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                className="save-button"
                onClick={handleManualSave}
              >
                保存记录
              </Button>
            </Space>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default FeedingInput;
