import * as slug from 'slugg';
import * as React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { dispatch } from '@rematch/core';
const model = (dispatch as any).model;
import { GlobalProps, FolderViewProps } from './Types';

interface State {
	name: string;
	type?: string;
}

class NewFile extends React.Component<GlobalProps, State> {
	state = {
		name: '',
		type: undefined,
	} as State;

	render() {
		const folderView = this.props.folderView as FolderViewProps;

		return (
			<Modal
				title="New File"
				visible={folderView.visibleNewFile}
				onOk={this._onOk}
				onCancel={model.cancelNewFile}
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
					<Form.Item
						label="Type"
						required={true}
						help={slug(this.state.name)}
					>
						<Select
							placeholder="Type"
							onChange={(type: string) => this.setState({ type })}
						>
							{this.props.fileTypes.map(type => (
								<Select.Option key={type} value={type}>{type}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		);
	}

	_onOk = () => {
		const folderView = this.props.folderView as FolderViewProps;
		const { pathname } = folderView;
		const name = slug(this.state.name);
		const type = this.state.type || '';
		if (name.length > 0 && type.length > 0) {
			this.setState({
				name: '',
				type: undefined,
			});
			model.createNewFile({ pathname, name, type });
		}
	}
}

export default NewFile;
