import React, {Component} from 'react';
import TrackField from './TrackField';
import TypeList from './TypeList';

export default class AddSong extends Component {
  state = {
    title: "",
    album: "",
    artist: "",
    favorite: false
  }
  handleInputChange = ({target}) => {
    const val = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [target.name]: val
    })
  }
  handleSubmit = (evt) => {
    evt.preventDefault();
    fetch(`/tracks/new`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify(this.state),
      mode: 'cors'
    }).
    then(r => r.json()).
    then((track) => {
      this.props.handleAddTrack(track);
    }).
    catch(e => console.error(e));
  }

  render() {
    const opts = {
      params: {
        type: 'track'
      }
    }
    return (
      <div class="new-track">
        <form method="POST" action={`/tracks/new`} onSubmit={this.handleSubmit} name="addTrack">
          <TrackField type="title" handleInputChange={this.handleInputChange} val={this.state.title} />
          <TrackField type="artist" handleInputChange={this.handleInputChange} val={this.state.artist} />
          <TrackField type="album" handleInputChange={this.handleInputChange} val={this.state.album} />
          <div>
            <label htmlFor="favorite">Favorite:</label>
            <input type="checkbox" checked={this.state.favorite} name="favorite"  onChange={this.handleInputChange} />
          </div>
          <input type="submit" value="Add" />
        </form>
      </div>
    )
  }
}