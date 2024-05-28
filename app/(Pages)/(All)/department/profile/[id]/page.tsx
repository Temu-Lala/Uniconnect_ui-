"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaUniversity, FaMapMarkerAlt, FaRegCalendarAlt, FaUserFriends, FaChalkboardTeacher, FaBuilding, FaBook, FaMicroscope, FaSchool } from 'react-icons/fa';

const DepartmentProfileDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingsAndComments, setRatingsAndComments] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [seeMore, setSeeMore] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [campusName, setCampusName] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
      fetchRatingsAndComments(id);
      checkFollowStatus(id);
      fetchFollowersCount(id);
    }
  }, [id]);

  const fetchProfile = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/department-profiles/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfile(response.data);
      if (response.data.campus) {
        fetchCampusName(response.data.campus);
      }
      if (response.data.university) {
        fetchUniversityName(response.data.university);
      }
      if (response.data.college) {
        fetchCollegeName(response.data.college);
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampusName = async (campusId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/campus-profiles/${campusId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCampusName(response.data.name);
    } catch (error) {
      console.error('Error fetching campus name:', error.message);
    }
  };

  const fetchUniversityName = async (universityId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/university-profiles/${universityId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUniversityName(response.data.name);
    } catch (error) {
      console.error('Error fetching university name:', error.message);
    }
  };

  const fetchCollegeName = async (collegeId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/college-profiles/${collegeId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCollegeName(response.data.name);
    } catch (error) {
      console.error('Error fetching college name:', error.message);
    }
  };

  const fetchRatingsAndComments = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/department_rating/?department_id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRatingsAndComments(response.data);
    } catch (error) {
      console.error('Error fetching ratings and comments:', error.message);
    }
  };

  const fetchFollowersCount = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/department_followers_count/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFollowersCount(response.data.followers_count);
    } catch (error) {
      console.error('Error fetching followers count:', error.message);
    }
  };

  const checkFollowStatus = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/check-follow-status/department/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIsFollowing(response.data.is_following);
    } catch (error) {
      console.error('Error checking follow status:', error.message);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/follow-department-profile/${id}/`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIsFollowing(true);
      fetchFollowersCount(id); // Fetch the updated followers count after following
    } catch (error) {
      console.error('Error following department:', error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/unfollow-department-profile/${id}/`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIsFollowing(false);
      fetchFollowersCount(id); // Fetch the updated followers count after unfollowing
    } catch (error) {
      console.error('Error unfollowing department:', error.message);
    }
  };

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8000/department_rating/',
        {
          department_id: id,
          value: rating,
          comment: comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Rating and comment added successfully:', response.data);
      setRating(0);
      setComment('');
      fetchRatingsAndComments(id);
    } catch (error) {
      console.error('Error adding rating and comment:', error.message);
    }
  };

  const toggleSeeMore = () => {
    setSeeMore(!seeMore);
  };

  const getGlowEffect = () => {
    if (rating <= 2) {
      return 'shadow-red-500';
    } else if (rating <= 4) {
      return 'shadow-yellow-500';
    } else {
      return 'shadow-green-500';
    }
  };

  const getRatingLabel = () => {
    if (rating <= 2) {
      return 'Bad';
    } else if (rating <= 4) {
      return 'Good';
    } else {
      return 'Excellent';
    }
  };

  const latestRatingsAndComments = ratingsAndComments.slice(0, 5);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowAllComments(false);
      setShowAboutModal(false);
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
            <img src={profile.cover_photo} alt="Cover Photo" className="w-full h-64 object-cover" />
            <img src={profile.profile_photo} alt="Profile Photo" className="w-24 h-24 rounded-full border-4 border-gray-800 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="p-4 text-center mt-12">
            <h1 className="text-2xl font-bold truncate">{profile.name}</h1>
            <p className="text-gray-400">{profile.bio}</p>
            <div className="flex justify-center space-x-4 mt-4">
              <p className="text-gray-400"><FaUserFriends className="inline-block mr-1" /> {followersCount} Followers</p>
              <button onClick={isFollowing ? handleUnfollow : handleFollow} className={`btn ${isFollowing ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
            </div>
          </div>
          <div className="border-t border-gray-700 p-4">
            <h2 className="text-lg font-bold mb-2">Bio</h2>
            <p className="text-gray-400">{profile.bio}</p>
          </div>
          <div className="border-t border-gray-700 p-4">
            <h2 className="text-lg font-bold mb-2">Department Information</h2>
            <div className="flex flex-wrap justify-center gap-4 text-gray-400">
              <div className="w-full md:w-auto"><FaChalkboardTeacher className="inline-block mr-1" /><strong>Lectures:</strong> {profile.number_of_lectures}</div>
              <div className="w-full md:w-auto"><FaBuilding className="inline-block mr-1" /><strong>Departments:</strong> {profile.number_of_departments}</div>
              <div className="w-full md:w-auto"><FaUniversity className="inline-block mr-1" /><strong>Campuses:</strong> {profile.number_of_campuses}</div>
              <div className="w-full md:w-auto"><FaBook className="inline-block mr-1" /><strong>Colleges:</strong> {profile.number_of_colleges}</div>
            </div>
            <div className={`mt-4 transition-all duration-300 ${seeMore ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><FaSchool className="inline-block mr-1" /><strong>Campus:</strong> {campusName}</div>
                <div><FaUniversity className="inline-block mr-1" /><strong>University:</strong> {universityName}</div>
                <div><FaSchool className="inline-block mr-1" /><strong>College:</strong> {collegeName}</div>
                <div><FaRegCalendarAlt className="inline-block mr-1" /><strong>Link:</strong> <a href={profile.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">{profile.link}</a></div>
                <div><FaRegCalendarAlt className="inline-block mr-1" /><strong>Established:</strong> {profile.establishment_date}</div>
                <div><FaMapMarkerAlt className="inline-block mr-1" /><strong>Region:</strong> {profile.region}</div>
                <div><FaMapMarkerAlt className="inline-block mr-1" /><strong>City:</strong> {profile.city}</div>
                <div><FaUniversity className="inline-block mr-1" /><strong>PO Box:</strong> {profile.pobox}</div>
                <div><FaUniversity className="inline-block mr-1" /><strong>Specific Place:</strong> {profile.specific_place}</div>
                <button onClick={() => setShowAboutModal(true)} className="mt-2 text-blue-500">About</button>
              </div>
            </div>
            <button onClick={toggleSeeMore} className="mt-2 text-blue-500">{seeMore ? 'Show Less' : 'See More'}</button>
          </div>
          <div className="border-t border-gray-700 p-4 text-center">
            <h2 className="text-lg font-bold mb-2">Rate and Comment</h2>
            <div className={`bg-gray-800 p-4 rounded-lg shadow-md w-full md:w-1/2 mx-auto ${getGlowEffect()} transition-shadow duration-300`}>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={rating}
                onChange={handleRatingChange}
                className="w-full mb-2"
                style={{ boxShadow: `0 0 10px ${rating <= 2 ? 'red' : rating <= 4 ? 'yellow' : 'green'}` }}
              />
              <p className="text-sm mb-2">Selected Rating: {rating} ({getRatingLabel()})</p>
              <textarea
                value={comment}
                onChange={handleCommentChange}
                className="w-full h-24 px-3 py-2 border border-gray-700 rounded mb-4 bg-gray-900 text-white"
                placeholder="Write your comment here..."
                style={{ resize: "none" }}
              ></textarea>
              <button onClick={handleSubmit} className="btn btn-primary w-full">Submit</button>
            </div>
          </div>
          <div className="border-t border-gray-700 p-4">
            <h2 className="text-lg font-bold mb-2">Ratings and Comments</h2>
            <ul className="space-y-2">
              {latestRatingsAndComments.map((item, index) => (
                <li key={index} className="bg-gray-800 p-4 rounded shadow">
                  <p className="font-bold">Rating: {item.value}</p>
                  <p>Comment: {item.comment}</p>
                </li>
              ))}
            </ul>
            {ratingsAndComments.length > 5 && (
              <button onClick={() => setShowAllComments(true)} className="mt-2 text-blue-500">See All</button>
            )}
          </div>
          <div className="border-t border-gray-700 p-4">
            <h2 className="text-lg font-bold mb-2">Location</h2>
            <div className="w-full h-64">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${profile.location}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {showAllComments && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-gray-900 p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-full overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">All Ratings and Comments</h2>
            <ul className="space-y-2">
              {ratingsAndComments.map((item, index) => (
                <li key={index} className="bg-gray-800 p-4 rounded shadow">
                  <p className="font-bold">Rating: {item.value}</p>
                  <p>Comment: {item.comment}</p>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowAllComments(false)} className="mt-4 btn btn-primary">Close</button>
          </div>
        </div>
      )}

      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-gray-900 p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-full overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">About</h2>
            <p className="text-gray-400">{profile.about}</p>
            <button onClick={() => setShowAboutModal(false)} className="mt-4 btn btn-primary">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentProfileDetailPage;
