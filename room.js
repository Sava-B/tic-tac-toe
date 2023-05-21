import {
  loadRooms,
  connected,
  setupNetwork,
  contractInterface,
  contractAddress,
  joinRoom,
  hasWinner,
  makeMove,
  isBoardFull
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
    if (web3) {
      setupNetwork(1)

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      const contract = new web3.eth.Contract(
        JSON.parse(contractInterface),
        contractAddress
      )
      console.log('contract: ', contract)
      console.log('Contract.Methods: ', await contract.methods.hasWinner(0).call((err, result) => { return result }))

      // get the room number from the URL
      const roomId = window.location.hash.replace('#', '')
      console.log('roomId: ', roomId)
      if (roomId === '') {
        alert('Room is Empty!')
        return
      }


      // get rooms from the smart contract
      const rooms = await loadRooms(contract)
      console.log(rooms)

      // set state
      this.setState({ rooms, blockchain: { accounts, contract } })
      console.log('State: ', this.state)
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
    console.log('Room:', room)

  }

  madeMove = async (moveIndex) => {
    const {
      blockchain: { accounts, contract }
    } = this.state
    const roomIndex = 0
    const squareIndex = 1

    console.log('this.state', this.state)
    // console.log('contract methods', contract.methods)

    await makeMove(contract, accounts, moveIndex, roomIndex)
  }

  render(_, { room }) {
    return html`
      <div class="container p-1">
        <header class="mb-4">
          <h1>Blockchained Tic-Tac-Toe</h1>
        </header>

        <${Board} madeMove=${this.madeMove} room=${room} />
      </div>
    `
  }
}

class Board extends Component {

  loadBoard() {
    const numSquares = 9
    return numSquares
  }

  handleClick = () => {
    console.log(room)
    madeMove(1)
  }

  // ${console.log(contract.methods)}
  render({ madeMove }, { room }) {
    return html`
    <h2> Room: ${window.location.hash.replace('#', '')}</h2>
    <h2>Number of squares: ${madeMove().index}</h2>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); width: 300px; height: 300px; margin: 0 auto; border: 2px solid black;">
      <div style="border: 1px solid black;" onClick=${() => {
        this.handleClick()
      }}></div>
      <div style="border: 1px solid black;" onClick=${() => {
        this.handleClick()
      }}></div>
      <div style="border: 1px solid black;" onClick=${() => {
        this.handleClick()
      }}></div>
      <div style="border: 1px solid black;" onClick=${() => {
        this.handleClick()
      }}></div>
      <div style="border: 1px solid black;" onClick=${() => {
        this.handleClick()
      }}></div>
      <div style="border: 1px solid black;" onClick=${() => {
        this.handleClick()
      }}></div>    
      <div style="border: 1px solid black;" onClick=${() => {
        this.handleClick()
      }}></div>
      <div style="border: 1px solid black;" onClick=${() => {
        this.handleClick()
      }}></div>
      <div style="border: 1px solid black;" onClick=${() => {
        this.handleClick()
      }}></div>
  </div>

`
  }
}

render(html`<${App}/>`, document.body)
