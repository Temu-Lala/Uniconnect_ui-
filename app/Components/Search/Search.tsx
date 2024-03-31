import React from 'react'

export default function Search() {
  return (
<div className="join">
  <div>
    <div>
      <input className="input input-bordered join-item" placeholder="Search"/>
    </div>
  </div>
  <select className="select select-bordered join-item">
    <option disabled selected>Filter</option>
    <option>News</option>
    <option>University </option>
    <option>Lectures</option>
  </select>
  <div className="indicator">
    <button className="btn bg-blue-600 join-item">Search</button>
  </div>
</div>  )
}
