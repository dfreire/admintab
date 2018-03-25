import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Input } from 'antd';

interface Props {
	visibleNewFolder: boolean;
	onCancelNewFolder: { () };
}

const NewFolder = (props: Props) => (
	<Modal
		title="New Folder"
		visible={props.visibleNewFolder}
		onOk={(evt) => { console.log('ok'); }}
		onCancel={props.onCancelNewFolder}
	>
		<Form>
			<Form.Item
				label="Name"
				required={true}
			>
				<Input placeholder="New Folder" />
			</Form.Item>
		</Form>
	</Modal>
);

const mapState = (models) => {
	return models.model.folderView;
};

const mapDispatch = (models) => {
	return {
		onCancelNewFolder: models.model.onCancelNewFolder,
	};
};

export default connect(mapState, mapDispatch)(NewFolder);
