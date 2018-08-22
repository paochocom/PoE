import React, { Component } from 'react'
import SimpleStorageContract from './../../../build/contracts/SimpleStorage.json'
import ipfs from './../../util/ipfs.js'
import getWeb3 from './../../util/getWeb3.js'

class Popup extends React.Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{this.props.text}</h1>
          <img href="https://loading.io/spinners/hairball/lg.hairball-spiral-ajax-loader.gif"/>
        <button onClick={this.props.closePopup}>close me</button>
        </div>
      </div>
    );
  }
}

class Tagsearch extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    this.Items =[{}];
    //this.TagItems =[{}];
    this.TagItems =[];
    //testing to mount ipfs
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
      proofOwner :'',
      listTag :'',
      testtag :[]
    }
    this.retrieve_tags = this.retrieve_tags.bind(this);
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
        return this.simpleStorageInstance.get.call(accounts[0])
        }).then((ipfsHash) => {
        return this.setState({ ipfsHash })
      })
    })
  }


retrieve_tags(event){
    event.preventDefault();
        this.simpleStorageInstance.retrieveTags.call(this.state.web3.toHex(this.refs.tagtoretrieve.value)).then(
          data => {
            var listofimages = data;
            console.log(data.toNumber());
            this.setState({ tagproof: data.toNumber() })
           // this.simpleStorageInstance.retrieveHashFromTag.call(this.state.web3.toHex(this.refs.tagtoretrieve.value),1).then(
           //   data2 => {
           //     console.log(data2);
           //   });
            for (var i = 0; i < data.toNumber(); i++) {
                this.simpleStorageInstance.retrieveHashFromTag.call(this.state.web3.toHex(this.refs.tagtoretrieve.value),i).then(
              data2 => {
//                      this.TagItems[i] = data2;
                      //this.TagItems[i] = { ipfsHash: data2};
                                  this.TagItems.push({ipfsHash: data2, test:"merde"});
                      console.log(data2);
                      //let displaylist = [];
                      //displaylist = this.state.listTag.concat(<img key={data2} src={"https://ipfs.io/ipfs/" + data2} alt='' height='200' width='200'/>);
                    //  console.log(displaylist);
                    //  var displaylist=this.state.listTag.concat(<img src={"https://ipfs.io/ipfs/" + data2} alt='' height='200' width='200'/>);
                    //    this.setState({ listTag: displaylist })
                    })
            }
//            console.log(window.displaylist);
          }
        );
}

  render() {
//proble with display frontend
//                {this.state.tagproof !== 0 &&
//                    {this.state.displaylist}
//                }
console.log("tagitems");
console.log(this.TagItems);
    const listTagItems = this.TagItems.map((TagItem, index) =>{
      console.log("listtagitems");
  console.log(listTagItems);
  return (
    <li key={index}><img src={`https://ipfs.io/ipfs/${TagItem.ipfsHash}`} alt='' height='200' width='200'/></li>
    )
});

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Tag Search Engine</h1>
            <p><strong>Greetings {this.props.authData.name}!</strong> This is the rudimentary search engine for tags. Type a tag and a list of associated pictures will be displayed below.</p>
          </div>
        </div>
        {this.state.willShowLoader == true &&
                    <h2>Currently loading</h2>
                }
          <div className="retrieve_tags">
              <form>
              <input id="tagtoretrieve" ref="tagtoretrieve" type="text" />
              <input  type="button"
              value="Search"
              onClick={this.retrieve_tags}/>
              </form>
            <p>here's the different proofs</p>
             <p>you have ${this.state.tagproof} proof</p>
              <h2>Here's the list of all the {this.state.tagproof} proofs associated with that tag : </h2>
                    <ul>{listTagItems}</ul>
        </div>
      </main>
    )
  }
}

export default Tagsearch
