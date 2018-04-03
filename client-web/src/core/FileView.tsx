import * as React from 'react';
import { Row, Col, Tabs, Form, Input } from 'antd';
import { dispatch } from '@rematch/core';
const model = (dispatch as any).model;
import { GlobalProps, FileViewProps, Field, TextField } from './Types';

class FileView extends React.Component<GlobalProps, {}> {
	render() {
		const fileView = this.props.fileView as FileViewProps;
		console.log('fileView', fileView);
		const tokens = fileView.pathname.split('/').filter(t => t.length > 0);
		const title = tokens.length > 0 ? tokens[tokens.length - 1] : 'AdminTab';

		return (
			<div>
				<Row type="flex" align="middle">
					<Col span={12}>
						<h1>{title}</h1>
					</Col>
					<Col span={12} />
				</Row>
				<Tabs size="small" tabBarGutter={10}>
					{fileView.tabs.map(tab => (
						<Tabs.TabPane key={tab.title} tab={tab.title}>
							<Form>
								{tab.fields.map(this._renderField)}
							</Form>
						</Tabs.TabPane>
					))}
				</Tabs>
			</div>
		);
	}

	_renderField = (field: Field) => {
		switch (field.type) {
			case 'text':
				return this._renderTextField(field as TextField);
			default:
				return false;
		}
	}

	_renderTextField = (field: TextField) => {
		const fileView = this.props.fileView as FileViewProps;
		const { key, label } = field;
		const { content } = fileView.file;

		return (
			<Form.Item key={key} label={label}>
				<Input
					type="text"
					value={content[key]}
					onChange={(evt) => model.onChangeFieldValue({ key, value: evt.target.value })}
				/>
			</Form.Item>
		);
	}
}

export default FileView;
