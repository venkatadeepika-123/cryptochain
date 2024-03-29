import React, {Component} from 'react';
import Transaction from './Transaction';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

const POLL_INERVAL_MS = 10000;

class TransactionPool extends Component{
    state = { transactionPoolMap: {} };

    fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
        .then(response => response.json())
        .then(json => this.setState({ transactionPoolMap: json }));
    }

    fetchMineTransactions = () => {
        fetch(`${document.location.origin}/api/mine-transactions`)
          .then(response => {
            if (response.status === 200) {
              alert('success');
              history.push('/blocks');
            } else {
              alert('The mine-transactions block request did not complete.');
            }
        });
    }

    componentDidMount() {
        this.fetchTransactionPoolMap();

        this.fetchPoolMapInterval = setInterval(
            () => this.fetchTransactionPoolMap(),
            POLL_INERVAL_MS
          );
    }

    componentWillUnmount() {
        clearInterval(this.fetchPoolMapInterval);
      }

    render(){
        return(
            <div className='TransactionPool'>
                <button type="button" class="btn btn-outline-light btn-lg download-button"><Link to = '/'>Home</Link></button>
                <h3>Transaction Pool</h3>
                {
                    Object.values(this.state.transactionPoolMap).map(transaction => {
                        return (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div>
                        )
                    })
                }
                <hr />
                <Button bsStyle="danger" onClick={this.fetchMineTransactions}>
                    Mine the Transactions
                </Button>
            </div>
        )
    }
}

export default TransactionPool;