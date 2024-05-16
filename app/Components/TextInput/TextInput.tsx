import React from 'react';
import { Flex, Input } from 'antd';

const { TextArea } = Input;

interface CustomTextAreaProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
}

const TextInput: React.FC<CustomTextAreaProps> = ({
  value,
  onChange,
  maxLength = 100,
  placeholder = "",
}) => {
  return (
    <Flex vertical gap={32}>
      
      <TextArea
        value={value}
        showCount
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)} // Ensure that the handler receives the value directly
        placeholder={placeholder}
        style={{ height: 120, resize: 'none' }}
      />
    </Flex>
  );
};

export default TextInput;
