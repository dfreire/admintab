import * as React from 'react';
import { Model, Field, TextField } from './model/Model';

export interface NodeProps {
	model: Model;
}

export class Node extends React.Component<NodeProps, {}> {
	state = {
	};

	render() {
		return (
			<div>
				{this.props.model.map(this._renderField)}
			</div>
		);
	}

	_renderField = (field: Field) => {
		switch (field.type) {
			case 'text':
				return this._renderTextField(field as TextField);
			default:
				return <p>Unknown field type: {field.type}</p>;
		}
	}

	_renderTextField = (field: TextField) => {
		return (
			<div>
				<label>{field.label}</label>
				<input type="text" />
			</div>
		);
	}
}
