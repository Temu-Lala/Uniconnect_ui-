import React, { useState, useEffect, useRef, ChangeEvent, MouseEvent as ReactMouseEvent } from 'react';
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface SearchProps {
  customStyles?: string;
  ctx?: string;
}

interface ResultItem {
  id: number;
  avatar?: string;
  name?: string;
  title?: string;
  username?: string;
}

interface Results {
  universities: ResultItem[];
  campuses: ResultItem[];
  colleges: ResultItem[];
  departments: ResultItem[];
  lecturers: ResultItem[];
  university_posts: ResultItem[];
  campus_posts: ResultItem[];
  college_posts: ResultItem[];
  department_posts: ResultItem[];
  lecturer_posts: ResultItem[];
  labs: ResultItem[];
  users: ResultItem[];
}

const Search: React.FC<SearchProps> = ({ customStyles = '', ctx = '' }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Results>({
    universities: [],
    campuses: [],
    colleges: [],
    departments: [],
    lecturers: [],
    university_posts: [],
    campus_posts: [],
    college_posts: [],
    department_posts: [],
    lecturer_posts: [],
    labs: [],
    users: []
  });
  const [showResults, setShowResults] = useState<boolean>(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (query.trim() === '') {
      setResults({
        universities: [],
        campuses: [],
        colleges: [],
        departments: [],
        lecturers: [],
        university_posts: [],
        campus_posts: [],
        college_posts: [],
        department_posts: [],
        lecturer_posts: [],
        labs: [],
        users: []
      });
      setShowResults(false);
      return;
    }

    const token = localStorage.getItem('token'); // Get the token from local storage

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/search?q=${query}`, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the authorization header
        }
      });
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [query]);

  const handleImageError = (id: number) => {
    setImageError((prevErrors) => ({ ...prevErrors, [id]: true }));
  };

  const handleClick = (type: string, id: number) => {
    setShowResults(false);
    switch (type) {
      case 'universities':
        router.push(`/universities/profile/${id}/`);
        break;
      case 'campuses':
        router.push(`/campus/profile/${id}`);
        break;
      case 'colleges':
        router.push(`/college/profile/${id}/`);
        break;
      case 'departments':
        router.push(`/department/profile/${id}/`);
        break;
      case 'lecturers':
        router.push(`/lecturer/profile/${id}/`);
        break;
      case 'university_posts':
        router.push(`/uni-post/profile/${id}/`);
        break;
      case 'campus_posts':
        router.push(`/cump-post/profile/${id}/`);
        break;
      case 'college_posts':
        router.push(`/coll-post/profile/${id}/`);
        break;
      case 'department_posts':
        router.push(`/dep-post/profile/${id}/`);
        break;
      case 'lecturer_posts':
        router.push(`/lect-post/profile/${id}/`);
        break;
      case 'labs':
        router.push(`/labs/profile/${id}/`);
        break;
      case 'users':
        router.push(`/users/${id}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full">
      <div className={`join flex w-full ${customStyles}`}>
        <div className="flex-1">
          <div className="w-full">
            <input
              placeholder="Search"
              className={`input w-full join-item input-bordered flex-1 ${ctx === "portrait" ? 'rounded-none' : ''}`}
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              style={{ backgroundColor: '#2d2d2d', borderColor: '#444', color: '#fff' }}
            />
          </div>
        </div>
        <div className={`indicator ${ctx === "portrait" ? 'w-full' : ''}`}>
          <button
            className={`btn join-item text-white ${ctx === "portrait" ? 'w-full rounded-none' : ''}`}
            onClick={handleSearch}
            style={{ backgroundColor: '#007acc', borderColor: '#007acc' }}
          >
            {ctx === "portrait" ? 'Search' : <IoSearch className="text-2xl" />}
          </button>
        </div>
      </div>
      {showResults && (
        <div ref={resultsRef} className="absolute left-0 right-0 mt-2 w-full shadow-lg rounded-lg z-20 max-h-96 overflow-y-auto" style={{ backgroundColor: '#1e1e1e', borderColor: '#444', top: '100%' }}>
          {Object.keys(results).map((key) => (
            results[key as keyof Results].length > 0 && (
              <div key={key} className="border-b" style={{ borderColor: '#444' }}>
                <h2 className="font-bold p-2" style={{ backgroundColor: '#333', color: '#007acc' }}>{key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</h2>
                {results[key as keyof Results].map((item: ResultItem) => (
                  <div
                    key={item.id}
                    className="p-2 hover:bg-gray-700 cursor-pointer flex items-center"
                    style={{ color: '#ddd' }}
                    onClick={() => handleClick(key, item.id)}
                  >
                    <div className="mr-3">
                      <img 
                        src={imageError[item.id] ? '/path/to/default-avatar.png' : (item.avatar || '/path/to/default-avatar.png')} 
                        alt="Avatar" 
                        className="w-8 h-8 rounded-full" 
                        onError={() => handleImageError(item.id)}
                        style={{ borderColor: '#444' }}
                      />
                    </div>
                    <div>
                      {item.name || item.title || item.username}
                    </div>
                  </div>
                ))}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
