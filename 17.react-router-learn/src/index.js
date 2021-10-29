import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from './react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
// exact 表示精确匹配，只有url为"/"时才匹配
ReactDOM.render(
  <Router>
    <div>
      <Route path="/" exact component={Home} />
      <Route path="/user" component={User} />
      <Route path="/profile" component={Profile} />
    </div>
  </Router>,
  document.getElementById('root')
);
