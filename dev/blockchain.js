const sha256 = require('sha256');

	function Blockchain() {
	this.chain = [];
	this.pendingTransactions = [];

	//	Genesis block : the first block of blockchain
	this.createNewBlock(100, '0', '0');
};


Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length	 + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce, // nonce is an id for the 'proof of work'
		hash: hash,
		previousBlockHash : previousBlockHash
	};

	//	clear the array
	this.pendingTransactions = [];
	this.chain.push(newBlock);

	return newBlock;
}

Blockchain.prototype.getLastBlock = function() {
	return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient
	};

	this.pendingTransactions.push(newTransaction);

	return this.getLastBlock()['index'] + 1 ;

}

// SHA256 hash function
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while (hash.substring(0, 4) !== '0000') {
		nonce ++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
		console.log(hash)
	}
	//	how many iterations the algorithm does to start with '0000', we'll insert in our nonce value into hashBlock function
	return nonce ; 
}



module.exports = Blockchain;