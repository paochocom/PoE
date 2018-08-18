import { Connect, SimpleSigner } from 'uport-connect'

export let uport = new Connect('PoE Consensys Academy', {
      clientId: '2opm9kSBHVKBowtE24Jh1iJ5jxcYo1JFHfX',
      network: 'rinkeby',
      signer: SimpleSigner('62e8e578da2df68a1277df9c4e446839595ae3a5257666bdf963595365e44407')
    })


//export let uport = new Connect('TruffleBox')
export const web3 = uport.getWeb3()