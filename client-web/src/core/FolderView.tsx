import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Icon, Button, Dropdown, Menu, Modal, Upload } from 'antd';
import { dispatch } from '@rematch/core';
const model = (dispatch as any).model;
import { GlobalProps, FolderViewProps } from './Types';
import NewFolder from './NewFolder';
import NewFile from './NewFile';
import Rename from './Rename';

class FolderView extends React.Component<GlobalProps, {}> {
	render() {
		const folderView = this.props.folderView as FolderViewProps;
		const tokens = folderView.pathname.split('/').filter(t => t.length > 0);
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
				<NewFolder {...this.props} />
				<NewFile {...this.props} />
				<Rename {...this.props} />
			</div>
		);
	}

	_renderActions = () => {
		const folderView = this.props.folderView as FolderViewProps;
		const selectionLen = folderView.selection.length;
		const removeTitle = selectionLen === 1
			? 'Are you sure you want to remove the item?'
			: 'Are you sure you want to remove the items?';

		const menu = (
			<Menu
				onClick={({ item, key, keyPath }) => {
					if (key === 'onClickedUpload') {
						return;
					} else if (key === 'onClickedRemove') {
						Modal.confirm({
							title: removeTitle,
							content: folderView.selection.join(', '),
							okText: 'Yes',
							cancelText: 'No',
							onOk() {
								const { pathname, selection } = folderView;
								model.remove({ pathname, selection });
							},
						});
					} else {
						model[key]();
					}
				}}
			>
				<Menu.Item key="onClickedNewFile">New File</Menu.Item>
				<Menu.Item key="onClickedNewFolder">New Folder</Menu.Item>
				<Menu.Item key="onClickedUpload">
					<Upload
						name="files"
						multiple={true}
						showUploadList={false}
						action={`/api/upload${folderView.pathname}`}
						headers={{
							authorization: 'authorization-text',
						}}
						onChange={(info => {
							console.log('info.file', info.file);
						})}
					>
						Upload
					</Upload>
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="onClickedRename" disabled={selectionLen !== 1}>Rename</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="onClickedCut" disabled={true}>Cut</Menu.Item>
				<Menu.Item key="onClickedCopy" disabled={true}>Copy</Menu.Item>
				<Menu.Item key="onClickedPaste" disabled={true}>Paste</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="onClickedRemove" disabled={selectionLen === 0}>{`Remove (${selectionLen})`}</Menu.Item>
			</Menu >
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
		const folderView = this.props.folderView as FolderViewProps;

		return (
			<Table
				size="middle"
				rowSelection={{
					selectedRowKeys: folderView.selection,
					onChange: (selectedRowKeys, selectedRows) => {
						model.onSelection({ selection: selectedRowKeys });
					},
				}}
				onRow={(record) => {
					return {
						onClick: () => {
							model.onSelection({ selection: [record.key] });
						}
					};
				}}
				columns={[{
					title: 'Name',
					dataIndex: 'name',
					render: (name: string) => {
						const url = '/' + [...tokens, name].join('/');

						if (url.indexOf('.') === -1 || url.endsWith('.json')) {
							return (
								<Link style={{ fontWeight: 'normal' }} to={url}>{name}</Link>
							);
						} else if (url.indexOf('.') === -1 || url.endsWith('.json')) {
							return (
								<Link style={{ fontWeight: 'bold' }} to={url}>{name}</Link>
							);
						} else {
							const urlStatic = url.replace('content', 'static');
							return (
								<a style={{ fontWeight: 'normal' }} href={urlStatic}>{name}</a>
							);
						}
					}
				}]}
				dataSource={folderView.folder.content.map(name => ({ key: name, name }))}
				pagination={{
					size: 'small',
				}}
			/>
		);
	}
}

export default FolderView;
