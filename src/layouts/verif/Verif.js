import React, { Component } from 'react'
import SimpleStorageContract from './../../../build/contracts/SimpleStorage.json'
import ipfs from './../../util/ipfs.js'
import getWeb3 from './../../util/getWeb3.js'


class Verif extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    this.state ={
      willShowLoader: false,
      ipfsHash: '',
      storageValue: 0,
      web3: null,
      buffer: null,
      testvar : null,
      totalproof : 0,
      tagproof : 0,
      filename :'',
      filedate :'',
      proofOwner :''
    }
    this.validateUser = this.validateUser.bind(this);
  }

timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

 componentWillMount() {
      // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    console.log("contract instantiate starting");
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    var totalproofs
    simpleStorage.setProvider(this.state.web3.currentProvider)

    console.log("provider");
    console.log(this.state.web3.currentProvider);
    // Get accounts.
    console.log(this.state.web3.eth.getAccounts);
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance
        this.setState({ account: accounts[0] })
        // Get the value from the contract to prove it worked.
        console.log(this.state.account)
        this.getList();
        return this.simpleStorageInstance.get.call(accounts[0])
        }).then((ipfsHash) => {
        return this.setState({ ipfsHash })
      })
    })
  }

validateUser(event){
    event.preventDefault()
    this.setState({ ipfsHash: this.refs.prooftovalidate.value })
        this.simpleStorageInstance.getUser.call(this.refs.prooftovalidate.value).then(
          data => {
            var proofowner = data;
            //Update ProofOwner validator
            this.setState({ proofOwner: proofowner })
        this.simpleStorageInstance.getIndex.call(this.refs.prooftovalidate.value).then(
          data2 => {
            var index = data2.toNumber();
            console.log(data2.toNumber());
            this.simpleStorageInstance.getTimeStamp.call(index).then(
              data3 => {
                console.log(data3.toNumber());
                this.setState({filedate:this.timeConverter(data3.toNumber())})
              }
            );
          }
        );
                }
        );
}

  render() {
 
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Proof ownership Verification</h1>
            <p><strong>Hello {this.props.authData.name}!</strong> Here is the section for verifying the ownership of a proof</p>
          </div>
        </div>
        {this.state.willShowLoader == true &&
                    <h2>Currently loading</h2>
                }
         <div className="verify_proof">
              <input id="prooftovalidate" ref="prooftovalidate" type="text" />
              <input  type="button"
              value="Verify the proof"
              onClick={this.validateUser}/>
            <div className="gallery">
              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} width="300" height="200"/>
            </div>
            <p>Owner of the proof : {this.state.proofOwner}</p>
            <p>Time when the proof was uploaded : {this.state.filedate}</p>
        </div>
      </main>
    )
  }
}

export default Verif
