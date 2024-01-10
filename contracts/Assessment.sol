// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint256 _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert
                InsufficientBalance({
                    balance: balance,
                    withdrawAmount: _withdrawAmount
                });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    // Trigonometric function - Sine
function sin(uint256 _angleInDegrees) public pure returns (int256) {
    // Convert degrees to radians
    int256 angleInRadians = (int256(_angleInDegrees) * int256(314159)) / int256(180000);

    // Calculate sine using a basic series expansion
    int256 result = angleInRadians;
    int256 term = angleInRadians;

    for (uint256 i = 1; i <= 10; i++) {
        term = (term * angleInRadians * angleInRadians) / int256((2 * i) * (2 * i + 1));
        if (i % 2 == 0) {
            result += term;
        } else {
            result -= term;
        }
    }

    return result;
}


    // Exponential function
    function exp(uint256 _power) public pure returns (uint256) {
        // Calculate e^x using a basic series expansion
        uint256 result = 1;
        uint256 term = 1;

        for (uint256 i = 1; i <= 10; i++) {
            term = (term * _power) / i;
            result += term;
        }

        return result;
    }
}
