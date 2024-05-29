"use client"
import { useState, useEffect, useRef, ChangeEvent, MouseEvent as ReactMouseEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaUniversity, FaMapMarkerAlt, FaRegCalendarAlt, FaUserFriends, FaChalkboardTeacher, FaBuilding, FaBook } from 'react-icons/fa';

interface Params {
  id: string;
}

interface Profile {
  cover_photo: string;
  profile_photo: string;
  name: string;
  bio: string;
  number_of_lectures: number;
  number_of_departments: number;
  number_of_campuses: number;
  number_of_colleges: number;
  link: string;
  establishment_date: string;
  region: string;
  city: string;
  pobox: string;
  specific_place: string;
  campus?: string;
  university?: string;
  about?: string;
  location: string;
}

interface RatingAndComment {
  value: number;
  comment: string;
}

const CollegeProfileDetailPage = ({ params }: { params: Params }) => {
  const router = useRouter();
  const { id } = params;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingsAndComments, setRatingsAndComments] = useState<RatingAndComment[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [seeMore, setSeeMore] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [campusName, setCampusName] = useState('');
  const [universityName, setUniversityName] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
      fetchRatingsAndComments(id);
      checkFollowingStatus(id);
      fetchFollowersCount(id);
    }
  }, [id]);

  const fetchProfile = async (id: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/college-profiles/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const profileData = response.data;
      setProfile(profileData);

      if (profileData.campus) {
        const campusResponse = await axios.get(`http://127.0.0.1:8000/campus-profiles/${profileData.campus}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCampusName(campusResponse.data.name);
      }

      if (profileData.university) {
        const universityResponse = await axios.get(`http://127.0.0.1:8000/university-profiles/${profileData.university}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUniversityName(universityResponse.data.name);
      }

    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching profile:', error.message);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingsAndComments = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/college_rating/?college_id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setRatingsAndComments(response.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching ratings and comments:', error.message);
      }
    }
  };

  const fetchFollowersCount = async (id: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/college_followers_count/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFollowersCount(response.data.followers_count);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching followers count:', error.message);
      }
    }
  };

  const checkFollowingStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/check-follow-status/college/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsFollowing(response.data.is_following);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error checking following status:', error.message);
      }
    }
  };

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRating(parseInt(event.target.value));
  };

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8000/college_rating/',
        {
          college_id: id,
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
      if (error instanceof Error) {
        console.error('Error adding rating and comment:', error.message);
      }
    }
  };

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://127.0.0.1:8000/follow-college-profile/${id}/`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsFollowing(true);
      setFollowersCount(followersCount + 1);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error following profile:', error.message);
      }
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://127.0.0.1:8000/unfollow-college-profile/${id}/`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsFollowing(false);
      setFollowersCount(followersCount - 1);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error unfollowing profile:', error.message);
      }
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

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowAllComments(false);
      setShowAboutModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside as EventListener);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as EventListener);
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
              {!isFollowing ? (
                <button onClick={handleFollow} className="btn bg-blue-500 text-white">Follow</button>
              ) : (
                <button onClick={handleUnfollow} className="btn bg-red-500 text-white">Unfollow</button>
              )}
            </div>
          </div>
          <div className="border-t border-gray-700 p-4">
            <h2 className="text-lg font-bold mb-2">Bio</h2>
            <p className="text-gray-400">{profile.bio}</p>
          </div>
          <div className="border-t border-gray-700 p-4">
            <h2 className="text-lg font-bold mb-2">University Information</h2>
            <div className="flex flex-wrap justify-center gap-4 text-gray-400">
              <div className="w-full md:w-auto"><FaChalkboardTeacher className="inline-block mr-1" /><strong>Lectures:</strong> {profile.number_of_lectures}</div>
              <div className="w-full md:w-auto"><FaBuilding className="inline-block mr-1" /><strong>Departments:</strong> {profile.number_of_departments}</div>
              <div className="w-full md:w-auto"><FaUniversity className="inline-block mr-1" /><strong>Campuses:</strong> {profile.number_of_campuses}</div>
              <div className="w-full md:w-auto"><FaBook className="inline-block mr-1" /><strong>Colleges:</strong> {profile.number_of_colleges}</div>
            </div>
            <div className={`mt-4 transition-all duration-300 ${seeMore ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><FaRegCalendarAlt className="inline-block mr-1" /><strong>Link:</strong> <a href={profile.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">{profile.link}</a></div>
                <div><FaRegCalendarAlt className="inline-block mr-1" /><strong>Established:</strong> {profile.establishment_date}</div>
                <div><FaMapMarkerAlt className="inline-block mr-1" /><strong>Region:</strong> {profile.region}</div>
                <div><FaMapMarkerAlt className="inline-block mr-1" /><strong>City:</strong> {profile.city}</div>
                <div><FaUniversity className="inline-block mr-1" /><strong>PO Box:</strong> {profile.pobox}</div>
                <div><FaUniversity className="inline-block mr-1" /><strong>Specific Place:</strong> {profile.specific_place}</div>
                <div><FaUniversity className="inline-block mr-1" /><strong>Campus:</strong> {campusName}</div>
                <div><FaUniversity className="inline-block mr-1" /><strong>University:</strong> {universityName}</div>
                <button onClick={() => setShowAboutModal(true)} className="mt-2 text-blue-500">About</button>
              </div>
            </div>
            <button onClick={toggleSeeMore} className="mt-2 text-blue-500">{seeMore ? 'Show Less' : 'See More'}</button>
          </div>
          <div className="border-t border-gray-700 p-4 text-center">
            <h2 className="text-lg font-bold mb-2">Rate and Comment</h2>
            <div className={`bg-gray-800 p-4 rounded-lg shadow-md w-full md:w-1/2 mx-auto transition-shadow duration-300 ${getGlowEffect()}`}>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={rating}
                onChange={handleRatingChange}
                className="w-full mb-2 glow-slider"
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
                allowFullScreen
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
            <p className="text-gray-400">{profile?.about}</p>
            <button onClick={() => setShowAboutModal(false)} className="mt-4 btn btn-primary">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeProfileDetailPage;
