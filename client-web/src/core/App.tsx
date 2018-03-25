import * as React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
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
	loadContent(payload: { pathname: string });
}

class AppView extends React.Component<Props, {}> {
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
			this.props.loadContent({ pathname: pathname });
		}
	}

	render() {
		return (
			<div>
				{this._renderBreadcrumb()}
				{this._renderContent()}
			</div>
		);
	}

	_renderBreadcrumb = () => {
		const tokens = this.props.location.pathname.split('/').filter(t => t.length > 0);

		const items = [{ token: 'Home', url: '/' }];
		tokens.forEach((token, i) => {
			const url = ['', ...tokens.slice(0, i), token].join('/');
			console.log('token', token, 'url', url);
			items.push({ token, url });
		});

		console.log('items', items);

		const style = {
			backgroundColor: '#F8FAFA',
			padding: 8,
			border: '1px solid #EAEDED',
		};

		return (
			<div style={{ marginTop: 20 }}>
				<Breadcrumb style={style}>
					{items.map((item, i) => {
						return <Breadcrumb.Item key={`${i}-${item.token}`}><Link to={item.url}>{item.token}</Link></Breadcrumb.Item>;
					})}
				</Breadcrumb>
			</div>
		);
	}

	_renderContent = () => {
		if (this.props.folderView != null) {
			return <FolderView />;
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
	return {
		folderView: models.model.folderView,
		fileView: models.model.fileView,
	};
};

const mapDispatch = (models) => {
	return {
		loadContent: models.model.loadContent,
	};
};

export default connect(mapState, mapDispatch)(App);
