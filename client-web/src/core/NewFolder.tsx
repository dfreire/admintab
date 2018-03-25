import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Input } from 'antd';
import * as slug from 'slugg';

interface Props {
	pathname: string;
	visibleNewFolder: boolean;
	createNewFolder: { (payload: { pathname: string; name: string }) };
	cancelNewFolder: { () };
}

interface State {
	name: string;
}

class NewFolder extends React.Component<Props, State> {
	state = {
		name: '',
	} as State;

	render() {
		console.log('NewFolder props', this.props);

		return (
			<Modal
				title="New Folder"
				visible={this.props.visibleNewFolder}
				onOk={this._onOk}
				onCancel={this.props.cancelNewFolder}
			>
				<Form>
					<Form.Item
						label="Name"
						required={true}
						help={slug(this.state.name)}
					>
						<Input
							placeholder="New Folder"
							value={this.state.name}
							onChange={(evt) => this.setState({ name: evt.target.value })}
						/>
					</Form.Item>
				</Form>
			</Modal>
		);
	}

	_onOk = () => {
		this.props.createNewFolder({
			pathname: this.props.pathname,
			name: slug(this.state.name),
		});
	}
}

const mapState = (models) => {
	return {
		pathname: models.model.folderView.pathname,
		visibleNewFolder: models.model.folderView.visibleNewFolder,
	};
};

const mapDispatch = (models) => {
	return {
		createNewFolder: models.model.createNewFolder,
		cancelNewFolder: models.model.cancelNewFolder,
	};
};

export default connect(mapState, mapDispatch)(NewFolder);
