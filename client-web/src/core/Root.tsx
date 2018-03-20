import * as React from 'react';
import { Node } from './Node';
import { Model, TextField } from './model/Model';

const model = [
	{
		key: 'title',
		type: 'text',
		label: 'Title',
		value: '',
		isRequired: true,
	} as TextField
] as Model;

class Root extends React.Component {
	render() {
		return (
			<div>
				<Node model={model} />
			</div>
		);
	}
}

export default Root;
