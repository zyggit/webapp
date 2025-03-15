const STORAGE_KEY = 'baby-feeding-records';

export const saveRecord = (record) => {
  const records = getRecords();
  records.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const getRecords = () => {
  const records = localStorage.getItem(STORAGE_KEY);
  return records ? JSON.parse(records) : [];
};

export const getRecordsByDate = (date) => {
  const records = getRecords();
  const targetDate = new Date(date);
  return records.filter(record => {
    const recordDate = new Date(record.timestamp);
    return recordDate.getFullYear() === targetDate.getFullYear() &&
           recordDate.getMonth() === targetDate.getMonth() &&
           recordDate.getDate() === targetDate.getDate();
  });
};

export const getRecordsByMonth = (year, month) => {
  const records = getRecords();
  return records.filter(record => {
    const date = new Date(record.timestamp);
    return date.getFullYear() === year && date.getMonth() === month;
  });
};
