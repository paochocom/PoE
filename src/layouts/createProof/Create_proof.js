import React, { Component } from 'react'
import SimpleStorageContract from './../../../build/contracts/SimpleStorage.json'
import ipfs from './../../util/ipfs.js'
import getWeb3 from './../../util/getWeb3.js'


      var numbers = [1, 2, 3, 4, 5];

class Create_proof extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    this.Items =[{}];
    this.TagItems =[{}];
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
      proofOwner :''
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getList = this.getList.bind(this);
    this.displayList = this.displayList.bind(this);
    this.fill_map = this.fill_map.bind(this);
    this.validateUser = this.validateUser.bind(this);
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
        this.getList();
        return this.simpleStorageInstance.get.call(accounts[0])
        }).then((ipfsHash) => {
        //If contract instantiate properly, we get the number of proof of the user
       // this.simpleStorageInstance.fill_map.call(this.state.account).then(
       //   data => {
       //     var MachineList = data;
            //toNumber to make it readable by Javascript
       //     console.log(MachineList.toNumber());
       //     this.setState({totalproof:MachineList.toNumber()})
       //   }
          //Get the proofList in an array
      ///      this.simpleStorageInstance.getProofs.call(this.state.account).then(
      ///          (data2) => {
      ///            var ProofArray = data2;
      ///            console.log("array return");
      ///            console.log(ProofArray);
      ///            console.log("end of array return");
      ///          }
      ///        )

  //)
        // Update state with the result.
       // console.log()

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
  ipfs.files.add(this.state.buffer,(error,result) => {
    if(error){
      console.error(error)
      return
    }
      //this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
      //  return this.setState({ ipfsHash: result[0].hash })
      //  console.log('ifpsHash', this.state.ipfsHash)
      //})
      //console.log(file);
      this.simpleStorageInstance.createProof(result[0].hash, this.state.filename, this.state.filedate, { from: this.state.account }).then((res) => {
      if(this.refs.tag1.value!=0){
      console.log("create tag");
      console.log(this.state.web3.toHex(this.refs.tag1.value));
      console.log(this.state.web3.toAscii(this.state.web3.toHex(this.refs.tag1.value)));
      this.simpleStorageInstance.associateTags(this.state.web3.toHex(this.refs.tag1.value),result[0].hash, { from: this.state.account });  
      }
        console.log('result', res)
        this.setState({willShowLoader:false})
        //to improe: problem with the refresh
        setTimeout(
            function() {
                this.getList();
            }
            .bind(this),
            10000
        );
      })
    })
}


getList(){
//event.preventDefault()
  this.simpleStorageInstance.getProofsCount.call().then(
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
                alert("timer working");
            }
            .bind(this),
            10000
        );
            })
}

getList2(){
//event.preventDefault()
  this.simpleStorageInstance.getProofsCount.call().then(
         data => {
            var ListProofs = data;
            //toNumber to make it readable by Javascript
            console.log("ListProofs");
            console.log(ListProofs.toNumber());
            this.setState({ totalproof: ListProofs.toNumber() })
            console.log("End ListProofs");
            //this.setState({totalproof:MachineList.toNumber()})
          })
}

displayList(){
//  event.preventDefault()
  for (var i = 1; i < this.state.totalproof+1; i++) {
      this.simpleStorageInstance.getProof.call(i).then(
         data => {
            var ListProofs = data;
            //toNumber to make it readable by Javascript
            console.log(i);
            console.log("Proof number :", ListProofs[0].toNumber());
            console.log("ipfsHash :", ListProofs[1]);
            console.log("image name :", ListProofs[2]);
            //numbers.push(ListProofs[2]);
            console.log("last Modified : ", ListProofs[3].toNumber());
            console.log("Owner : ", ListProofs[4]);
            this.Items[ListProofs[0].toNumber()] = { ProofNumber: ListProofs[0].toNumber(), ipfsHash: ListProofs[1], imageName: ListProofs[2],lastModified: ListProofs[3].toNumber(),owner: ListProofs[4]};
            //console.log(ListProofs);
            console.log("this item");
            console.log(this.Items[ListProofs[0].toNumber()]);
            //this.setState({totalproof:MachineList.toNumber()})
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
           // this.simpleStorageInstance.retrieveHashFromTag.call(this.state.web3.toHex(this.refs.tagtoretrieve.value),1).then(
           //   data2 => {
           //     console.log(data2);
           //   });
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

validateUser(event){
    event.preventDefault()
        this.simpleStorageInstance.getUser.call(this.refs.prooftovalidate.value).then(
          data => {
            var proofowner = data;
            //Update ProofOwner validator
            this.setState({ proofOwner: proofowner })
          }
        );
}

fill_map(event){
  event.preventDefault()
  this.simpleStorageInstance.fill_map.call().then(
         data => {
            var ListProofs = data;
            //toNumber to make it readable by Javascript
            console.log("ListProofs");
            console.log(ListProofs.toNumber());
            console.log("End ListProofs");
            //this.setState({totalproof:MachineList.toNumber()})
          })
}

  render() {
     const listItems = this.Items.map((Item, index) =>{
  return (
    <li key={index}><div><img src={`https://ipfs.io/ipfs/${Item.ipfsHash}`} alt='' height='200' width='200'/>{Item.imageName} - {Item.lastModified} </div></li>
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
            <h1>Dashboard</h1>
            <p><strong>Congratulations {this.props.authData.name}!</strong> If you're seeing this page, you've logged in with UPort successfully.</p>
          </div>
        </div>
        {this.state.willShowLoader == true &&
                    <h2>Currently loading</h2>
                }
         <div className="add_proof">
            <form onSubmit={this.onSubmit}>
              <input type="file" onChange={this.captureFile}/>
              <p>Choose how you want to tag this picture</p>
              <input type="text" ref="tag1"/>
              <input type="text" ref="tag2"/>
              <input type="text" ref="tag3"/>
              <input type="submit"/>
            </form>
            <p>this is your proof of existence</p>
            <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=''/>
        </div>
        <div className="list_proof">
            <button onClick={this.getList}>
                    getList
            </button>
            <button onClick={this.displayList}>
                    Display my proofs
            </button>
            <button onClick={this.fill_map}>
                    fill map
            </button>
            <h2>This is the list of all your proofs</h2>
            <p>you have ${this.state.totalproof} proof</p>
                {this.state.totalproof !== 0 &&
                    <ul>
                      {listItems}
                    </ul>
                }
        </div>
         <div className="verify_proof">
              <input id="prooftovalidate" ref="prooftovalidate" type="text" />
              <input  type="button"
              value="Verify the proof"
              onClick={this.validateUser}/>
            <p>here's the owner of the proof</p>
            <p>${this.state.proofOwner}</p>
        </div>
          <div className="retrieve_tags">
              <input id="tagtoretrieve" ref="tagtoretrieve" type="text" />
              <input  type="button"
              value="Search"
              onClick={this.retrieve_tags}/>
            <p>here's the different proofs</p>
             <p>you have ${this.state.tagproof} proof</p>
                {this.state.tagproof !== 0 &&
                    <ul>
                      {listTagItems}
                    </ul>
                }
        </div>
      </main>
    )
  }
}

export default Create_proof
