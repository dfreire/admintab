import * as React from 'react';
import { Folder } from './Types';
import { Link } from 'react-router-dom';

interface Props {
	pathname: string;
	folder: Folder;
}

export class FolderView extends React.Component<Props, {}> {
	render() {
		return (
			<ul>
				{this.props.folder.content.map(name => (
					<li key={name}><Link to={`${this.props.pathname}${name}`}>{name}</Link></li>
				))}
			</ul>
		);
	}
}
