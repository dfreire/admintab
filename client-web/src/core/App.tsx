import * as React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { FolderView } from './FolderView';
import { FileView } from './FileView';
import { Folder, File } from './Types';

interface Props {
	location: {
		pathname: string;
	};
}
interface State {
	content?: Folder | File;
}

class AppView extends React.Component<Props, State> {
	state = {
	} as State;

	componentWillMount() {
		this._load(this.props.location.pathname);
	}

	componentWillUpdate(nextProps: Props) {
		if (this.props.location.pathname !== nextProps.location.pathname) {
			this._load(nextProps.location.pathname);
		}
	}

	_load = (pathname: string) => {
		console.log('_load pathname', pathname);
		fetch(`/api/content${pathname}`)
			.then(response => response.json())
			.then(content => {
				this.setState({ content });
			});
	}

	render() {
		return (
			<div>
				{this.props.location.pathname !== '/' && <Link to="..">..</Link>}
				<h3> {this.props.location.pathname} </h3>
				{this._renderContent()}
			</div>
		);
	}

	_renderContent = () => {
		if (this.state.content != null) {
			if (this.state.content.type === 'Folder') {
				return <FolderView pathname={this.props.location.pathname} folder={this.state.content as Folder} />;
			} else {
				return <FileView pathname={this.props.location.pathname} file={this.state.content as File} />;
			}
		} 
		return false;
	}
}

const App = () => (
	<BrowserRouter>
		<Route component={AppView} />
	</BrowserRouter>
);

export default App;
