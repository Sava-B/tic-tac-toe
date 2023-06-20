import Web3 from 'https://cdn.esm.sh/v58/web3@1.6.1/es2021/web3.js'

export async function connected() {
  if (typeof web3 === 'undefined') {
    alert(
      "You don't have Wallet Extension in browser. Please install it and reload the page. You'll need to use a desktop computer."
    )
  }

  if (window.ethereum) {
    const web3 = await new Web3(window.web3.currentProvider)
    await window.web3.currentProvider.enable()
    return web3
  }

  return false
}

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

export async function setupNetwork(web3, networkId) {
  const network = networks[networkId]
  console.log('Network', network)

  if (window.ethereum.networkVersion !== network.chainId) {
    network.chainId = web3.utils.toHex(network.chainId)
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [network]
      })
    } catch { }

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }]
    })
  }
}

export const contractAddress = '0xeb8b115f634a1ded8c68c0466c1a36f0a9bda2da'

export const contractInterface = '[ { "inputs": [], "name": "GameIsFinished", "type": "error" }, { "inputs": [], "name": "NotYourTurn", "type": "error" }, { "inputs": [], "name": "PlayerXHasntJoined", "type": "error" }, { "inputs": [], "name": "RoomDoesntExist", "type": "error" }, { "inputs": [], "name": "SquareIsTaken", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "roomNumber", "type": "uint256" } ], "name": "RoomCreation", "type": "event" }, { "inputs": [], "name": "createRoom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "roomNumber", "type": "uint256" } ], "name": "getBoard", "outputs": [ { "internalType": "int8[9]", "name": "", "type": "int8[9]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint8", "name": "roomIndex", "type": "uint8" } ], "name": "hasWinner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "roomNumber", "type": "uint256" } ], "name": "joinRoom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint8", "name": "index", "type": "uint8" }, { "internalType": "uint256", "name": "roomNumber", "type": "uint256" } ], "name": "makeMove", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "rooms", "outputs": [ { "internalType": "address", "name": "currentPlayer", "type": "address" }, { "internalType": "address", "name": "playerO", "type": "address" }, { "internalType": "address", "name": "playerX", "type": "address" }, { "internalType": "address", "name": "winner", "type": "address" }, { "internalType": "bool", "name": "isGameFinished", "type": "bool" }, { "internalType": "uint8", "name": "movesMade", "type": "uint8" } ], "stateMutability": "view", "type": "function" } ]'

function getRoom(contract, number) {
  return contract.methods.rooms(number).call()
}

export async function loadRooms(contract) {
  const rooms = []
  for (let i = 0; i < Infinity; i++) {
    try {
      const room = await getRoom(contract, i)
      console.log(room)
      room.id = i
      rooms.push(room)
    } catch (e) {
      console.log(e)
      break
    }
  }
  return rooms
}

export function createRoom(contract, accounts) {
  return contract.methods
    .createRoom()
    .send({ from: accounts[0] })
}

export function joinRoom(contract, accounts, roomId) {
  return contract.methods
    .joinRoom(roomId)
    .send({ from: accounts[0] })
}

export function getBoard(contract, accounts, roomId) {
  return contract.methods.getBoard(roomId).call({ from: accounts[0] })
}

export function hasWinner(contract, accounts, roomId) {
  return contract.methods.hasWinner(roomId)
    .call({ from: accounts[0] })
}

export function makeMove(contract, accounts, squareIndex, roomNumber) {
  return contract.methods
    .makeMove(squareIndex, roomNumber)
    .send({ from: accounts[0] })
}
