import React from 'react';
import utils from '../utils';

class SelectMenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    	searchString: ''
    }

    this.updateInput = this.updateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateInput(event){
  	const value = event.target.value
  	this.setState({searchString:value});
  }

  handleSubmit(event){
  	event.preventDefault();
  	this.props.submit(this.state.searchString)
  }

  render () {
    return (
    	<form onSubmit={this.handleSubmit}>
    		<input 
    			type="text"
    			onChange={this.updateInput}
      			value={this.state.searchString}
    		/>
    	</form>
      
    )
  }
}

export default SelectMenu;
