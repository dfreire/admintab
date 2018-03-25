import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Input } from 'antd';
import * as slug from 'slugg';

interface Props {
	pathname: string;
	visibleNewFile: boolean;
	createNewFile: { (payload: { pathname: string; name: string; type: string }) };
	cancelNewFile: { () };
}

interface State {
	name: string;
}

class NewFile extends React.Component<Props, State> {
	state = {
		name: '',
	} as State;

	render() {
		console.log('NewFile props', this.props);

		return (
			<Modal
				title="New File"
				visible={this.props.visibleNewFile}
				onOk={this._onOk}
				onCancel={this.props.cancelNewFile}
			>
				<Form>
					<Form.Item
						label="Name"
						required={true}
						help={slug(this.state.name)}
					>
						<Input
							placeholder="New File"
							value={this.state.name}
							onChange={(evt) => this.setState({ name: evt.target.value })}
						/>
					</Form.Item>
				</Form>
			</Modal>
		);
	}

	_onOk = () => {
		this.props.createNewFile({
			pathname: this.props.pathname,
			name: slug(this.state.name),
			type: 'example',
		});
	}
}

const mapState = (models) => {
	return {
		pathname: models.model.folderView.pathname,
		visibleNewFile: models.model.folderView.visibleNewFile,
	};
};

const mapDispatch = (models) => {
	return {
		createNewFile: models.model.createNewFile,
		cancelNewFile: models.model.cancelNewFile,
	};
};

export default connect(mapState, mapDispatch)(NewFile);
