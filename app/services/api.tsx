import axios from 'axios';

export const searchQuery = async (query, token) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/search?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error in searchQuery:', error.response ? error.response.data : error.message); // Additional logging
    throw error;
  }
};

export const fetchUniversityProfile = async (id, token) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/university-profiles/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching university profile:', error.response ? error.response.data : error.message); // Additional logging
    throw error;
  }
};
