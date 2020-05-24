import { Transaction } from "./transaction";
import { Block } from "./block";

jest.spyOn(console, "log").mockImplementation();

describe("Block Class", () => {
  const timestamp = 0;
  const previousHash = "previousHash";
  const transactions = [new Transaction("fromAddress", "toAddress", 100)];

  describe("calculateHash", () => {
    it("should call sha256 method with all block param", () => {
      // Given
      const block = new Block(timestamp, transactions, previousHash);

      // When
      const result = block.calculateHash();

      // Then
      // TODO: expect sha256 method
      expect(typeof result).toBe("string");
    });
  });

  describe("mineBlock", () => {
    it("should return the hash with nonce equal to 0 when difficulty equal to 0", () => {
      // Given
      const block = new Block(timestamp, transactions, previousHash);
      const difficulty = 0;

      // When
      block.mineBlock(difficulty);

      // Then
      expect(block.nonce).toEqual(0);
    });

    it("should return the hash with nonce equal to 0 when block hash is have two 0 at the beginning and difficulty is equal to 2", () => {
      // Given
      const block = new Block(timestamp, transactions, previousHash);
      block.hash = "00hash";
      const difficulty = 2;

      // When
      block.mineBlock(difficulty);

      // Then
      console.log(block.nonce);
      expect(block.nonce).toEqual(0);
    });
  });

  describe("hasValidTransactions", () => {
    it("should return true when all transaction are valid", () => {
      // Given
      const block = new Block(timestamp, transactions, previousHash);
      transactions[0].isValid = jest.fn().mockReturnValue(true);

      // When
      const result = block.hasValidTransactions();

      // Then
      expect(result).toEqual(true);
    });

    it("should return true when one of transactions is invalid", () => {
      // Given
      const transactions = [
        new Transaction("fromAddress", "toAddress", 100),
        new Transaction("fromAddress", "toAddress", 100),
        new Transaction("fromAddress", "toAddress", 100),
      ];
      const block = new Block(timestamp, transactions, previousHash);
      transactions[0].isValid = jest.fn().mockReturnValue(true);
      transactions[1].isValid = jest.fn().mockReturnValue(false);
      transactions[2].isValid = jest.fn().mockReturnValue(true);

      // When
      const result = block.hasValidTransactions();

      // Then
      expect(result).toEqual(false);
    });
  });
});
