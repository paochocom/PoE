import React, { Component } from 'react'
import LoginButtonContainer from '../../user/ui/loginbutton/LoginButtonContainer'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Welcome to my "Proof of existence" project</h1>
            <span id="loginbutton">
                <LoginButtonContainer />
            </span>
            <h3>How to login with Uport</h3>
            <p>The React/Redux portions of the authentication fuctionality are provided by <a href="https://github.com/mjrussell/redux-auth-wrapper" target="_blank">mjrussell/redux-auth-wrapper</a>.</p>
            <h3>Further Reading</h3>
            <p>You can find in the readme.md all the explanation needed about the project.</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
