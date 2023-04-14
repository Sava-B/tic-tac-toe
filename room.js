import {
  loadRoom,
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

class App extends Component {
  state = {
    room: {},
    blockchain: {
      accounts: [],
      contract: null
    }
  }

  async componentDidMount () {
    // check metamask connection (connect if needed)
    const web3 = await connected()
    if (web3) {
      setupNetwork(1)

      // eslint-disable-next-line no-undef
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      const contract = new web3.eth.Contract(JSON.parse(contractInterface), contractAddress)

      // get the room number from the URL
      const roomId = window.location.hash.replace('#', '')
      if (roomId === '') {
        return
      }

      // get rooms from the smart contract
      const rooms = await loadRoom(contract)
      console.log(rooms)

      // set state
      this.setState({ rooms, blockchain: { accounts, contract } })
    }
  }

  // <button class="btn btn-primary" onclick=${this.joinRoom}>Join Room</button>

  joinRoom = async () => {
    const { blockchain: { accounts, contract } } = this.state
    await joinRoom(contract, accounts)
    const room = await loadRoom(contract)
    this.setState({ room })
  }

  render (_, { room }) {
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
  render ({ room }) {
    return html`
        <div class="board">
            <div class="row">
            <div class="col-4"></div>
            <div class="col-4"></div>
            <div class="col-4"></div>
            </div>
            <div class="row">
            <div class="col-4"></div>
            <div class="col-4"></div>
            <div class="col-4"></div>
            </div>
            <div class="row">
            <div class="col-4"></div>
            <div class="col-4"></div>
            <div class="col-4"></div>
            </div>
        </div>
        `
  }
}

render(html`<${App}/>`, document.body)
