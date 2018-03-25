import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Input } from 'antd';

interface Props {
	visibleNewFile: boolean;
	onCancelNewFile: { () };
}

const NewFile = (props: Props) => (
	<Modal
		title="New File"
		visible={props.visibleNewFile}
		onOk={(evt) => { console.log('ok'); }}
		onCancel={props.onCancelNewFile}
	>
		<Form>
			<Form.Item
				label="Name"
				required={true}
			>
				<Input placeholder="New File" />
			</Form.Item>
		</Form>
	</Modal>
);

const mapState = (models) => {
	return models.model.folderView;
};

const mapDispatch = (models) => {
	return {
		onCancelNewFile: models.model.onCancelNewFile,
	};
};

export default connect(mapState, mapDispatch)(NewFile);
