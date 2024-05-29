"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import {
  FaPhone, FaEnvelope, FaLinkedin, FaUserFriends, FaGraduationCap, FaBriefcase, FaLanguage, FaProjectDiagram, FaTimesCircle, FaCommentDots
} from 'react-icons/fa';

interface Params {
  id: string;
}

interface Profile {
  profile_photo: string;
  avatar: string;
  name: string;
  job_title: string;
  phone: string;
  email: string;
  linkedin: string;
  about: string;
  education_background: string;
  background_description: string;
  education_background2: string;
  background_description2: string;
  education_background3: string;
  background_description3: string;
  professional_experience: string;
  professional_experience2: string;
  professional_experience3: string;
  project1: string;
  project_description1: string;
  project2: string;
  project_description2: string;
  project3: string;
  project_description3: string;
  languages: string;
  languages2: string;
  languages3: string;
}

const LecturerProfileDetailPage = ({ params }: { params: Params }) => {
  const router = useRouter();
  const { id } = params;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (id) {
      fetchProfile(id);
      if (token) {
        checkFollowStatus(id, token);
        fetchFollowersCount(id, token);
      }
    }
  }, [id]);

  const fetchProfile = async (id: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/lecturer-cv/${id}/`);
      setProfile(response.data);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async (id: string, token: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/check-follow-status/lecturer/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsFollowing(response.data.is_following);
    } catch (error: any) {
      console.error('Error checking follow status:', error.message);
    }
  };

  const fetchFollowersCount = async (id: string, token: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/followers_count/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFollowersCount(response.data.followers_count);
    } catch (error: any) {
      console.error('Error fetching followers count:', error.message);
    }
  };

  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://127.0.0.1:8000/follow-lecturer-profile/${id}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsFollowing(true);
      setFollowersCount((prevCount) => prevCount + 1);
    } catch (error: any) {
      console.error('Error following lecturer:', error.message);
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://127.0.0.1:8000/unfollow-lecturer-profile/${id}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsFollowing(false);
      setFollowersCount((prevCount) => Math.max(prevCount - 1, 0));
    } catch (error: any) {
      console.error('Error unfollowing lecturer:', error.message);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="pt-24 px-4 md:px-8 lg:px-16 bg-gray-900 text-white min-h-screen">
      {profile && (
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="relative">
            <img src={profile.profile_photo} alt="Profile Photo" className="w-full h-64 object-cover" />
            <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-gray-800 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="p-4 text-center mt-12">
            <h1 className="text-2xl font-bold truncate">{profile.name}</h1>
            <p className="text-gray-400">{profile.job_title}</p>
            <div className="flex justify-center space-x-4 mt-4">
              <p className="text-gray-400"><FaUserFriends className="inline-block mr-1" /> {followersCount} Followers</p>
              {isLoggedIn && (
                <button onClick={isFollowing ? handleUnfollow : handleFollow} className={`btn ${isFollowing ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
              )}
            </div>
          </div>
          <div className="border-t border-gray-700 p-4 flex justify-center space-x-4">
            <a href={`tel:${profile.phone}`} className="text-gray-400 flex items-center"><FaPhone className="inline-block mr-1" /> {profile.phone}</a>
            <a href={`mailto:${profile.email}`} className="text-gray-400 flex items-center"><FaEnvelope className="inline-block mr-1" /> {profile.email}</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 flex items-center"><FaLinkedin className="inline-block mr-1" /> {profile.linkedin}</a>
            <button className="btn btn-primary flex items-center"><FaCommentDots className="mr-2" /> Message</button>
          </div>
          <div className="border-t border-gray-700 p-4">
            <h2 className="text-lg font-bold mb-2">About</h2>
            <p className="text-gray-400">{profile.about}</p>
          </div>
          <div className="border-t border-gray-700 p-4 text-center">
            <button onClick={handleShowModal} className="btn btn-primary">See Details</button>
          </div>
        </div>
      )}

      {showModal && profile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-gray-900 p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-full overflow-y-auto">
            <div className="relative">
              <img src={profile.profile_photo} alt="Profile Photo" className="w-full h-64 object-cover" />
              <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-gray-800 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="p-4 text-center mt-12">
              <h1 className="text-2xl font-bold truncate">{profile.name}</h1>
              <p className="text-gray-400">{profile.job_title}</p>
            </div>
            <div className="border-t border-gray-700 p-4">
              <h2 className="text-lg font-bold mb-2"><FaGraduationCap className="inline-block mr-2" /> Education Background</h2>
              <ul className="list-disc list-inside text-gray-400">
                <li>{profile.education_background}</li>
                <li>{profile.background_description}</li>
                <li>{profile.education_background2}</li>
                <li>{profile.background_description2}</li>
                <li>{profile.education_background3}</li>
                <li>{profile.background_description3}</li>
              </ul>
            </div>
            <div className="border-t border-gray-700 p-4">
              <h2 className="text-lg font-bold mb-2"><FaBriefcase className="inline-block mr-2" /> Professional Experience</h2>
              <ul className="list-disc list-inside text-gray-400">
                <li>{profile.professional_experience}</li>
                <li>{profile.professional_experience2}</li>
                <li>{profile.professional_experience3}</li>
              </ul>
            </div>
            <div className="border-t border-gray-700 p-4">
              <h2 className="text-lg font-bold mb-2"><FaProjectDiagram className="inline-block mr-2" /> Projects</h2>
              <ul className="list-disc list-inside text-gray-400">
                <li>{profile.project1} - {profile.project_description1}</li>
                <li>{profile.project2} - {profile.project_description2}</li>
                <li>{profile.project3} - {profile.project_description3}</li>
              </ul>
            </div>
            <div className="border-t border-gray-700 p-4">
              <h2 className="text-lg font-bold mb-2"><FaLanguage className="inline-block mr-2" /> Languages</h2>
              <ul className="list-disc list-inside text-gray-400">
                <li>{profile.languages}</li>
                <li>{profile.languages2}</li>
                <li>{profile.languages3}</li>
              </ul>
            </div>
            <div className="border-t border-gray-700 p-4 text-center">
              <button onClick={handleCloseModal} className="btn btn-secondary"><FaTimesCircle className="inline-block mr-2" /> Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerProfileDetailPage;
