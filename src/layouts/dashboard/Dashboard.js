import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Link } from 'react-router'
import SimpleStorageContract from './../../../build/contracts/SimpleStorage.json'
import ipfs from './../../util/ipfs.js'
import getWeb3 from './../../util/getWeb3.js'


      var numbers = [1, 2, 3, 4, 5];

class Popup extends React.Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{this.props.text}</h1>
          <img src="https://loading.io/spinners/hairball/lg.hairball-spiral-ajax-loader.gif"/>
        <p onClick={this.props.closePopup}>Click here for closing this window</p>
        </div>
      </div>
    );
  }
}

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    this.Items =[{}];
    this.TagItems =[{}];
    //testing to mount ipfs
    this.state ={
      willShowLoader: false,
      willShowAddProof: false,
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
    this.state = {
      showPopup: false
    };
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getList = this.getList.bind(this);
    this.displayList = this.displayList.bind(this);
    this.fill_map = this.fill_map.bind(this);
    //this.validateUser = this.validateUser.bind(this);
    this.retrieve_tags = this.retrieve_tags.bind(this);
    this.displayAddProof = this.displayAddProof.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
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


componentDidMount() {
    window.addEventListener('load', this.handleLoad);
 }

 handleLoad() {
  console.log("hello3");
  this.getList();
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

  captureFile(event){
    console.log('function launched')
    event.preventDefault()
    const file = event.target.files[0]
    console.log('file:', file)
    this.setState({ filename: file.name })
    this.setState({ filedate: file.lastModified })
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () =>{
      this.setState({buffer: Buffer(reader.result)})
      console.log('buffer', this.state.buffer)
    }
  }

onSubmit(event){
  event.preventDefault()
  this.setState({willShowLoader: true});
  this.togglePopup();
  ipfs.files.add(this.state.buffer,(error,result) => {
    if(error){
      console.error(error)
      return
    }
      //Making sure the lenght of the result is a ipfsHash
      if(result[0].hash.length==46){
      this.simpleStorageInstance.createProof(result[0].hash, this.state.filename, Date.now(), { from: this.state.account }).then((res) => {
      if(this.refs.tag1.value!=0){
      console.log("create tag");
      console.log(this.state.web3.toHex(this.refs.tag1.value));
      console.log(this.state.web3.toAscii(this.state.web3.toHex(this.refs.tag1.value)));
      this.simpleStorageInstance.associateTags(this.state.web3.toHex(this.refs.tag1.value),result[0].hash, { from: this.state.account });  
      }

        console.log('result', res)
        this.setState({willShowLoader:false})
        this.setState({willShowAddProof: false});
        this.togglePopup();
        //to improve: problem with the refresh. using a timeout function to load automatically the proofs
        setTimeout(
            function() {
                this.getList();
            }
            .bind(this),
            10000
        );
      })
      }
    })
}

displayAddProof() {
  this.setState({willShowAddProof: true});
 }

getList(){
//event.preventDefault()
  this.simpleStorageInstance.getProofsCount.call({ from: this.state.account }).then(
         data => {
            var ListProofs = data;
            //toNumber to make it readable by Javascript
            console.log("ListProofs");
            console.log(ListProofs.toNumber());
            this.setState({ totalproof: ListProofs.toNumber() })
            console.log("End ListProofs");
            //this.setState({totalproof:MachineList.toNumber()})
          }).then(
         data2 => {
            this.displayList();
            setTimeout(
            function() {
                this.getList2();
               // alert("timer working");
            }
            .bind(this),
            1000
        );
            })
}

getList2(){
//event.preventDefault()
  this.simpleStorageInstance.getProofsCount.call({ from: this.state.account }).then(
         data => {
            var ListProofs = data;
            this.setState({ totalproof: ListProofs.toNumber() })
          })
}

displayList(){
//  event.preventDefault()
  //for (var i = 1; i < this.state.totalproof+1; i++) {
    for (var i = 0; i < this.state.totalproof; i++) { 
      this.simpleStorageInstance.getProof.call(i, this.state.account, { from: this.state.account }).then(
         data => {
            var ListProofs = data;
            //toNumber to make it readable by Javascript
            console.log(data);
            console.log(i);
            console.log("Proof number :", ListProofs[0].toNumber());
            console.log("ipfsHash :", ListProofs[1]);
            console.log("image name :", ListProofs[2]);
            console.log("last Modified : ", ListProofs[3].toNumber());
            console.log("Owner : ", ListProofs[4]);
            console.log("msg.sender : ", ListProofs[5]);
            this.Items[ListProofs[0].toNumber()] = { ProofNumber: ListProofs[0].toNumber(), ipfsHash: ListProofs[1], imageName: ListProofs[2],lastModified: this.timeConverter(ListProofs[3].toNumber()),owner: ListProofs[4]};
            console.log("this item");
            console.log(this.Items[ListProofs[0].toNumber()]);
          })
  }
}

retrieve_tags(event){
    event.preventDefault();
        this.simpleStorageInstance.retrieveTags.call(this.state.web3.toHex(this.refs.tagtoretrieve.value)).then(
          data => {
            var listofimages = data;
            console.log(data.toNumber());
            this.setState({ tagproof: data.toNumber() })
            for (var i = 0; i < data.toNumber(); i++) {
                this.simpleStorageInstance.retrieveHashFromTag.call(this.state.web3.toHex(this.refs.tagtoretrieve.value),i).then(
              data2 => {
                      var TagProofs = data2;
                      this.TagItems[i] = data2;
                      console.log(data2);
                    })
            }
          }
        );
}

/*validateUser(event){
    event.preventDefault()
        this.simpleStorageInstance.getUser.call(this.refs.prooftovalidate.value).then(
          data => {
            var proofowner = data;
            //Update ProofOwner validator
            this.setState({ proofOwner: proofowner })
          }
        );
}*/

fill_map(event){
  event.preventDefault()
  this.simpleStorageInstance.fill_map.call().then(
         data => {
            var ListProofs = data;
            //toNumber to make it readable by Javascript
            console.log("ListProofs");
            console.log(ListProofs.toNumber());
            console.log("End ListProofs");
          })
}

  render() {
     const listItems = this.Items.map((Item, index) =>{
  return (
    <div className="gallery">
    <Link to={`/edittag/${Item.ipfsHash}`} className="addtag">Add a tag</Link>
    <a href={`/edittag/${Item.ipfsHash}`}>
      <img src={`https://ipfs.io/ipfs/${Item.ipfsHash}`} alt={Item.imageName} width="300" height="200"/>
    </a>
    <div className="desc">{Item.imageName} <br/> {Item.lastModified}</div>
    <div className="hashproof">
    <p>Hash of the proof :</p>
    <p> {Item.ipfsHash}</p>
    </div>
  </div>
    )
});

     const listTagItems = this.TagItems.map((TagItem, index) =>{
  return (
    <li key={index}><div><img src={`https://ipfs.io/ipfs/${TagItem}`} alt='' height='200' width='200'/> </div></li>
    )
});

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <p><strong>Congratulations {this.props.authData.name}!</strong> If you're seeing this page, you've logged in with UPort successfully.</p>
            <p>your account is number {this.state.account}</p>
          </div>
        </div>
        <div className="list_proof">
            <h1>Dashboard</h1>
            <h2>This is the list of all your proofs</h2>
            {this.state.totalproof == 0 &&
            <p>You have 0 proof at the moment</p>
            }
            {this.state.totalproof !== 0 &&
            <p>This is the list of your ${this.state.totalproof} proofs</p>
            }
                {this.state.totalproof !== 0 &&
                      <ul>
                      {listItems}
                      </ul>
                }
        </div>
          <div className="add_proof">
         <h1>You can add a proof here</h1>
            <div className="buttonProof">
                <button onClick={this.displayAddProof}>
                    Add a Proof
                </button>
           </div>
         {this.state.willShowAddProof == true &&
            <form onSubmit={this.onSubmit}>
              <input type="file" onChange={this.captureFile}/>
              <p>Choose how you want to tag this picture</p>
              <p><label>Tag 1 : </label><input type="text" ref="tag1" maxLength="60"/></p>
              <input type="submit"/>
            </form>
          }  
        </div>
        {this.state.showPopup ? 
          <Popup
            text='Please wait for MetaMask message.'
            closePopup={this.togglePopup}
          />
          : null
        }
      </main>
    )
  }
}

export default Dashboard
