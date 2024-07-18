import { expect } from "chai";
import sinon from "sinon";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  getMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import {
  TokenSwapInstruction,
  TOKEN_SWAP_PROGRAM_ID,
} from "@solana/spl-token-swap";

// Mock the dependencies
global.connection = sinon.createStubInstance(Connection);
global.publicKey = new PublicKey("PublicKeyHere");
global.sendTransaction = sinon.stub();
global.alert = sinon.stub();
global.kryptMint = new PublicKey("KryptMintAddressHere");
global.scroogeCoinMint = new PublicKey("ScroogeMintAddressHere");
global.poolMint = new PublicKey("PoolMintAddressHere");
global.tokenSwapStateAccount = new PublicKey("TokenSwapStateAccountHere");
global.swapAuthority = new PublicKey("SwapAuthorityHere");
global.poolKryptAccount = new PublicKey("PoolKryptAccountHere");
global.poolScroogeAccount = new PublicKey("PoolScroogeAccountHere");
global.feeAccount = new PublicKey("FeeAccountHere");
global.TOKEN_PROGRAM_ID = new PublicKey("TokenProgramIdHere");

// Import the function to test
const handleTransactionSubmit = import("./splSwap.js");

describe("handleTransactionSubmit", () => {
  beforeEach(() => {
    // Reset stubs before each test
    sendTransaction.reset();
    alert.reset();
    connection.getAccountInfo.reset();
    connection.getMint.reset();
    getAssociatedTokenAddress.reset();
  });

  it("should alert if the wallet is not connected", async () => {
    global.publicKey = null;
    await handleTransactionSubmit();
    expect(alert.calledWith("Please connect your wallet!")).to.be.true;
  });

  it("should create a transaction and submit it", async () => {
    // Mock the return values for the calls
    global.publicKey = new PublicKey("YourPublicKeyHere");
    const mintInfo = { decimals: 6 };
    const associatedTokenAddress = new PublicKey("AssociatedTokenAddressHere");
    connection.getMint.resolves(mintInfo);
    getAssociatedTokenAddress.resolves(associatedTokenAddress);
    connection.getAccountInfo.resolves(null);
    sendTransaction.resolves("transactionId");

    await handleTransactionSubmit();

    expect(connection.getMint.calledTwice).to.be.true;
    expect(getAssociatedTokenAddress.calledThrice).to.be.true;
    expect(connection.getAccountInfo.calledOnce).to.be.true;
    expect(sendTransaction.calledOnce).to.be.true;
    expect(
      alert.calledWith(
        "Transaction submitted: https://explorer.solana.com/tx/transactionId?cluster=devnet"
      )
    ).to.be.true;
  });

  it("should handle errors gracefully", async () => {
    // Mock the error
    const error = new Error("Test Error");
    connection.getMint.rejects(error);

    await handleTransactionSubmit();

    expect(alert.calledWith(`Error: ${error.message}`)).to.be.true;
  });
});
