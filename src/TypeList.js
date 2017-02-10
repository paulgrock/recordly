import React from 'react';
import TypeListItem from './TypeListItem';

export default class TypeList extends React.Component {
  state = {
    sortedTracks: this.props.tracks
  }

  componentWillReceiveProps(nextProps) {
    const {type} = nextProps.match.params
    const sortByType = this.props.typeMap[type]
    this.setState((prevState, props) => {
      return {
        sortedTracks: props.tracks.sort((prev, curr) => {
          let prevSort = prev[sortByType];
          let currSort = curr[sortByType];
          if (typeof prevSort === 'String') {
            prevSort = prevSort.toUpperCase();
            currSort = currSort.toUpperCase();
          }
          if (prevSort < currSort) {
            return -1;
          }
          if (prevSort > currSort) {
            return 1;
          }
          return 0;
        })
      }
    })
  }

  componentDidMount() {
    this.props.fetchTracks(this.props.match.params.type);
  }
  render() {
    const {type} = this.props.match.params;
    return (
      <div>
        <h1>{type}</h1>
        <table>
          <thead>
            <tr>
              <td>Title</td>
              <td>Artist</td>
              <td>Album</td>
              <td>Favorite</td>
            </tr>
          </thead>
          <tbody>
            {this.state.sortedTracks.map(track => <TypeListItem track={track} />)}
          </tbody>
        </table>
      </div>
    )
  }
}
