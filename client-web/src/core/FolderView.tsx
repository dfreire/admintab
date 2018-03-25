import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { Folder } from './Types';
import NewFolder from './NewFolder';
import NewFile from './NewFile';

interface Props {
	pathname: string;
	folder: Folder;
	visibleNewFolder: boolean;
	visibleNewFile: boolean;
	onClickedNewFolder: {()};
	onClickedNewFile: {()};
}

class FolderView extends React.Component<Props, {}> {
	render() {
		console.log('FolderView props', this.props);

		const tokens = this.props.pathname.split('/').filter(t => t.length > 0);

		return (
			<div>
				<ul>
					{this.props.folder.content.map(name => {
						const url = '/' + [...tokens, name].join('/');
						return <li key={name}><Link to={url}>{name}</Link></li>;
					})}
				</ul>

				<div>
					<Button type="primary" onClick={this.props.onClickedNewFolder}>New Folder</Button>
					<Button type="primary" onClick={this.props.onClickedNewFile}>New File</Button>
				</div>

				<NewFolder />
				<NewFile />
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
