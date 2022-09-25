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
    }
    Room[] public rooms; // contract.methods.rooms() -> []Room

    int8 private constant EMPTY_MOVE = 3;
    int8 private constant O_MOVE = 0;
    int8 private constant X_MOVE = 1;

    int8[9] private emptyBoard = [EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE, EMPTY_MOVE];

    function createRoom() public {
        int8[9] memory board = int8[9](emptyBoard);
        Room memory room = Room(address(0), msg.sender, address(0), board);
        rooms.push(room);
    }

    function joinRoom(uint256 roomNumber) public {
        rooms[roomNumber].playerX = msg.sender;
    }

    function makeMove(uint8 index) public {
        
    }
}