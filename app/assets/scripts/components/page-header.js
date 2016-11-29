'use strict';
import React, { PropTypes as T } from 'react';
import { hashHistory, Link } from 'react-router';
import c from 'classnames';

import AuthService, { isLoggedIn, logout } from '../utils/auth-service';

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  propTypes: {
    auth: T.instanceOf(AuthService),
    user: T.object
  },

  getInitialState: function () {
    return {
      menu: false
    };
  },

  onLogoutClick: function (e) {
    logout();
    hashHistory.push('/');
  },

  onMenuClick: function (e) {
    e.preventDefault();
    this.setState({menu: !this.state.menu});
  },

  renderUserProfileLink: function () {
    // The user profile is fetched asynchronously from the token.
    // Ensure we have the data before rendering.
    let prof = this.props.user.profile;
    if (!prof) return null;

    return <li><Link to='/dashboard' className='global-menu-item' title='View my tasks'>{prof.user_metadata.name} tasks</Link></li>;
  },

  render: function () {
    const auth = this.props.auth;
    const loggedIn = isLoggedIn(this.props.user.token);

    return (
      <header className='page__header' role='banner'>
        <div className='inner'>
          <div className='page__headline'>
            <h1 className='page__title'>
              <Link to='/' title='Visit homepage'>Imagery Requests</Link>
            </h1>
          </div>
          <nav className='page__prime-nav' role='navigation'>
            <h2 className='toggle-menu'><a href='#global-menu' className={c({'button--active': this.state.menu})} title='Show/hide menu' onClick={this.onMenuClick}><span>Browse</span></a></h2>
            <div className={c('menu-wrapper', {'menu-wrapper--open': this.state.menu})} ref='menu'>
              <ul className='global-menu' id='global-menu'>
                {loggedIn ? this.renderUserProfileLink() : null }
                <li><Link to='/about' className='global-menu-item' title='About this website'>About</Link></li>
                <li>
                  {loggedIn
                    ? <button className='button button--base' onClick={this.onLogoutClick}>Logout</button>
                    : <button className='button button--primary' onClick={auth.login.bind(this)}>Login</button>
                  }
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }
});

module.exports = PageHeader;

