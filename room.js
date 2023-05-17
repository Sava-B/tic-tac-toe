import {
  loadRooms,
  connected,
  setupNetwork,
  contractInterface,
  contractAddress,
  joinRoom,
  hasWinner,
  makeMove,
  isBoardFull,
  showBoard
} from './blockchain.js'
import {
  html,
  render,
  Component
} from 'https://unpkg.com/htm/preact/standalone.module.js'

class App extends Component {

  state = {
    room: {},
    blockchain: {
      accounts: [],
      contract: null
    }
  }


  async componentDidMount() {
    // check metamask connection (connect if needed)
    const web3 = await connected()
    console.log('the version of web3.js: ', web3.version)
    if (web3) {
      setupNetwork(1)

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      const contract = new web3.eth.Contract(
        JSON.parse(contractInterface),
        contractAddress
      )

      // get the room number from the URL
      const roomId = window.location.hash.replace('#', '')
      if (roomId === '') {
        return
      }

      // get rooms from the smart contract
      const rooms = await loadRooms(contract)
      console.log(rooms)

      // set state
      this.setState({ rooms, blockchain: { accounts, contract } })
    }
  }


  // <button class="btn btn-primary" onclick=${this.joinRoom}>Join Room</button>

  joinRoom = async () => {
    const {
      blockchain: { accounts, contract }
    } = this.state
    await joinRoom(contract, accounts)
    const room = await loadRooms(contract)
    this.setState({ room })
  }

  showBoard = async () => {
    const {
      blockchain: { accounts, contract }
    } = this.state
    await showBoard(contract, accounts)
  }

  render(_, { room }) {
    return html`
      <div class="container p-1">
        <header class="mb-4">
          <h1>Blockchained Tic-Tac-Toe</h1>
        </header>

        <${Board} room=${room} />
      </div>
    `
  }
}

class Board extends Component {
  loadBoard() {
    const numSquares = 9;
    return numSquares
  }

  render(_, { room }) {
    return html`
    <h2>Room: ${window.location.hash.replace('#', '')}</h2>
    <h2>Number of squares: ${showBoard(0).length}</h2>
    ${console.log(showBoard[0])}
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); width: 300px; height: 300px; margin: 0 auto; border: 2px solid black;">
    <div style="border: 1px solid black;"></div>
    <div style="border: 1px solid black;"></div>
    <div style="border: 1px solid black;"></div>
    <div style="border: 1px solid black;"></div>
    <div style="border: 1px solid black;"></div>
    <div style="border: 1px solid black;"></div>    
    <div style="border: 1px solid black;"></div>
    <div style="border: 1px solid black;"></div>
    <div style="border: 1px solid black;"></div>
  </div>
  <Board></Board>
    `
  }
}

render(html`<${App} />`, document.body)
