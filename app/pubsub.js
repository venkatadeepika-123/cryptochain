
//const redis = require('redis');
const redis = require('redis');
const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
}

class PubSub{
    
    constructor({ blockchain, transactionPool}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels();
        
        this.subscriber.on('message', 
            (channel, message) => this.handleMessage(channel, message));
    }

    handleMessage(channel, message){
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);
    
        const parsedMessage = JSON.parse(message);
        switch(channel){
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, true, () => {
                    this.transactionPool.clearBlockchainTransactions({
                        chain: parsedMessage
                    })
                    // this.transactionPool.clearBlockchainTransactions({
                    //     chain: parsedMessage
                    // });
                });
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;
            default:
                return;
        }
    }

    subscribeToChannels(){
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

    publish({channel, message}){
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction){
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

// const testPubSub = new PubSub();
// setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'foo'), 1000);


// const PubNub = require('pubnub');

// const credientials = {
//     publicKey: 'pub-c-1c62bc0f-06fc-4baf-a24e-d8b49e813493',
//     subscribeKey: 'sub-c-48d4083d-8879-4b17-88a5-05c01e975c40',
//     secretKey: 'sec-c-N2RjMGVlNzMtYmRjYS00YjMwLTkyOTAtNDBjZTY3YTRlZDM3'
// }

// const CHANNELS = {
//     TEST: 'TEST',
// }
// class PubSub{
//     constructor() {
//         this.pubnub = new PubNub(credientials);
//         this.pubnub.subscribe({channels: Object.values(CHANNELS) });
//         this.pubnub.addListener(this.listener());
//     }

//     listener(){
//         return {
//             message: messageObject => {
//                 const {channel, message} = messageObject;
//                 console.log(`message received. Channel: ${channel}. Message: ${message}`);
            
//             }
//         }
//     }

//     publish({ channel, message}){
//         this.pubnub.publish({channel, message});
//     }
// }

// const testPubSub = new PubSub();
// testPubSub.publish({channel: CHANNELS.TEST, message: 'hello pubnub'});

module.exports = PubSub;