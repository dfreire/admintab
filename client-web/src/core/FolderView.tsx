import * as React from 'react';
import { Folder } from './Types';
import { Link } from 'react-router-dom';

interface Props {
	pathname: string;
	folder: Folder;
}

export class FolderView extends React.Component<Props, {}> {
	render() {
		const tokens = this.props.pathname.split('/').filter(t => t.length > 0);
		console.log('tokens', tokens);
		return (
			<ul>
				{this.props.folder.content.map(name => {
					const url = '/' + [...tokens, name].join('/');
					return <li key={name}><Link to={url}>{name} - {url}</Link></li>;
				})}
			</ul>
		);
	}
}
