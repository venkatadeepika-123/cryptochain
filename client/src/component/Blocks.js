
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Block from './Block';

class Blocks extends Component{
    state = {blocks: []};

    componentDidMount(){
        fetch(`${document.location.origin}/api/blocks`)
        .then(response => response.json())
        .then(json => this.setState({blocks: json}));
    }

    render(){
        console.log('this.state', this.state);
        return (
            <div>
                <button type="button" class="btn btn-outline-light btn-lg download-button"><Link to = '/'>Home</Link></button>
                <h3>Blocks</h3>
                {
                    this.state.blocks.map(block => {
                        return(
                            //<div key = {block.hash} className='Block'>{block.hash}</div>
                            <Block key = {block.hash} block = {block}/>
                        );
                    })
                }
            </div>
        );
    }
}

export default Blocks;

