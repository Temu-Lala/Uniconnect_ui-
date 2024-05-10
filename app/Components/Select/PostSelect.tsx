import React from 'react';
import { Select } from 'antd';

const handleChange = (value: { value: string; label: React.ReactNode }) => {
  console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
};

const PostSelect: React.FC = () => (
  <Select
    labelInValue
    defaultValue={{ value: 'anyone', label: 'Post to anyone' }}
    style={{ width: 120, zIndex: 9999 }}
    onChange={handleChange}
    className='z-[]'
    options={[
      {
        value: 'anyone',
        label: 'Post to anyone',
      },
      {
        value: 'university',
        label: 'Post to universities',
      },
      {
        value: 'college',
        label: 'Post to colleges',
      },
      {
        value: 'department',
        label: 'Post to departments',
      },
      {
        value: 'lectures',
        label: 'Post to lectures',
      }
    ]}
  />
);

export default PostSelect;