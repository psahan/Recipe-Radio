import React, { Component } from 'react';
import Cookies from 'universal-cookie'
import 'isomorphic-unfetch'
import Router from 'next/router'

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
      event.preventDefault();
      fetch('http://api-server:4000/authenticate', {
        method: 'POST',
        // eslint-disable-next-line no-undef
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(this.state)
      }).then(response => {
        console.log("response1: ", response)
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(Error('error'))
      }).then(function(response) {
        const cookies = new Cookies()
        // set the cookie
        // https://www.npmjs.com/package/universal-cookie
        cookies.set('token', response.token, { path: '/' });
        
        Router.push('/user/profile')

      }).catch(error => {
        return Promise.reject(Error(error.message))
      })
  }

  render() {
    return (
      <div className="login">
        <h2 className="login-header">Log in</h2>
        <form onSubmit={this.handleSubmit.bind(this)} className="login-container">
          <p><input
                name="username" 
                value={this.state.username}
                onChange={this.handleInputChange} 
                type="text" 
                placeholder="username or email"
                id="inputUsername"
                required=""
              />
          </p>
          <p><input
                name="password"
                value={this.state.password}
                onChange={this.handleInputChange}
                id="inputPassword"
                type="password" 
                placeholder="****"
                required=""
              />
          </p>
          <p><input type="submit" value="Log in"/></p>
        </form>
      </div>
    );
  }
}

export default LoginForm;