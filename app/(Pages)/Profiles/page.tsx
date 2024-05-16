"use client"
// In your Next.js page component
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();
  const [profileType, setProfileType] = useState(null);

  useEffect(() => {
    // Make request to Django endpoint
    axios.get('/api/landing-page')
      .then(response => {
        const data = response.data;
        if (data.profile_type === 'university') {
          router.push('/university');
        } else if (data.profile_type === 'campus') {
          router.push('/campus');
        } else if (data.profile_type === 'college') {
          router.push('/college');
        } else if (data.profile_type === 'department') {
          router.push('/department');
        } else {
          router.push('/default');
        }
      })
      .catch(error => {
        console.error('Error fetching landing page data:', error);
        // Redirect to login page or handle error as needed
      });
  }, []);

  return (
    <div>
      <h1>Loading...</h1>
      <p>fggggggggggggggggggggggggggggggggggggggg</p>
      {/* You can add a loading spinner or message here */}
    </div>
  );
};

export default LandingPage;



