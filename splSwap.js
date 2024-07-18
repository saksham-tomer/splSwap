import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { getMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { swapInstruction, TOKEN_SWAP_PROGRAM_ID } from '@solana/spl-token-swap';

const handleTransactionSubmit = async () => {
    // Ensuring the user is connected to a wallet
    if (!publicKey) {
        alert("Please connect your wallet!");
        return;
    }

    try {
        // Fetch mint information for the tokens involved in the swap
        const kryptMintInfo = await getMint(connection, kryptMint);
        const scroogeCoinMintInfo = await getMint(connection, scroogeCoinMint);

        // Get associated token addresses for the tokens and the pool
        const kryptATA = await getAssociatedTokenAddress(kryptMint, publicKey);
        const scroogeATA = await getAssociatedTokenAddress(scroogeCoinMint, publicKey);
        const tokenAccountPool = await getAssociatedTokenAddress(poolMint, publicKey);

        const transaction = new Transaction();

        // Check if the pool token account exists, if not, create it
        const account = await connection.getAccountInfo(tokenAccountPool);
        if (account === null) {
            const createATAInstruction = createAssociatedTokenAccountInstruction(
                publicKey, 
                tokenAccountPool, 
                publicKey, 
                poolMint
            );
            transaction.add(createATAInstruction);
        }

        // Determine which direction to swap
        if (mint === "option1") {
            const instruction = swapInstruction(
                tokenSwapStateAccount,
                swapAuthority,
                publicKey,
                kryptATA,
                poolKryptAccount,
                poolScroogeAccount,
                scroogeATA,
                poolMint,
                feeAccount,
                null,
                TOKEN_SWAP_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                amount * 10 ** kryptMintInfo.decimals,
                0
            );
            transaction.add(instruction);
        } else if (mint === "option2") {
            const instruction = swapInstruction(
                tokenSwapStateAccount,
                swapAuthority,
                publicKey,
                scroogeATA,
                poolScroogeAccount,
                poolKryptAccount,
                kryptATA,
                poolMint,
                feeAccount,
                null,
                TOKEN_SWAP_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                amount * 10 ** scroogeCoinMintInfo.decimals,
                0
            );
            transaction.add(instruction);
        } else {
            throw new Error("Invalid mint option");
        }

        // Send the transaction and handle the response
        const txid = await sendTransaction(transaction, connection);
        alert(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`);
        console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`);

    } catch (e) {
        console.error(e);
        alert(`Error: ${e.message}`);
    }
};
