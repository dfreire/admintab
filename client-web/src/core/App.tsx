import * as React from 'react';
import { dispatch } from '@rematch/core';
const model = (dispatch as any).model;
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, Layout } from 'antd';
import { GlobalState } from './Types';
import FolderView from './FolderView';
import FileView from './FileView';
import 'antd/dist/antd.css';

interface Props extends GlobalState {
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
		const folderView = this.props.folderView || { pathname: '' };
		const fileView = this.props.fileView || { pathname: '' };
		if (pathname !== folderView.pathname && pathname !== fileView.pathname) {
			model.loadContent({ pathname });
		}
	}

	render() {
		console.log('AppView render', this.props);

		return (
			<Layout style={{ background: '#efefef' }}>
				{this._renderBreadcrumb()}
				{this._renderContent()}
			</Layout>
		);
	}

	_renderBreadcrumb = () => {
		const tokens = this.props.location.pathname.split('/').filter(t => t.length > 0);

		const items = [{ token: 'AdminTab', url: '/' }];
		tokens.forEach((token, i) => {
			const url = ['', ...tokens.slice(0, i), token].join('/');
			items.push({ token, url });
		});

		return (
			<Breadcrumb style={{ marginTop: 20, marginBottom: 20 }}>
				{items.map((item, i) => (
					<Breadcrumb.Item key={`${i}-${item.token}`}><Link to={item.url}>{item.token}</Link></Breadcrumb.Item>
				))}
			</Breadcrumb>
		);
	}

	_renderContent = () => {
		return (
			<Layout.Content style={{ background: '#fff', padding: 20 }}>
				{this.props.folderView != null && <FolderView {...this.props} />}
				{this.props.fileView != null && <FileView {...this.props} />}
			</Layout.Content>
		);
	}
}

const App = (props1) => (
	<BrowserRouter>
		<Route render={(props2) => <AppView {...props1} {...props2} />} />
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
