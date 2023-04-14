import Web3 from 'https://cdn.esm.sh/v58/web3@1.6.1/es2021/web3.js'

export async function connected () {
  if (typeof web3 === 'undefined') {
    alert(
      "You don't have Wallet Extension in browser. Please install it and reload the page. You'll need to use a desktop computer."
    )
  }

  if (window.web3) {
    const web3 = await new Web3(window.web3.currentProvider)
    await window.web3.currentProvider.enable()
    return web3
  }

  return false
};

const networks = [
  {
    chainName: 'BNB Smart Chain',
    chainId: 56,
    nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
    rpcUrls: ['https://bsc-dataseed.binance.org/']
  },
  {
    chainName: 'BNB Smart Chain Testnet',
    chainId: 97,
    nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/']
  },
  {
    chainName: 'Polygon',
    chainId: 137,
    nativeCurrency: { name: 'Polygon', decimals: 18, symbol: 'MATIC' },
    rpcUrls: ['https://polygon-rpc.com/']
  },
  {
    chainName: 'Polygon Testnet',
    chainId: 80001,
    nativeCurrency: { name: 'Polygon', decimals: 18, symbol: 'MATIC' },
    rpcUrls: ['https://rpc-mumbai.matic.today']
  }
]

export async function setupNetwork (networkId) {
  const network = networks[networkId]
  const success = await connected()
  console.log(success)

  if (window.ethereum.networkVersion !== network.chainId) {
    network.chainId = window.web3.utils.toHex(network.chainId)
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          network
        ]
      })
    } catch { }

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }]
    })
  }
}

export const contractAddress = '0xa9C46541383fA83cb3f60c1441896C564bebfF65'

export const contractInterface = '[{"inputs":[],"name":"createRoom","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"statfbility":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"roomNumber","type":"uint256"}],"name":"joinRoom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"index","type":"uint8"},{"internalType":"uint256","name":"roomNumber","type":"uint256"}],"name":"makeMove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint8","name":"roomIndex","type":"uint8"}],"name":"hasWinner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"rooms","outputs":[{"internalType":"address","name":"currentPlayer","type":"address"},{"internalType":"address","name":"playerO","type":"address"},{"internalType":"address","name":"playerX","type":"address"},{"internalType":"address","name":"winner","type":"address"},{"internalType":"bool","name":"isGameFinished","type":"bool"}],"stateMutability":"view","type":"function"}]'

async function getRoom (contract, number) {
  return contract.methods.rooms(number).call()
}

export async function loadRooms (contract) {
  const rooms = []
  for (let i = 0; i < Infinity; i++) {
    console.log(i)
    try {
      const room = await getRoom(contract, i)
      room.id = i
      console.log(room)
      rooms.push(room)
    } catch (e) {
      console.log(e)
      break
    }
  }
  return rooms
}

export async function createRoom (contract, accounts) {
  contract.methods.createRoom().send({ from: accounts[0] })
    .on('receipt', (receipt) => {
      console.log(receipt.events.returnValues)
    })
    .on('error', (error) => {
      console.log(error)
    })
}
