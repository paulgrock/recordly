import React, { Component } from 'react';
import './App.css';
import TypeList from './TypeList';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import AddTrack from './AddTrack';
let url = "http://localhost:3000";
if (process.env.NODE_ENV === 'development') {
  url = "http://localhost:3001";
}

class App extends Component {
  state = {
    tracks: []
  }

  typeMap = {
    albums: "album",
    tracks: "title",
    artists: "artist",
    favorites: "favorite"
  }

  fetchTracks = (type) => {
    fetch(`${url}/tracks?sort=${this.typeMap[type]}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      mode: 'cors'
    }).
      then(r => r.json()).
      then((tracks) => {
        this.setState({
          tracks
        })
      }).
      catch(e => console.error(e))
  }
  handleAddTrack = (track) => {
    this.setState({
      tracks: this.state.tracks.concat([track])
    })
  }
  render() {
    const ListItemLink = ({ to, text, ...rest }) => (
      <Route path={to} children={({ match }) => (
        <li className={match ? 'active' : ''}>
          <Link to={to} {...rest}>{text}</Link>
        </li>
      )}/>
    )
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <nav>
              <ul>
                <ListItemLink to="/tracks" text="Tracks" />
                <ListItemLink to="/artists" text="Artists" />
                <ListItemLink to="/albums" text="Albums" />
                <ListItemLink to="/favorites" text="Favorites" />
                <ListItemLink to="/new" text="New Track" />
                <li>
                  <a href="/logout">Log Out</a>
                </li>
              </ul>
            </nav>
          </header>
            <Route path="/new" render={(defaultProps) =>
              <AddTrack {...defaultProps} handleAddTrack={this.handleAddTrack} />
            } />
          <Switch>
            <Route path="/:type" render={(defaultProps) => 
              <TypeList {...defaultProps} fetchTracks={this.fetchTracks} tracks={this.state.tracks} typeMap={this.typeMap} />
            } />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
