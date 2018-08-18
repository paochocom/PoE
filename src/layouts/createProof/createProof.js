import React, { Component } from 'react'

class createProof extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Create proof of Existence</h1>
            <p><strong>Congratulations {this.props.authData.name}!</strong> If you're seeing this page, you've logged in with UPort successfully.</p>
          </div>
        </div>
        <div className="add_proof">
            <form onSubmit={this.onSubmit}>
              <input type="file" onChange={this.captureFile}/>
              <input type="submit"/>
            </form>
            <p>this is your proof of existence</p>
            <img src={'https://ipfs.io/ipfs/${this.state.ipfsHash}'} alt=''/>
          </div>
      </main>
    )
  }
}

export default createProof
