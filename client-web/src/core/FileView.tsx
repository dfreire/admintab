import * as React from 'react';
import { Row, Col, Tabs, Form, Input, InputNumber, Button } from 'antd';
import { dispatch } from '@rematch/core';
import * as numeral from 'numeral';
const model = (dispatch as any).model;
import { GlobalProps, FileViewProps, Field, TextField, TextAreaField, NumberField } from './Types';

class FileView extends React.Component<GlobalProps, {}> {
	render() {
		const fileView = this.props.fileView as FileViewProps;
		// const tokens = fileView.pathname.split('/').filter(t => t.length > 0);
		// const name = tokens[tokens.length - 1].split('.json')[0];

		return (
			<div>
				<Row type="flex" align="middle">
					<Col span={12}>
						{/* <h1>{name}</h1> */}
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
				<div>
					<Button type="primary" onClick={this._onClickedSave}>Save</Button>
				</div>
			</div>
		);
	}

	_onClickedSave = () => {
		const fileView = this.props.fileView as FileViewProps;
		model.saveFile({ pathname: fileView.pathname, file: fileView.file });
	}

	_renderField = (field: Field) => {
		switch (field.type) {
			case 'text':
				return this._renderTextField(field as TextField);
			case 'textarea':
				return this._renderTextAreaField(field as TextAreaField);
			case 'number':
				return this._renderNumberField(field as NumberField);
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

	_renderTextAreaField = (field: TextAreaField) => {
		const fileView = this.props.fileView as FileViewProps;
		const { key, label } = field;
		const { content } = fileView.file;

		return (
			<Form.Item key={key} label={label}>
				<Input.TextArea
					value={content[key]}
					onChange={(evt) => model.onChangeFieldValue({ key, value: evt.target.value })}
					autosize={{
						minRows: 3,
						maxRows: 25,
					}}
				/>
			</Form.Item>
		);
	}

	_renderNumberField = (field: NumberField) => {
		const fileView = this.props.fileView as FileViewProps;
		const { key, label } = field;
		const { content } = fileView.file;

		return (
			<Form.Item key={key} label={label}>
				<InputNumber
					value={content[key]}
					precision={field.precision}
					step={field.step}
					min={field.min}
					max={field.max}
					formatter={(value: number | string) => {
						const result = value == null ? value : numeral(value.toString()).format(field.format);
						console.log('formatter', value, typeof value, result);
						return result;
					}}
					parser={(valueStr: string) => {
						const tokens = valueStr.split('.');
						valueStr = tokens[0] + '.' + tokens.slice(1).join('');
						const result = numeral(valueStr).value();
						console.log('parser', valueStr, typeof valueStr, result);
						return result;
					}}
					onChange={(value: number | string) => model.onChangeFieldValue({ key, value })}
				/>
			</Form.Item>
		);
	}
}

export default FileView;
