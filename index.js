import {
  loadRooms,
  connected,
  setupNetwork,
  contractInterface,
  contractAddress,
  createRoom
} from './blockchain.js'
import {
  html,
  render,
  Component
} from 'https://unpkg.com/htm/preact/standalone.module.js'

class App extends Component {
  state = {
    rooms: [],
    blockchain: {
      accounts: [],
      contract: null
    }
  }

  async componentDidMount () {
    // check metamask connection (connect if needed)
    const web3 = await connected()
    if (web3) {
      setupNetwork(web3, 1)

      // eslint-disable-next-line no-undef
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      const contract = new web3.eth.Contract(JSON.parse(contractInterface), contractAddress)

      // get rooms from the smart contract
      const rooms = await loadRooms(contract)
      console.log(rooms)

      // set state
      this.setState({ rooms, blockchain: { accounts, contract } })
    }
  }

  createRoom = async () => {
    const { blockchain: { accounts, contract } } = this.state
    await createRoom(contract, accounts)
    const rooms = await loadRooms(contract)
    this.setState({ rooms })
  }

  render (_, { rooms }) {
    return html`
      <div class="container p-1">
        <header class="mb-4">
            <h1>Blockchained Tic-Tac-Toe</h1>
            <button class="btn btn-primary" onclick=${this.createRoom}>Create Room</button>
        </header>

        <ul>
          ${rooms.map(room => html`
            <${Room}
              roomId=${room.id}
              playerO=${room.playerO}
              playerX=${room.playerX}
            />
          `)}
        </ul>
      </div>
      `
  }
}

const Room = ({ roomId, playerO, playerX }) => html`
  <li class="card shadow-sm m-2 p-2">
    <h2><a href="room.html#${roomId}">Room ${roomId}</a></h2>
    <p>Player O: ${playerO}</p>
    <p>Player X: ${playerX}</p>
  </li>
`

render(html`<${App}/>`, document.body)
