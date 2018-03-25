import * as React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { State } from './Store';
import FolderView from './FolderView';
import FileView from './FileView';
import 'antd/dist/antd.css';

interface Props extends State {
	location: {
		pathname: string;
	};
	folderView: any;
	fileView: any;
	fetchContent(payload: { pathname: string });
}

class AppView extends React.Component<Props, State> {
	state = {
	} as State;

	componentWillMount() {
		console.log('AppView componentWillMount props', this.props);
		this._load(this.props.location.pathname);
	}

	componentWillUpdate(nextProps: Props) {
		console.log('AppView componentWillUpdate nextProps', nextProps);
		if (this.props.location.pathname !== nextProps.location.pathname) {
			this._load(nextProps.location.pathname);
		}
	}

	_load = (pathname: string) => {
		const folderView = this.props.folderView || {};
		const fileView = this.props.fileView || {};
		if (pathname !== folderView.pathname && pathname !== fileView.pathname) {
			this.props.fetchContent({ pathname: pathname });
		}
	}

	render() {
		const tokens = this.props.location.pathname.split('/').filter(t => t.length > 0);
		if (tokens.length > 0) {
			tokens.pop();
		}
		const urlUp = '/' + tokens.join('/');

		return (
			<div>
				<Link to={urlUp}>up</Link>
				<h3> {this.props.location.pathname} </h3>
				{this._renderContent()}
			</div>
		);
	}

	_renderContent = () => {
		if (this.props.folderView != null) {
			return (
				<FolderView />
			);
		} else if (this.props.fileView != null) {
			return <FileView />;
		} else {
			return false;
		}
	}
}

const App = (props1) => (
	<BrowserRouter>
		<Route component={(props2) => <AppView {...props1} {...props2} />} />
	</BrowserRouter>
);

const mapState = (models) => {
	return { folderView: models.model.folderView, fileView: models.model.fileView };
};

const mapDispatch = (models) => {
	return { fetchContent: models.model.fetchContent };
};

export default connect(mapState, mapDispatch)(App);
