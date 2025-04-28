// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFactory is Ownable {
    uint256 public mintFee; // Minting fee set by the owner

    event TokenCreated(address indexed tokenAddress, address indexed creator);

    /**
     * @dev Constructor that initializes the mint fee and sets the owner.
     * @param _mintFee The initial minting fee in wei.
     */
    constructor(uint256 _mintFee) Ownable(msg.sender) {
        mintFee = _mintFee;
    }

    /**
     * @dev Allows the owner to update the minting fee.
     * @param _mintFee The new minting fee in wei.
     */
    function setMintFee(uint256 _mintFee) external onlyOwner {
        mintFee = _mintFee;
    }

    /**
     * @dev Allows users to create their own ERC-20 token by deploying a new contract.
     * The user must pay the minting fee, which is transferred to the contract owner.
     * @param name The name of the new token.
     * @param symbol The symbol of the new token.
     * @param initialSupply The initial supply of the new token (in smallest units).
     * @param decimals The number of decimal places for the new token.
     */
    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals
    ) external payable {
        require(msg.value >= mintFee, "Insufficient minting fee");

        // Deploy a new CustomToken contract
        CustomToken newToken = new CustomToken(
            name,
            symbol,
            initialSupply,
            decimals,
            msg.sender
        );

        // Emit an event with the new token's address and creator
        emit TokenCreated(address(newToken), msg.sender);

        // Transfer the minting fee to the contract owner
        payable(owner()).transfer(msg.value);
    }
}

contract CustomToken is ERC20, Ownable {
    uint8 private immutable _customDecimals; // Token decimal places

    /**
     * @dev Constructor for CustomToken.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     * @param initialSupply The initial supply to mint to the owner.
     * @param decimals_ The number of decimals the token uses.
     * @param tokenOwner The address of the token owner.
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals_,
        address tokenOwner
    ) ERC20(name, symbol) Ownable(tokenOwner) {
        _customDecimals = decimals_;
        _mint(tokenOwner, initialSupply);
    }

    /**
     * @dev Overrides the decimals function to set custom decimals.
     */
    function decimals() public view virtual override returns (uint8) {
        return _customDecimals;
    }
}
