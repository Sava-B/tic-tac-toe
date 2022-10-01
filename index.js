const address = '0xE3e86D75639Df779416cA16f264ffA7fbe68775f';
const interface = [{"inputs":[],"name":"createRoom","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"roomNumber","type":"uint256"}],"name":"joinRoom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"index","type":"uint8"},{"internalType":"uint256","name":"roomNumber","type":"uint256"}],"name":"makeMove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint8","name":"roomIndex","type":"uint8"}],"name":"hasWinner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"rooms","outputs":[{"internalType":"address","name":"currentPlayer","type":"address"},{"internalType":"address","name":"playerO","type":"address"},{"internalType":"address","name":"playerX","type":"address"},{"internalType":"address","name":"winner","type":"address"},{"internalType":"bool","name":"isGameFinished","type":"bool"}],"stateMutability":"view","type":"function"}]

const web3 = new Web3('https://goerli.infura.io/v3/');
console.log('hey');

const contract = new web3.eth.Contract(interface, address);

async function getRoom(contract, room) {
    return contract.methods.rooms(room).call();
}

console.log(await getRoom(contract, 0));