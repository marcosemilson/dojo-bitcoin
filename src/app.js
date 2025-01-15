const express = require('express');
const BitcoinCore = require('bitcoin-core');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggerConfig'); // Import Swagger configuration
const app = express();

const rateLimit = require('express-rate-limit');

// Configuração do Rate Limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 100, // Limite de 100 requisições por IP por janela de tempo
    message: {
        error: 'Too many requests. Please try again later.',
    },
    standardHeaders: true, // Inclui cabeçalhos `RateLimit-*`
    legacyHeaders: false, // Desabilita cabeçalhos `X-RateLimit-*` (obsoletos)
});

// Aplica o middleware de rate limiting globalmente
app.use(limiter);

require('dotenv').config();


// Middleware for JSON
app.use(express.json());

// Swagger UI Configuration
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Import the /api-docs route

// Bitcoin Core Client Configuration
const client = new BitcoinCore({
    network: process.env.BITCOIN_NETWORK || 'regtest',
    username: process.env.BITCOIN_RPC_USER,
    password: process.env.BITCOIN_RPC_PASS,
    host: process.env.BITCOIN_RPC_HOST,
    port: process.env.BITCOIN_RPC_PORT || 18443
});

/**
 * @swagger
 * /block/{height}:
 *   get:
 *     summary: Gets information for a specific block by height
 *     description: Returns the details of a blockchain block based on the given height.
 *     parameters:
 *       - in: path
 *         name: height
 *         required: true
 *         description: The height of the block you want to fetch.
 *         schema:
 *           type: integer
 *           example: 100
 *     responses:
 *       200:
 *         description: Details of the block found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hash:
 *                   type: string
 *                   description: Block hash.
 *                   example: "3f1a0b1c2d3e4f56789abcdef1234567890abcdef1234567890abcdef1234567"
 *                 height:
 *                   type: integer
 *                   description: Block height.
 *                   example: 100
 *                 time:
 *                   type: integer
 *                   description: Block timestamp.
 *                   example: 1623859200
 *                 transactions:
 *                   type: array
 *                   description: List of transactions in the block.
 *                   items:
 *                     type: string
 *                     example: "b2c24a45b3a1...4d9eb"
 *       400:
 *         description: Invalid height or other error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid height."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Error connecting to Bitcoin Core."
 */
// Endpoint: Search block by height
app.get('/block/:height', async (req, res) => {
    try {
        const height = parseInt(req.params.height, 10); // Obtém o valor de 'height' como número inteiro
        if (isNaN(height) || height < 0) {
            return res.status(400).json({ error: 'Height must be a non-negative integer.' });
        }

        // Recupera o hash do bloco pelo número (height)
        const blockHash = await client.command('getblockhash', height);
        
        // Recupera os dados do bloco usando o hash
        const block = await client.command('getblock', blockHash);

        // Retorna o bloco como JSON
        res.json(block);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


/**
 * @swagger
 * /transaction/{txid}:
 *   get:
 *     summary: Returns details of a specific transaction.
 *     description: Query details of a transaction in Bitcoin Core using the TXID.
 *     parameters:
 *       - in: path
 *         name: txid
 *         required: true
 *         description: Transaction hash (TXID).
 *         schema:
 *           type: string
 *           example: "e093d75e245102d6ba06c2ad562905f626bde30e36fc97a519d14b2d85952cea"
 *     responses:
 *       200:
 *         description: Transaction details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 txid:
 *                   type: string
 *                   description: Transaction hash.
 *                   example: "e093d75e245102d6ba06c2ad562905f626bde30e36fc97a519d14b2d85952cea"
 *                 details:
 *                   type: object
 *                   description: Full transaction details.
 *       400:
 *         description: Error fetching transaction.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Detailed error message.
 */
// Endpoint: Search transaction by hash
app.get('/transaction/:txid', async (req, res) => {
    try {
        const txid = req.params.txid; // Receives the transaction hash
        const transaction = await client.command('getrawtransaction', txid, true);
        res.json(transaction); // Returns transaction details
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /address/{address}/balance:
 *   get:
 *     summary: Returns the balance for a specific address.
 *     description: Query the balance of an address using the associated UTXOs in Bitcoin Core.
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         description: Bitcoin address in Bech32 format.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address balance.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 address:
 *                   type: string
 *                   description: The address consulted.
 *                   exemple: bcrt1qraltzuz3vv6c4h96rg2p8x0d7edee88sugytk3
 *                 balance:
 *                   type: number
 *                   description: The total balance of the address in BTC.
 *                   example: 0.005
 *       400:
 *         description: Error when checking the balance.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Detailed error message.
 */
// Endpoint: Check balance of an address
app.get('/address/:address/balance', async (req, res) => {
    try {
        const address = req.params.address;
        const walletName = 'wallet1'; // Replace with your wallet name
         // Configure specific client for the wallet
         const clientWithWallet = new BitcoinCore({
            network: process.env.BITCOIN_NETWORK,
            username: process.env.BITCOIN_RPC_USER,
            password: process.env.BITCOIN_RPC_PASS,
            host: process.env.BITCOIN_RPC_HOST,
            port: process.env.BITCOIN_RPC_PORT,
            wallet: walletName // Add wallet name here
        });
        const utxos = await clientWithWallet.command('listunspent', 0, 9999999, [address]);
        const balance = utxos.reduce((sum, utxo) => sum + utxo.amount, 0);
        res.json({ address, balance });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on the port ${PORT}`);
console.log(`Documentation available at http://localhost:${PORT}/api-docs`);
});

