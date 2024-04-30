import { Fragment } from 'react';
import { IoSearch } from "react-icons/io5";

interface SearchModalProps {
  customStyles?: string;
  ctx?: string;
}


const Search:React.FC<SearchModalProps> = ({ customStyles, ctx }) => {
  return (
    <Fragment>
      <div className='w-full'>
        <div className={`join flex w-full ${customStyles}`}>
          <div className='flex-1'>
            <div className='w-full'>
              <input placeholder="Search" className={`input w-full join-item input-bordered flex-1 ${ctx === "portrait" ? 'rounded-none' : ''}`}/>
            </div>
          </div>
          <select className="select select-bordered join-item">
            <option disabled selected>All</option>
            <option>News</option>
            <option>University </option>
            <option>Lectures</option>
          </select>
          <div className={`indicator ${ctx === "portrait" ? 'w-full' : ''}`}>
            <button className={`btn bg-blue-600 join-item text-white ${ctx === "portrait" ? 'w-full rounded-none' : ''}`}>
              {
              ctx === "portrait" ? 'Search' : <IoSearch className='text-2xl' />
              }
            </button>
          </div>
        </div>
      </div>

      {/* <div className='flex xl:block'>
        <FaSearch className='text-2xl' />
      </div> */}
    </Fragment>
  )
}

export default Search;