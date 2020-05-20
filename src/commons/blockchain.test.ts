import { Transaction } from "./transaction";
import Blockchain from "./blockchain";
import { Block } from "./block";

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
    const expectedResult = new Block(0, [new Transaction(null, null, 0)], "0");
    expect(Blockchain.blockchain).toEqual([expectedResult]);
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

  describe("generateNextBlock", () => {
    it("should generate the next with the info of the previous block", () => {
      // Given
      Blockchain.blockchain = [];
      const previousBlock = new Block(
        MOCKED_TIMESTAMP,
        MOCEKD_TRANSACTIONS,
        MOCKED_PREVIOUS_HASH
      );

      Blockchain.getLatestBlock = jest
        .fn()
        .mockImplementation(() => previousBlock);

      const newBlockTransactions = [new Transaction("from", "to", 100)];

      // When
      const newBlock = Blockchain.generateNextBlock(newBlockTransactions);

      // Then
      const expectedBlock = new Block(
        MOCKED_TIMESTAMP,
        newBlockTransactions,
        previousBlock.hash
      );

      expect(newBlock).toEqual(expectedBlock);
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

    it("should return false when one of blockchain block is invalid", () => {
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
          new Transaction(walletAddress, "other2", 20),
        ],
        genesisBlock.hash
      );
      const secondBlock = new Block(
        MOCKED_TIMESTAMP,
        [
          new Transaction("other1", "other2", 2),
          new Transaction(walletAddress, "other2", 20),
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
          new Transaction(walletAddress, "other2", 100),
        ],
        genesisBlock.hash
      );
      const secondBlock = new Block(
        MOCKED_TIMESTAMP,
        [
          new Transaction("other1", "other2", 2),
          new Transaction(walletAddress, "other2", 20),
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
});
