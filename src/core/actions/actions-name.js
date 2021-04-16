import constants   from 'core/types'
import contract    from 'truffle-contract'
import HashArtDapp from 'contracts/hashartERC1155.json'

export function checkIfNameExists(name) {
  return (dispatch, getState) => {
    const { web3Provider } = getState().provider
    const HashArtDappContract = contract(HashArtDapp)

    HashArtDappContract.setProvider(web3Provider.currentProvider)
    HashArtDappContract.defaults({ from: web3Provider.eth.defaultAccount })
    // alert(HashArtDapp.contractName)

    return new Promise((resolve, reject) => {
      HashArtDappContract.deployed().then((ad) => {
        return ad.exists(name)
      }).then((result) => {
        resolve(result)
        reject(new Error('Error message!', result))
      })
    })
      .then((result) => {
        // debugger
        dispatch((() => {
          return {
            type: constants.CHECK_IF_NAME_EXISTS,
            result
          }
        })())
      })
      .catch((error) => {
        console.log('error: ', error)
      })
  }
}
