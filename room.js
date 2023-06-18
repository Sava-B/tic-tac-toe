import {
  loadRooms,
  connected,
  setupNetwork,
  contractInterface,
  contractAddress,
  getBoard,
  makeMove,
  joinRoom
} from './blockchain.js'
import {
  html,
  render,
  Component
} from 'https://unpkg.com/htm/preact/standalone.module.js'

class App extends Component {
  state = {
    room: {
      board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      currentPlayer: null,
      playerO: null,
      playerX: null,
      winner: null,
      isGameFinished: false,
      id: null
    },
    blockchain: {
      accounts: [],
      contract: null
    }
  }

  async componentDidMount() {
    const web3 = await connected()
    if (web3) {
      setupNetwork(web3, 1)

      // eslint-disable-next-line no-undef
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      const contract = new web3.eth.Contract(JSON.parse(contractInterface), contractAddress)

      const roomId = window.location.hash.replace('#', '')
      if (roomId === '') {
        alert('Room is Empty!')
        return
      }

      const rooms = await loadRooms(contract)
      console.log('Rooms', rooms)
      const room = rooms[roomId]
      const board = await getBoard(contract, accounts, roomId)

      this.setState({ room, blockchain: { accounts, contract } })
      this.setState({ room: { ...room, board } })
    }
  }

  makeMove = async (squareIndex) => {
    const { blockchain: { accounts, contract } } = this.state
    await makeMove(contract, accounts, squareIndex, window.location.hash.replace('#', ''))
    const rooms = await loadRooms(contract)
    this.setState({ rooms })
  }

  joinRoom = async () => {
    const { blockchain: { accounts, contract } } = this.state
    await joinRoom(contract, accounts, window.location.hash.replace('#', ''))
    const rooms = await loadRooms(contract)
    this.setState({ rooms })
  }

  render(_, { room, blockchain: { accounts } }) {
    console.log('Room', JSON.stringify(room, null, 2))

    return html`
      <div class="container p-1">
        <header class="mb-4">
          <h1>Blockchained Tic-Tac-Toe</h1>
        </header>

        <h2>Room: ${window.location.hash.replace('#', '')}</h2>
        <p>${room.playerO} v. ${room.playerX}</p>
        ${room.playerO === '0x0000000000000000000000000000000000000000'
        ? html`
            <button class="btn btn-primary mb-3" onclick=${this.joinRoom}>Join Room</button>
          `
        : ''
      }
        ${room.playerX === '0x0000000000000000000000000000000000000000'
        ? html`
            <button class="btn btn-primary mb-3" onclick=${this.joinRoom}>Join Room</button>
          `
        : ''
      }

        <div
          style="display: grid; grid-template-columns: repeat(3, 1fr); width: 300px; height: 300px; margin: 0 auto; border: 2px solid black;"
        >
        ${room.board.map((move, index) => html`
            <div
              style="border: 1px solid black; text-align: center; font-size: 3rem; line-height: 90px;"
              onClick=${() => {
          console.log(room)
          if (room.currentPlayer.toLowerCase() === accounts[0]) {
            this.makeMove(index)
            // TODO: disable click
            // TODO: update board
          }
        }}
            >${move === '3'
          ? ''
          : move === '0'
            ? 'O'
            : move === '1'
              ? 'X'
              : ''
        }</div>
          `)
      }
        </div>
      </div>
    `
  }
}

render(html`<${App} />`, document.body)
