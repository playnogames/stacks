import React from 'react';

import SearchInput from './SearchInput';
import utils from '../utils';

class StockSearch extends React.Component {
    constructor(){
        super();
        this.state={
            stock: null
        }

        this.getStockInfo = this.getStockInfo.bind(this);
    }

    async getStockInfo(ticker){
        let stock = await utils.searchStock(ticker);
        this.setState({ stock: stock });
    }
    
    render(){
        let stock = this.state.stock

        return(
            <div>
                <SearchInput submit={this.getStockInfo} />
                { stock &&
                    <div>
                        <div>current price: ${stock.current_price}</div>
                        <div>percent change: {((stock.current_price - stock.closing_price)/stock.closing_price*100).toFixed(2)}%</div>
                    </div>
                }
            </div>
        )
    }
	
}

export default StockSearch;