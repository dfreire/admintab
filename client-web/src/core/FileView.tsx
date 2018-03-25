import * as React from 'react';
import { connect } from 'react-redux';
import { File, Field, TextField } from './Types';

interface Props {
	pathname: string;
	file: File;
}

class FileView extends React.Component<Props, {}> {
	render() {
		console.log('FileView props', this.props);

		return (
			<div>
				{this.props.file.type}
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
				<input
					type="text"
					value={this.props.file.content[field.key]}
				/>
			</div>
		);
	}
}

const mapState = (models) => {
	return models.model.fileView;
};

const mapDispatch = (models) => {
	return {};
};

export default connect(mapState, mapDispatch)(FileView);
