import * as slug from 'slugg';
import * as React from 'react';
import { Modal, Form, Input } from 'antd';
import { dispatch } from '@rematch/core';
const model = (dispatch as any).model;
import { GlobalProps, FolderViewProps } from './Types';

interface State {
	name: string;
}

class NewFolder extends React.Component<GlobalProps, State> {
	state = {
		name: '',
	} as State;

	render() {
		const folderView = this.props.folderView as FolderViewProps;

		return (
			<Modal
				title="New Folder"
				visible={folderView.visibleNewFolder}
				onOk={this._onOk}
				onCancel={model.cancelNewFolder}
			>
				<Form>
					<Form.Item
						label="Name"
						required={true}
						help={slug(this.state.name)}
					>
						<Input
							autoFocus={true}
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
		const folderView = this.props.folderView as FolderViewProps;
		const { pathname } = folderView;
		const name = slug(this.state.name);

		if (name.length > 0) {
			this.setState({
				name: '',
			});
			model.createNewFolder({ pathname, name });
		}
	}
}

export default NewFolder;
