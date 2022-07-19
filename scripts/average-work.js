const Blockchain = require('../blockchain');
const blockchain = new Blockchain();
blockchain.addBlock({data: 'initial-block'});
let prevTimeStamp, nextTimeStamp, timeDiff, nextBlock, avg;
const times = [];
for(let i=0; i<100; i++){
    prevTimeStamp = blockchain.chain[blockchain.chain.length-1].timestamp;
    blockchain.addBlock({data: `block ${i}`});
    nextBlock = blockchain.chain[blockchain.chain.length-1];
    nextTimeStamp = nextBlock.timestamp;
    timeDiff = nextTimeStamp - prevTimeStamp;
    times.push(timeDiff);
    avg = times.reduce((total, num) => (total + num))/times.length;
    console.log(`${i} Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average: ${avg}ms`);
}