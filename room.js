import {
  loadRooms,
  connected,
  setupNetwork,
  contractInterface,
  contractAddress,
  joinRoom
} from './blockchain.js'
import {
  html,
  render,
  Component
} from 'https://unpkg.com/htm/preact/standalone.module.js'
// import Game from './gameBoard.js'

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
    if (web3) {
      setupNetwork(1)

      // eslint-disable-next-line no-undef
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

  Square = async ({ value, onSquareClick }) =>  {
    return html`
    <button class="square" onClick={onSquareClick}>{value}</button>
`
    
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
  render({ room }) {
    return html`
    <Square style="display: grid; grid-template-columns: repeat(3, 1fr); width: 300px; height: 300px; margin: 0 auto; border: 2px solid black;">
    <Square style="border: 1px solid black;", value={squares[0]}></Square>
    <Square style="border: 1px solid black;", value={squares[1]}></Square>
    <Square style="border: 1px solid black;", value={squares[2]}></Square>
    <Square style="border: 1px solid black;", value={squares[3]}></Square>
    <Square style="border: 1px solid black;", value={squares[4]}></Square>
    <Square style="border: 1px solid black;", value={squares[5]}></Square>
    <Square style="border: 1px solid black;", value={squares[6]}></Square>
    <Square style="border: 1px solid black;" value={squares[7]}></Square>
    <Square style="border: 1px solid black;" value={squares[8]}></Square>
  </Square>
  <Board></Board>
    `
  }
}

render(html`<${App} />`, document.body)
