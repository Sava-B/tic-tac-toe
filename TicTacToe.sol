// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicTacToe {
    int8 private constant EMPTY_MOVE = 0;
    int8 private constant O_MOVE = 1;
    int8 private constant X_MOVE = 2;

    struct Room {
        address currentPlayer;
        address playerO;
        address playerX;
        int8[9] board;
        address winner;
        bool isGameFinished;
        uint8 movesMade;
    }

    uint8[3][8] private winningCases = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    Room[] public rooms; // contract.methods.rooms() -> []Room

    event RoomCreation(uint256 roomNumber);

    error RoomDoesntExist();
    error PlayerXHasntJoined();
    error NotYourTurn();
    error SquareIsTaken();
    error GameIsFinished();

    function createRoom() public {
        Room memory room = Room(
            msg.sender,
            msg.sender,
            address(0),
            [int8(0), 0, 0, 0, 0, 0, 0, 0, 0],
            address(0),
            false,
            0
        );
        rooms.push(room);
        emit RoomCreation(rooms.length - 1);
    }

    function joinRoom(uint256 roomNumber) public {
        rooms[roomNumber].playerX = msg.sender;
    }

//     function getSources(uint transactionId) external returns (uint[] memory sources) {
//       sources = transactions[transactionId].sources; // In case you have array of transactions
//     }

    function getBoard(uint256 roomNumber) public view returns (int8[9] memory) {
        return rooms[roomNumber].board;
    }

    function hasWinner(uint8 roomIndex) public view returns (address) {
        for (uint32 i = 0; i < winningCases.length; i++) {
            uint8[3] memory currentCase = winningCases[i];
            uint firstIndex = currentCase[0];
            uint secondIndex = currentCase[1];
            uint thirdIndex = currentCase[2];

            Room memory room = rooms[roomIndex];

            if (
                room.board[firstIndex] != EMPTY_MOVE &&
                room.board[firstIndex] ==
                room.board[secondIndex] &&
                room.board[secondIndex] ==
                room.board[thirdIndex]
            ) {
                if (firstIndex == 0) {
                    return room.playerO;
                }
                return room.playerX;
            }
        }
        return address(0);
    }

    function makeMove(uint8 index, uint256 roomNumber) public {
        Room storage room = rooms[roomNumber];

        if (room.playerO == address(0)) revert RoomDoesntExist();
        if (room.playerX == address(0)) revert PlayerXHasntJoined();
        if (room.currentPlayer != msg.sender) revert NotYourTurn();
        if (room.board[index] != EMPTY_MOVE) revert SquareIsTaken();
        if (room.isGameFinished) revert GameIsFinished();

        if (msg.sender == rooms[roomNumber].playerX) {
            room.board[index] = X_MOVE;
            room.currentPlayer = room.playerO;
        } else {
            room.board[index] = O_MOVE;
            room.currentPlayer = room.playerX;
        }

        room.movesMade++;

        address winner = hasWinner(index);
        if (winner != address(0)) {
            room.isGameFinished = true;
            room.winner = winner;
        /// @dev 9 is the maximum number of moves for a 3 by 3 square
        } else if (room.movesMade == 9) {
            room.isGameFinished = true;
        }
    }
}
