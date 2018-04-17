import * as slug from 'slugg';
import * as React from 'react';
import { Modal, Form, Input } from 'antd';
import { dispatch } from '@rematch/core';
const model = (dispatch as any).model;
import { GlobalProps, FolderViewProps } from './Types';

interface State {
	name: string;
}

class Rename extends React.Component<GlobalProps, State> {
	state = {
		name: '',
	} as State;

	componentDidUpdate() {
		const folderView = this.props.folderView as FolderViewProps;
		console.log('componentDidUpdate', folderView.selection);
		if (folderView.visibleRename === false && folderView.selection.length === 1) {
			// onOpen
			const name = folderView.selection[0].split('.')[0];
			if (name !== this.state.name) {
				this.setState({ name });
			}
		}
	}

	render() {
		const folderView = this.props.folderView as FolderViewProps;

		return (
			<Modal
				title="Rename"
				visible={folderView.visibleRename}
				onOk={this._onOk}
				onCancel={model.cancelRename}
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
		const _name = slug(this.state.name);

		if (_name.length > 0) {
			const folderView = this.props.folderView as FolderViewProps;
			const { pathname } = folderView;
			const oldName = folderView.selection[0];
			const oldExt = oldName.split('.')[1];
			const newName = oldExt == null ? _name : _name + '.' + oldExt;
			model.rename({ pathname, oldName, newName });
		}
	}
}

export default Rename;
