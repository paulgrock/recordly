import React from 'react';

export default ({track}) => {
  const {artist, title, album, favorite} = track;
  const fave = favorite ? 'yes' : 'no';
  return (
    <tr>
      <td>{title}</td>
      <td>{artist}</td>
      <td>{album}</td>
      <td>{fave}</td>
    </tr>
  )
}