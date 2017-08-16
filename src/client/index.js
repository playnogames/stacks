import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App';

require('./css/index.css');

ReactDom.render(
	<App />,
	document.getElementById('app')
);