
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CreditInformation {

    // Owner of the contract
    address private manager;
    uint public testvar = 2;
    // Storing the credit info
    struct creditInfo {
        uint256 id;
        address ownerParty;
        uint256 creditsOwned;
        uint256 creditScore;
        bool isIndividual;
        uint256 totalAmountLended;
        uint256 totalAmountBorrowed;
        uint256 totalTransactions;
    }

    // Store the credit information of individuals and small businesses
    mapping(address => creditInfo) private partyToCreditInfo;

    // Authorized parties
    address[] private authorizedParties;

    // Example credit score calculation logic
    // Assign weight to different credit information
    uint256 totalAmountLendedWeight = 10;
    uint256 totalAmountBorrowedWeight = 5;
    uint256 totalTransactionsWeight = 1;
    uint256 creditsOwnedWeight = 2;

    constructor (){
        manager = msg.sender;
    }

    // Only owner modifier
    modifier onlyManager() {
        require(manager == msg.sender, "not owner");
        _;
    }

    // Add authorized parties
    function addAuthorizedParty(address _party) onlyManager public {
        authorizedParties.push(_party);
    }

    // Update credit information
    function updateCreditInfo(
        address _address,
        uint256 _id,
        uint256 _creditsOwned,
        bool _isIndividual,
        uint256 _totalAmountLended,
        uint256 _totalAmountBorrowed,
        uint256 _totalTransactions) public {
        require(isAuthorized(), "Unauthorized action");
        partyToCreditInfo[_address].id = _id;
        partyToCreditInfo[_address].creditScore = calculateCreditScore(partyToCreditInfo[_address].ownerParty);
        partyToCreditInfo[_address].creditsOwned = _creditsOwned;
        partyToCreditInfo[_address].isIndividual = _isIndividual;
        partyToCreditInfo[_address].totalAmountLended = _totalAmountLended;
        partyToCreditInfo[_address].totalAmountBorrowed = _totalAmountBorrowed;
        partyToCreditInfo[_address].totalTransactions = _totalTransactions;
        
    }

    // Access credit information
    function getCreditInfo(address _address) public view returns ( creditInfo memory) {
        require(isAuthorized(), "Unauthorized action");
        return partyToCreditInfo[_address];
    }

    // Calculate credit score
    function calculateCreditScore(address _address) public view returns (uint256) {
        require(isAuthorized(), "Unauthorized action.");

        // Getting the required info to calculate credit score
        uint totalAmountLended = partyToCreditInfo[_address].totalAmountLended;
        uint creditsOwned = partyToCreditInfo[_address].creditsOwned;
        uint totalAmountBorrowed = partyToCreditInfo[_address].totalAmountBorrowed;
        uint totalTransactions = partyToCreditInfo[_address].totalTransactions;

        // Calculate credit score using weighted average
        uint creditScore = (totalAmountLended*totalAmountLendedWeight + creditsOwned*creditsOwnedWeight + totalAmountBorrowed*totalAmountBorrowedWeight + totalTransactions*totalTransactionsWeight);

        return creditScore;
    }

    // Check if the msg.sender is an authorized party
    function isAuthorized() private view returns (bool) {
        if(msg.sender == manager){
            return true;
        }
        for (uint i = 0; i < authorizedParties.length; i++) {
            if (msg.sender == authorizedParties[i]) {
                return true;
            }
        }
        return false;
    }
}
