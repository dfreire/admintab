import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Icon, Button, Dropdown, Menu } from 'antd';
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
		const title = tokens.length > 0 ? tokens[tokens.length - 1] : 'AdminTab';

		return (
			<div>
				<Row type="flex" align="middle">
					<Col span={12}>
						<h1>{title}</h1>
					</Col>
					<Col span={12}>
						{this._renderActions()}
					</Col>
				</Row>
				<div style={{ marginTop: 20 }}>
					{this._renderTable(tokens)}
				</div>
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
				<Menu.Divider />
				<Menu.Item key="onClickedRename">Rename</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="onClickedCut">Cut</Menu.Item>
				<Menu.Item key="onClickedCopy">Copy</Menu.Item>
				<Menu.Item key="onClickedPaste">Paste</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="onClickedRemove">Remove</Menu.Item>
			</Menu>
		);

		return (
			<div style={{ textAlign: 'right' }}>
				<Dropdown overlay={menu} trigger={['click']}>
					<Button style={{}}>
						Actions <Icon type="down" />
					</Button>
				</Dropdown>
			</div>
		);
	}

	_renderTable = (tokens: string[]) => {
		return (
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
