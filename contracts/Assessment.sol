// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    mapping(address => uint256) public investments;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event Swap(address indexed fromCurrency, address indexed toCurrency, uint256 amount);
    event AutoInvest(uint256 amount);
    event SellUSDT(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function deposit(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        balance += _amount;
        emit Deposit(_amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        if (balance < _withdrawAmount) {
            revert InsufficientBalance(balance, _withdrawAmount);
        }
        balance -= _withdrawAmount;
        emit Withdraw(_withdrawAmount);
    }

    function swapCurrency(address _fromCurrency, address _toCurrency, uint256 _amount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(_fromCurrency != _toCurrency, "Cannot swap the same currency");
        require(balance >= _amount, "Insufficient balance for swapping");

        balance -= _amount;
        balance += _amount;

        emit Swap(_fromCurrency, _toCurrency, _amount);
    }

    function autoInvest() public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(balance > 0, "No balance available for auto-investing");

        investments[msg.sender] += balance;
        balance = 0;

        emit AutoInvest(balance);
    }

    function sellUSDT(uint256 _amount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(balance >= _amount, "Insufficient USDT balance for selling");

        balance -= _amount;

        emit SellUSDT(_amount);
    }
}
