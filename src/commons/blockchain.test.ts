import Blockchain from "./blockchain";
import { Block } from "./block";

const MOCKED_TIMESTAMP = 2020;
jest.spyOn(console, "error").mockImplementation();
jest.spyOn(console, "log").mockImplementation();
jest
  .spyOn(Date.prototype, "getTime")
  .mockImplementation(() => MOCKED_TIMESTAMP);

describe("Blockchain Class", () => {
  it("should initial the blockchain with the correct genesis block when blockchain is instenciate", () => {
    // Then
    const expectedResult = new Block(0, "0", 1465154705, "Genesis block");
    expect(Blockchain.blockchain).toEqual([expectedResult]);
  });

  describe("getLatestBlock", () => {
    it("should return null when blockchain is empty", () => {
      // Given
      const genesisBlock = new Block(25, "0", 0, "not genesis data");
      const firstBlock = new Block(2, "hash", 0, "data");

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
      const previousBlock = new Block(0, "0", 0, "genesis data");

      Blockchain.getLatestBlock = jest
        .fn()
        .mockImplementation(() => previousBlock);

      const newBlockData = "this is data of the new block";

      // When
      const newBlock = Blockchain.generateNextBlock(newBlockData);

      // Then
      const expectedBlock = new Block(
        1,
        previousBlock.hash,
        MOCKED_TIMESTAMP,
        newBlockData
      );

      expect(newBlock).toEqual(expectedBlock);
    });
  });

  describe("isNewBlockValid", () => {
    it("should return false when the previousHash does not match with the hash of the previous block", () => {
      // Given
      const previousBlock = new Block(2, "hash", 0, "data");
      const newBlock = new Block(3, "not matching hash", 0, "data");

      // When
      const isValid = Blockchain.isNewBlockValid(previousBlock, newBlock);

      // Then
      expect(isValid).toBe(false);
    });

    it("should return false when the index of the new Block is inferior or equal to the index of the previous block", () => {
      // Given
      const previousBlock = new Block(2, "hash", 0, "data");
      const newBlock = new Block(1, previousBlock.hash, 0, "data");

      // When
      const isValid = Blockchain.isNewBlockValid(previousBlock, newBlock);

      // Then
      expect(isValid).toBe(false);
    });

    it("should return false when the index of the new Block is not the next number after the previous block index", () => {
      // Given
      const previousBlock = new Block(2, "hash", 0, "data");
      const newBlock = new Block(4, previousBlock.hash, 0, "data");

      // When
      const isValid = Blockchain.isNewBlockValid(previousBlock, newBlock);

      // Then
      expect(isValid).toBe(false);
    });

    it("should return false when the hash of the new block not match with the hash verification", () => {
      // Given
      const previousBlock = new Block(2, "hash", 0, "data");

      const newBlock = new Block(3, previousBlock.hash, 0, "data");
      newBlock.hash = "wrong hash";

      // When
      const isValid = Blockchain.isNewBlockValid(previousBlock, newBlock);

      // Then
      expect(isValid).toBe(false);
    });

    it("should return true when new block match the three rules", () => {
      // Given
      const previousBlock = new Block(2, "hash", 0, "data");
      const newBlock = new Block(3, previousBlock.hash, 0, "data");

      // When
      const isValid = Blockchain.isNewBlockValid(previousBlock, newBlock);

      // Then
      expect(isValid).toBe(true);
    });
  });

  describe("isBlockchainValid", () => {
    it("should return false when first block does not match with the genesis block", () => {
      // Given
      const genesisBlock = new Block(25, "0", 0, "not genesis data");
      const firstBlock = new Block(2, "hash", 0, "data");
      const secondBlock = new Block(3, firstBlock.hash, 0, "data");

      const blockchain = [genesisBlock, firstBlock, secondBlock];

      // When
      const isValid = Blockchain.isBlockchainValid(blockchain);

      // Then
      expect(isValid).toBe(false);
    });

    it("should return false when one of blockchain block is invalid", () => {
      // Given
      const genesisBlock = Blockchain.getGenesisBlock();
      const firstBlock = new Block(2, "hash", 0, "data");
      const invalidSecondBlock = new Block(3, "hash", 0, "data");

      const blockchain = [genesisBlock, firstBlock, invalidSecondBlock];

      // When
      const isValid = Blockchain.isBlockchainValid(blockchain);

      // Then
      expect(isValid).toBe(false);
    });

    it("should return true when all blacks are valid", () => {
      // Given
      const genesisBlock = Blockchain.getGenesisBlock();
      const firstBlock = new Block(1, "hash", 0, "data");
      const secondBlock = new Block(2, firstBlock.hash, 0, "data");
      const thridBlock = new Block(3, secondBlock.hash, 0, "data");

      const blockchain = [genesisBlock, firstBlock, secondBlock, thridBlock];

      // When
      const isValid = Blockchain.isBlockchainValid(blockchain);

      // Then
      expect(isValid).toBe(true);
    });
  });

  describe("Replace chain", () => {
    const genesisBlock = Blockchain.getGenesisBlock();
    const firstBlock = new Block(1, genesisBlock.hash, 0, "data");

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
      const invalidSecondBlock = new Block(2, "hash", 0, "data");
      Blockchain.blockchain = [genesisBlock, firstBlock];
      const newBlockchain = [...Blockchain.blockchain, invalidSecondBlock];

      // When
      const blockchain = Blockchain.replaceChain(newBlockchain);

      // Then
      expect(blockchain).toEqual(Blockchain.blockchain);
    });

    it("should return the new chain when its valid and have length suprerior to the current one", () => {
      // Given
      const secondBlock = new Block(2, firstBlock.hash, 0, "data");

      Blockchain.blockchain = [genesisBlock, firstBlock];
      const newBlockchain = [...Blockchain.blockchain, secondBlock];

      // When
      const blockchain = Blockchain.replaceChain(newBlockchain);

      // Then
      expect(blockchain).toEqual(newBlockchain);
    });
  });
});
