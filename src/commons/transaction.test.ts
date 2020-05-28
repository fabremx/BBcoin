import { Transaction } from "./transaction";

describe("Transaction Class", () => {
  it("should call sha256 method with all block param", () => {
    // Given
    const transaction = new Transaction("null", "null", 10);

    // When
    const result = transaction.calculateHash();

    // Then
    // TODO: expect sha256 method
    expect(typeof result).toBe("string");
  });

  describe("isValid", () => {
    it("should return true when signature is an empty array", () => {
      // Given
      const transaction = new Transaction("fromAdress", "toAddress", 10);
      transaction.signature = [];

      // When
      const result = transaction.isValid();

      // Then
      expect(result).toBe(false);
    });
  });
});
