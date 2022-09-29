// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract TicTacToe {
    constructor() {
        createWinningCases();
    }

    WinningCase[] private winningCases;

    struct WinningCase {
        uint firstIndex;
        uint secondIndex;
        uint thirdIndex;
    }

    function createWinningCases() private {
        WinningCase memory case1 = WinningCase(0, 1, 2);
        WinningCase memory case2 = WinningCase(3, 4, 5);
        WinningCase memory case3 = WinningCase(6, 7, 8);
        WinningCase memory case4 = WinningCase(0, 3, 6);
        WinningCase memory case5 = WinningCase(1, 4, 7);
        WinningCase memory case6 = WinningCase(2, 5, 8);
        WinningCase memory case7 = WinningCase(0, 4, 8);
        WinningCase memory case8 = WinningCase(2, 4, 6);
        winningCases.push(case1);
        winningCases.push(case2);
        winningCases.push(case3);
        winningCases.push(case4);
        winningCases.push(case5);
        winningCases.push(case6);
        winningCases.push(case7);
        winningCases.push(case8);
    }

    struct Room {
        address currentPlayer;
        address playerO;
        address playerX;
        int8[9] board;
        address winner;
    }
    Room[] public rooms; // contract.methods.rooms() -> []Room

    int8 private constant EMPTY_MOVE = 3;
    int8 private constant O_MOVE = 0;
    int8 private constant X_MOVE = 1;

    int8[9] private emptyBoard = [EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE];

    function createRoom() public {
        int8[9] memory board = int8[9](emptyBoard);
        Room memory room = Room(msg.sender, msg.sender, address(0), board, address(0));
        rooms.push(room);
    }

    function joinRoom(uint256 roomNumber) public {
        rooms[roomNumber].playerX = msg.sender;
    }

    function hasWinner(uint8 roomIndex) private returns (bool) {
        for (uint i = 0; i < winningCases.length; i++) {
            WinningCase memory currentCase = winningCases[i];
            uint firstIndex = currentCase.firstIndex;
            uint secondIndex = currentCase.secondIndex;
            uint thirdIndex = currentCase.thirdIndex;
            if (rooms[roomIndex].board[firstIndex] == rooms[roomIndex].board[secondIndex] 
            && rooms[roomIndex].board[secondIndex] == rooms[roomIndex].board[thirdIndex] 
            && rooms[roomIndex].board[firstIndex] != EMPTY_MOVE) {
                rooms[roomIndex].winner;
                return true;
            }
        }
        return false;
    }

    function getWinnerAddress() private view returns (address winner) {
        return winnerCase.firstIndex == 0 ? playerO : playerX;
    }
    
    function isBoardFull(int8[9] board) private view returns (bool) {
        for (uint i = 0; i < board.length ; i++){
            if (board[i] == EMPTY_MOVE){
                return false;
            }
        }
        return true;
    }

    function makeMove(uint8 index, uint256 roomNumber) public {
        require(rooms.length == (index-1), "The room with corresponding number doesn't exist.");
        require(rooms[roomNumber].playerX != address(0), "Player X hasn't joined yet.");        
        require(rooms[roomNumber].currentPlayer == msg.sender, "It's not your turn.");
        require(rooms[roomNumber].board[index] == EMPTY_MOVE, "This square is taken.");
        require(isBoardFull(rooms[roomNumber].board), "The board is full, game's finished.");      

        if (msg.sender == rooms[roomNumber].playerX) {
            rooms[roomNumber].board[index] = X_MOVE;
        } else {
            rooms[roomNumber].board[index] = O_MOVE;
        }
    }
} 
