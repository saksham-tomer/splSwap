import {
  Transaction,
  Keypair,
  SystemProgram,
  Connection,
} from "@solana/web3.js";
import {
  TokenSwap,
  TokenSwapLayout,
  TOKEN_SWAP_PROGRAM_ID,
} from "@solana/spl-token-swap";

import * as token from "@solana/spl-token";

async function getTOkenAccountCreationInstruction(
  mint: PublicKey,
  swapAuthority: PublicKey,
  payer: PublicKey
): Promise<PublicKey, TransactionInstruction> {
  let tokenAccountAddress = await token.getAssociatedTokenAddress(
    mint,
    swapAuthority,
    true
  );

  const tokenAccountInstruction =
    await token.createAssociatedTokenAccountInstruction(
      payer,
      tokenAccountAddress,
      swapAuthority,
      mint
    );

  return [tokenAccountAddress, tokenAccountInstruction];
}

function loadKeypair(filename: string): Keypair {
  const secret = JSON.parse(fs.readFileSync(filename).toStiring()) as number[];
  const secretKey = Uint8Array.from(secret);
  return Keypair.fromSecretKey(secretKey);
}
async function main() {
  const connection = new Connection("https://api.devnet.solana.com");
  const wallet = loadKeypair(
    "BobVeNop2drGdaPJup9NwEQ6gMeikjgYeii8iSd5BJQE.json"
  );
  const transaction = new Transaction();
  const tokenSwapStateAccount = Keypair.generate();
  const rent = await TokenSwap.getMinimumBalanceForRentExemption(connection);
  const tokenSwapStateAccountCreationInstruction =
    await SystemProgram.createAccount({
      newAccountPubkey: tokenSwapStateAccount.publicKey,
      fromPubkey: wallet.publicKey,
      lamports: rent,
      space: TokenSwapLayout.span,
      programId: TOKEN_SWAP_PROGRAM_ID,
    });
  let tokenAAccountAddress = await token.getAssociatedTokenAddress(
    tokenAMint, // mint
    swapAuthority, // owner
    true // allow owner off curve
  );

  const tokenAAccountInstruction =
    await token.createAssociatedTokenAccountInstruction(
      wallet.publicKey, // payer
      tokenAAccountAddress, // ata
      swapAuthority, // owner
      tokenAMint // mint
    );
  transaction.add(tokenSwapStateAccountCreationInstruction);

  const [swapAuthority, bump] = await Web3.PublicKey.findProgramAddress(
    [tokenSwapStateAccount.publicKey.toBuffer()],
    TOKEN_SWAP_PROGRAM_ID
  );
  const tokenSwapInitSwapInstruction = TokenSwap.createInitSwapInstruction(
    tokenSwapStateAccount.publicKey,
    swapAuthority
  );

  const tokenBMint = new PublicKey(
    "BTopvD9vP6ecfquvp5TfgrcvbjB3iaf3SYGwYXdvHsm9"
  );
  const tokenAMint = new PublicKey(
    "ATojXLnFwbq8yUXcvQSfWxxdxp9whiKnrRkzEumkzz7A"
  );

  const [tokenATokenAccount, taci] = await getTOkenAccountCreationInstruction(
    tokenAmint,
    swapAuthority,
    wallet.publicKey
  );

  const [tokenBTokenAccount, tbci] = await getTOkenAccountCreationInstruction(
    tokenBmint,
    swapAuthority,
    wallet.publicKey
  );

  const tokenSwapInitSwapInstruction =
    await TokenSwap.createInitSwapInstruction(
      tokenSwapStateAccount.publicKey,
      swapAuthority
    );
}
