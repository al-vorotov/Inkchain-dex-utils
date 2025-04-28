// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Импортируем интерфейс ERC20 и контракт Ownable из OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LiquidityPoolFactory
 * @dev Контракт фабрики для создания пулов ликвидности.
 */
contract LiquidityPoolFactory is Ownable {
    // Структура для хранения информации о пуле
    struct PoolInfo {
        address poolAddress;
        address tokenA;
        address tokenB;
        address owner;
    }

    // Массив пулов
    PoolInfo[] public pools;
    uint256 public poolCreationFee;

    // Событие при создании пула
    event PoolCreated(address indexed poolAddress, address indexed tokenA, address indexed tokenB, address owner);

    /**
     * @dev Конструктор устанавливает начальную плату за создание пула.
     * @param _poolCreationFee Плата за создание нового пула ликвидности.
     */
    constructor(uint256 _poolCreationFee) Ownable() {
        poolCreationFee = _poolCreationFee;
    }

    /**
     * @dev Позволяет владельцу обновить плату за создание пула.
     * @param _poolCreationFee Новая плата за создание пула.
     */
    function setPoolCreationFee(uint256 _poolCreationFee) external onlyOwner {
        poolCreationFee = _poolCreationFee;
    }

    /**
     * @dev Создает новый пул ликвидности для пары токенов.
     * @param _tokenA Адрес первого токена.
     * @param _tokenB Адрес второго токена.
     * @return Адрес созданного пула.
     */
    function createPool(address _tokenA, address _tokenB) external payable returns (address) {
        require(msg.value >= poolCreationFee, "Недостаточная плата за создание пула");
        require(_tokenA != _tokenB, "Токены должны быть разными");

        // Создаем новый пул, передавая адрес вызывающего как владельца
        LiquidityPool newPool = new LiquidityPool(_tokenA, _tokenB, msg.sender);
        pools.push(PoolInfo(address(newPool), _tokenA, _tokenB, msg.sender));

        payable(owner()).transfer(msg.value);

        // Эмитируем событие создания пула
        emit PoolCreated(address(newPool), _tokenA, _tokenB, msg.sender);
        return address(newPool);
    }

    /**
     * @dev Возвращает количество созданных пулов.
     * @return Количество пулов.
     */
    function getPoolsCount() external view returns (uint256) {
        return pools.length;
    }
}

/**
 * @title LiquidityPool
 * @dev Контракт пула ликвидности.
 */
contract LiquidityPool is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public totalTokenA;
    uint256 public totalTokenB;

    mapping(address => uint256) public liquidity;

    // События при добавлении и удалении ликвидности
    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);

    /**
     * @dev Конструктор устанавливает токены пула и владельца.
     * @param _tokenA Адрес первого токена.
     * @param _tokenB Адрес второго токена.
     * @param _owner Адрес владельца пула.
     */
    constructor(address _tokenA, address _tokenB, address _owner) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        transferOwnership(_owner); // Устанавливаем владельца пула
    }

    /**
     * @dev Добавляет ликвидность в пул.
     * @param amountA Количество первого токена.
     * @param amountB Количество второго токена.
     */
    function addLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountA > 0 && amountB > 0, "Суммы должны быть больше нуля");

        // Используем SafeERC20 для безопасных переводов
        tokenA.safeTransferFrom(msg.sender, address(this), amountA);
        tokenB.safeTransferFrom(msg.sender, address(this), amountB);

        uint256 liquidityTokens;
        if (totalTokenA == 0 && totalTokenB == 0) {
            liquidityTokens = amountA + amountB;
        } else {
            // Простая формула для примера, можно использовать более сложные механизмы
            liquidityTokens = (amountA * totalTokenA) / totalTokenB;
        }

        totalTokenA += amountA;
        totalTokenB += amountB;
        liquidity[msg.sender] += liquidityTokens;

        emit LiquidityAdded(msg.sender, amountA, amountB, liquidityTokens);
    }

    /**
     * @dev Удаляет ликвидность из пула.
     * @param liquidityAmount Количество ликвидности для удаления.
     */
    function removeLiquidity(uint256 liquidityAmount) external onlyOwner {
        require(liquidity[msg.sender] >= liquidityAmount, "Недостаточно ликвидности");

        uint256 amountA = (liquidityAmount * totalTokenA) / liquidity[msg.sender];
        uint256 amountB = (liquidityAmount * totalTokenB) / liquidity[msg.sender];

        liquidity[msg.sender] -= liquidityAmount;
        totalTokenA -= amountA;
        totalTokenB -= amountB;

        // Используем SafeERC20 для безопасных переводов
        tokenA.safeTransfer(msg.sender, amountA);
        tokenB.safeTransfer(msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB, liquidityAmount);
    }

    /**
     * @dev Возвращает текущие резервы токенов в пуле.
     * @return Резервы первого и второго токена.
     */
    function getReserves() external view returns (uint256, uint256) {
        return (totalTokenA, totalTokenB);
    }
}
