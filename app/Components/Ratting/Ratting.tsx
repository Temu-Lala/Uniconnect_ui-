import React from 'react'

export default function Ratting() {
  return (
    <div className="rating">
    <input type="radio" name="rating-1" className="mask mask-star" />
    <input type="radio" name="rating-1" className="mask mask-star" checked />
    <input type="radio" name="rating-1" className="mask mask-star" />
    <input type="radio" name="rating-1" className="mask mask-star" />
    <input type="radio" name="rating-1" className="mask mask-star" />
  </div>
  )
}
