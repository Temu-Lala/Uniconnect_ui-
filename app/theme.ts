// theme.ts
import { theme } from 'antd';

const { darkAlgorithm } = theme;

export const customDarkTheme = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: '#2563eb', // Customize primary color
    colorBgContainer: '#1a1a1a', // Dark background color
    colorText: '#fff', // Text color
    colorTextSecondary: '#a9a9a9', // Secondary text color
    // Add more custom tokens as needed
  },
};
