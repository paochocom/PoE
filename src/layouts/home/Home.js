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
            <p>Just download Uport on your phone, follow the instructions. When you click on the login button, you'll see a qr code. Scan it with Uport App and you're connected.</p>
            <h3>Further Reading</h3>
            <p>You can find in the readme.md all the explanation needed about the project.</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
