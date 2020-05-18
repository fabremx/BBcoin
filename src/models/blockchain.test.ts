import BlockchainService from "../blockchain.service";
import { Block } from "./block";

const mockGenesisBlock = "genesis block";
BlockchainService.getGenesisBlock = jest.fn().mockReturnValue(mockGenesisBlock);

import Blockchain from "./blockchain";

it("should initial the block with the genesis block when blockchain is instenciate", () => {
  // When
  const blockchain: Block[] = Blockchain;

  // Then
  expect(blockchain).toEqual([mockGenesisBlock]);
  expect(BlockchainService.getGenesisBlock).toHaveBeenCalled();
});
