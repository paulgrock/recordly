import React from 'react';

export default ({type, handleInputChange, val}) => {
  return (
    <div>
      <label htmlFor={type}>{type}:</label>
      <input type="text" value={val} name={type} onChange={handleInputChange} />
    </div>
  )
}