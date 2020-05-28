import { Transaction } from "./transaction";
import { Block } from "./block";
import Blockchain from "./blockchain";

const MOCKED_TIMESTAMP = 2020;
jest.spyOn(console, "error").mockImplementation();
jest.spyOn(console, "log").mockImplementation();
jest
  .spyOn(Date.prototype, "getTime")
  .mockImplementation(() => MOCKED_TIMESTAMP);

const MOCKED_PREVIOUS_HASH = "previousHash";
const MOCEKD_TRANSACTIONS = [new Transaction("fromAddress", "toAddress", 100)];

describe("Blockchain Class", () => {
  it("should initial the blockchain with the correct genesis block when blockchain is instenciate", () => {
    // Then
    const expectedResult = new Block(
      0,
      [new Transaction("null", "null", 0)],
      "0"
    );
    expect(Blockchain.blockchain).toEqual([expectedResult]);
  });

  describe("addTransaction", () => {
    it("should throw an error when fromAddress is null, undefined or empty", () => {
      // Given
      const transaction = new Transaction("", "addressTo", 10);

      // When
      try {
        Blockchain.addTransaction(transaction);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should throw an error when toAddress is null, undefined or empty", () => {
      // Given
      const transaction = new Transaction("fromAddress", "", 10);

      // When
      try {
        Blockchain.addTransaction(transaction);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should throw an error when transaction is not valid", () => {
      // Given
      const transaction = new Transaction("fromAddress", "addressTo", 10);
      transaction.isValid = jest.fn().mockReturnValue(false);

      // When
      try {
        Blockchain.addTransaction(transaction);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should throw an error when transaction amount is inferior to 0", () => {
      // Given
      const transaction = new Transaction("fromAddress", "addressTo", -10);

      // When
      try {
        Blockchain.addTransaction(transaction);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should throw an error when transaction amount is inferior to 0", () => {
      // Given
      const transaction = new Transaction("fromAddress", "addressTo", 20);
      const spy = jest
        .spyOn(Blockchain, "getBalanceOfAddress")
        .mockReturnValueOnce(10);

      // When
      try {
        Blockchain.addTransaction(transaction);
      } catch (error) {
        expect(error).toBeDefined();
        spy.mockClear();
      }
    });

    it("should add the new transaction to the pending transactions array when transaction is correct", () => {
      // Given
      const transaction = new Transaction("fromAddress", "addressTo", 10);
      transaction.isValid = jest.fn().mockReturnValue(true);

      // When
      expect(Blockchain.pendingTransactions).toEqual([]);
      Blockchain.addTransaction(transaction);
      expect(Blockchain.pendingTransactions).toEqual([transaction]);
    });
  });

  describe("getLatestBlock", () => {
    it("should return the latest block when blockchain is NOT empty", () => {
      // Given
      const genesisBlock = Blockchain.getGenesisBlock();
      const firstBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        MOCKED_PREVIOUS_HASH
      );

      Blockchain.blockchain = [genesisBlock, firstBlock];

      // When
      const block = Blockchain.getLatestBlock();

      // Then
      expect(block).toEqual(firstBlock);
    });
  });

  describe("isNewBlockValid", () => {
    it("should return false when the previousHash does not match with the hash of the previous block", () => {
      // Given
      const previousBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        MOCKED_PREVIOUS_HASH
      );
      const newBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        "not matching previous hash"
      );

      // When
      const isValid = Blockchain.isNewBlockValid(previousBlock, newBlock);

      // Then
      expect(isValid).toBe(false);
    });

    it("should return false when the hash of the new block not match with the hash verification", () => {
      // Given
      const previousBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        MOCKED_PREVIOUS_HASH
      );
      const newBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        previousBlock.hash
      );
      newBlock.hash = "wrong hash";

      // When
      const isValid = Blockchain.isNewBlockValid(previousBlock, newBlock);

      // Then
      expect(isValid).toBe(false);
    });

    it("should return true when new block match the two rules", () => {
      // Given
      const previousBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        MOCKED_PREVIOUS_HASH
      );
      const newBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        previousBlock.hash
      );

      // When
      const isValid = Blockchain.isNewBlockValid(previousBlock, newBlock);

      // Then
      expect(isValid).toBe(true);
    });
  });

  describe("isBlockchainValid", () => {
    it("should return false when first block does not match with the genesis block", () => {
      // Given
      const firstBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        MOCKED_PREVIOUS_HASH
      );

      const blockchain = [firstBlock];

      // When
      const isValid = Blockchain.isBlockchainValid(blockchain);

      // Then
      expect(isValid).toBe(false);
    });

    it("should return false when the previous hash is invalid", () => {
      // Given
      const genesisBlock = Blockchain.getGenesisBlock();
      const firstBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        MOCKED_PREVIOUS_HASH
      );
      const invalidSecondBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        "wrong previous hash"
      );

      const blockchain = [genesisBlock, firstBlock, invalidSecondBlock];

      // When
      const isValid = Blockchain.isBlockchainValid(blockchain);

      // Then
      expect(isValid).toBe(false);
    });

    it("should return false when the transaction is invalid", () => {
      // Given
      const genesisBlock = Blockchain.getGenesisBlock();
      const firstBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        MOCKED_PREVIOUS_HASH
      );
      const invalidSecondBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        firstBlock.hash
      );

      firstBlock.hasValidTransactions = jest.fn().mockReturnValue(true);
      invalidSecondBlock.hasValidTransactions = jest
        .fn()
        .mockReturnValue(false);
      const blockchain = [genesisBlock, firstBlock, invalidSecondBlock];

      // When
      const isValid = Blockchain.isBlockchainValid(blockchain);

      // Then
      expect(isValid).toBe(false);
    });

    it("should return true when all blacks are valid", () => {
      // Given
      const genesisBlock = Blockchain.getGenesisBlock();
      const firstBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        MOCKED_PREVIOUS_HASH
      );
      const secondBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        firstBlock.hash
      );
      const thridBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        secondBlock.hash
      );

      firstBlock.hasValidTransactions = jest.fn().mockReturnValue(true);
      secondBlock.hasValidTransactions = jest.fn().mockReturnValue(true);
      thridBlock.hasValidTransactions = jest.fn().mockReturnValue(true);

      const blockchain = [genesisBlock, firstBlock, secondBlock, thridBlock];

      // When
      const isValid = Blockchain.isBlockchainValid(blockchain);

      // Then
      expect(isValid).toBe(true);
    });
  });

  describe("Replace chain", () => {
    const genesisBlock = Blockchain.getGenesisBlock();
    const firstBlock = new Block(
      MOCKED_TIMESTAMP,
      MOCEKD_TRANSACTIONS,
      MOCKED_PREVIOUS_HASH
    );

    it("should return the current chain when the new chain is valid BUT have an inferior length to the current one", () => {
      // Given
      Blockchain.blockchain = [genesisBlock, firstBlock];
      const newBlockchain = [genesisBlock];

      // When
      const blockchain = Blockchain.replaceChain(newBlockchain);

      // Then
      expect(blockchain).toEqual(Blockchain.blockchain);
    });

    it("should return the current chain when the new chain has length superior to the current chain BUT is not valid", () => {
      // Given
      const invalidSecondBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        "wrong previous hash"
      );

      Blockchain.blockchain = [genesisBlock, firstBlock];
      const newBlockchain = [...Blockchain.blockchain, invalidSecondBlock];

      // When
      const blockchain = Blockchain.replaceChain(newBlockchain);

      // Then
      expect(blockchain).toEqual(Blockchain.blockchain);
    });

    it("should return the new chain when its valid and have length suprerior to the current one", () => {
      // Given
      const secondBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        firstBlock.hash
      );

      firstBlock.hasValidTransactions = jest.fn().mockReturnValue(true);
      secondBlock.hasValidTransactions = jest.fn().mockReturnValue(true);

      Blockchain.blockchain = [genesisBlock, firstBlock];
      const newBlockchain = [...Blockchain.blockchain, secondBlock];

      // When
      const blockchain = Blockchain.replaceChain(newBlockchain);

      // Then
      expect(blockchain).toEqual(newBlockchain);
    });
  });

  describe("getBalanceOfAddress", () => {
    it("should return the correct positive balance of given wallet when balance is positive", () => {
      // Given
      const walletAddress = "myWallet";

      const genesisBlock = Blockchain.getGenesisBlock();
      const firstBlock = new Block(
        MOCKED_TIMESTAMP,
        [
          new Transaction("other1", "other2", 2),
          new Transaction("other1", walletAddress, 100),
          new Transaction("other2", "other1", 2),
          new Transaction(walletAddress, "other2", 20)
        ],
        genesisBlock.hash
      );
      const secondBlock = new Block(
        MOCKED_TIMESTAMP,
        [
          new Transaction("other1", "other2", 2),
          new Transaction(walletAddress, "other2", 20)
        ],
        firstBlock.hash
      );

      Blockchain.blockchain = [genesisBlock, firstBlock, secondBlock];

      // When
      const balance = Blockchain.getBalanceOfAddress(walletAddress);

      // Then
      expect(balance).toEqual(60);
    });

    it("should return the correct negative balance of given wallet when balance is negative", () => {
      // Given
      const walletAddress = "myWallet";

      const genesisBlock = Blockchain.getGenesisBlock();
      const firstBlock = new Block(
        MOCKED_TIMESTAMP,
        [
          new Transaction("other1", "other2", 2),
          new Transaction("other1", walletAddress, 100),
          new Transaction("other2", "other1", 2),
          new Transaction(walletAddress, "other2", 100)
        ],
        genesisBlock.hash
      );
      const secondBlock = new Block(
        MOCKED_TIMESTAMP,
        [
          new Transaction("other1", "other2", 2),
          new Transaction(walletAddress, "other2", 20)
        ],
        firstBlock.hash
      );

      Blockchain.blockchain = [genesisBlock, firstBlock, secondBlock];

      // When
      const balance = Blockchain.getBalanceOfAddress(walletAddress);

      // Then
      expect(balance).toEqual(-20);
    });
  });

  describe("getAllTransactionsForWallet", () => {
    it("should return all transactiopn of given wallet address", () => {
      // Given
      const walletAddress = "myWallet";

      const genesisBlock = Blockchain.getGenesisBlock();
      const firstBlock = new Block(
        MOCKED_TIMESTAMP,
        [
          new Transaction("other1", "other2", 2),
          new Transaction("other1", walletAddress, 100),
          new Transaction("other2", "other1", 2),
          new Transaction(walletAddress, "other2", 20)
        ],
        genesisBlock.hash
      );
      const secondBlock = new Block(
        MOCKED_TIMESTAMP,
        [
          new Transaction("other1", "other2", 2),
          new Transaction(walletAddress, "other2", 20)
        ],
        firstBlock.hash
      );

      Blockchain.blockchain = [genesisBlock, firstBlock, secondBlock];

      // When
      const transactions = Blockchain.getAllTransactionsForWallet(
        walletAddress
      );

      // Then
      expect(transactions).toEqual([
        new Transaction("other1", walletAddress, 100),
        new Transaction(walletAddress, "other2", 20),
        new Transaction(walletAddress, "other2", 20)
      ]);
    });
  });
});
