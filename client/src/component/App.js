import React, {Component} from 'react';
import { Link } from 'react-router-dom';
//import Blocks from './Blocks';
import logo from '../asserts/logo.png';

class App extends Component{
    state = {walletInfo: {}};
    componentDidMount(){
        fetch(`${document.location.origin}/api/wallet-info`)
        .then(response => response.json())
        .then(json => this.setState({ walletInfo: json}));
    }
    
    render(){
        const {address, balance} = this.state.walletInfo;

        return(
            <div className='App'>
                <br></br>
                <div>Welcome to the blockchain....</div>
                <br></br>
                <button type="button" class="btn btn-outline-light btn-lg download-button"><Link to = '/blocks'>Blocks</Link></button>
                <br></br>
                <button type="button" class="btn btn-outline-light btn-lg download-button"><Link to = '/conduct-transaction'>Conduct a transaction</Link></button>
                <br></br>
                <button type="button" class="btn btn-outline-light btn-lg download-button"><Link to = '/transaction-pool'>transaction pool</Link></button>
                <br></br>
                <div className = 'walletInfo'>
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>
                
            </div>   
        );
    }
}

export default App;