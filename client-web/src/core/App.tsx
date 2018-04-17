import * as React from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, Layout } from 'antd';
import 'antd/dist/antd.css';
import { GlobalProps } from './Types';
import FolderView from './FolderView';
import FileView from './FileView';
import { dispatch } from '@rematch/core';
const model = (dispatch as any).model;

class AppView extends React.Component<GlobalProps, {}> {
	componentWillMount() {
		this._load(this.props.location.pathname);
	}

	componentWillUpdate(nextProps: GlobalProps) {
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
		const isFolderView = this.props.folderView != null;
		const isFileView = this.props.fileView != null;

		return (
			<Layout.Content style={{ background: '#fff', padding: 20 }}>
				{isFolderView && <FolderView {...this.props} />}
				{isFileView && <FileView {...this.props} />}
				{!isFolderView && !isFileView && <div>Woot!?</div>}
			</Layout.Content>
		);
	}
}

const App = (props1) => (
	<BrowserRouter>
		<Switch>
			<Route path="/content" render={(props2) => <AppView {...props1} {...props2} />} />
			<Redirect from="/" exact={true} to="/content" />
		</Switch>
	</BrowserRouter>
);

const mapState = (models) => {
	return { ...models.model };
};

const mapDispatch = (models) => {
	return { ...models.model };
};

export default connect(mapState, mapDispatch)(App);
