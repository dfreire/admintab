import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Icon, Dropdown, Menu } from 'antd';
import { Folder } from './Types';
import NewFolder from './NewFolder';
import NewFile from './NewFile';

interface Props {
	pathname: string;
	folder: Folder;
	visibleNewFolder: boolean;
	visibleNewFile: boolean;
	onClickedNewFolder: { () };
	onClickedNewFile: { () };
}

interface State {
	selectedRowKeys: string[] | number[];
}

class FolderView extends React.Component<Props, State> {
	state = {
		selectedRowKeys: [],
	} as State;

	render() {
		console.log('FolderView props', this.props);

		const tokens = this.props.pathname.split('/').filter(t => t.length > 0);

		return (
			<div>
				{this._renderActions()}
				<Table
					size="middle"
					rowSelection={{
						selectedRowKeys: this.state.selectedRowKeys,
						onChange: (selectedRowKeys, selectedRows) => {
							this.setState({ selectedRowKeys });
						},
					}}
					columns={[{
						title: 'Name',
						dataIndex: 'name',
						render: (name: string) => {
							const url = '/' + [...tokens, name].join('/');
							return (
								<Link style={{ fontWeight: name.endsWith('.json') ? 'normal' : 'bold' }} to={url}>{name}</Link>
							);
						}
					}]}
					dataSource={this.props.folder.content.map(name => ({ key: name, name }))}
					pagination={{
						size: 'small',
					}}
				/>

				<NewFolder />
				<NewFile />
			</div>
		);
	}

	_renderActions = () => {
		const menu = (
			<Menu
				onClick={({ item, key, keyPath }) => {
					this.props[key]();
				}}
			>
				<Menu.Item key="onClickedNewFile">New File</Menu.Item>
				<Menu.Item key="onClickedNewFolder">New Folder</Menu.Item>
				<Menu.Item key="onClickedUpload">Upload</Menu.Item>
				<Menu.Item key="onClickedRename">Rename</Menu.Item>
				<Menu.Item key="onClickedRemove">Remove</Menu.Item>
				<Menu.Item key="onClickedCut">Copy</Menu.Item>
				<Menu.Item key="onClickedCopy">Cut</Menu.Item>
				<Menu.Item key="onClickedPaste">Paste</Menu.Item>
			</Menu>
		);

		return (
			<div style={{ textAlign: 'right', marginTop: 15, marginBottom: 15 }}>
				<Dropdown overlay={menu} trigger={['click']}>
					<a className="ant-dropdown-link" href="">
						Actions <Icon type="down" />
					</a>
				</Dropdown>
			</div>
		);
	}
}

const mapState = (models) => {
	return models.model.folderView;
};

const mapDispatch = (models) => {
	return {
		onClickedNewFolder: models.model.onClickedNewFolder,
		onClickedNewFile: models.model.onClickedNewFile,
	};
};

export default connect(mapState, mapDispatch)(FolderView) as any;
