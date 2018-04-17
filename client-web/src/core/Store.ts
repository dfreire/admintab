import { init } from '@rematch/core';
import axios from 'axios';
import { Folder, File, Tab, GlobalProps, FileViewProps } from './Types';

type State = GlobalProps;

const INITIAL_STATE: State = {
	location: {
		pathname: '',
	},
	folderView: undefined,
	fileView: undefined,
	fileTypes: [],
};

const model = {
	state: { ...INITIAL_STATE },

	reducers: {
		onSelection: (state: State, payload: { selection: string[] }) => {
			const { selection } = payload;
			const folderView = { ...state.folderView, selection };
			return { ...state, folderView };
		},

		onClickedNewFolder: (state: State) => {
			const folderView = { ...state.folderView, visibleNewFolder: true };
			return { ...state, folderView };
		},

		cancelNewFolder: (state: State) => {
			const folderView = { ...state.folderView, visibleNewFolder: false };
			return { ...state, folderView };
		},

		onClickedNewFile: (state: State) => {
			const folderView = { ...state.folderView, visibleNewFile: true };
			return { ...state, folderView };
		},

		cancelNewFile: (state: State) => {
			const folderView = { ...state.folderView, visibleNewFile: false };
			return { ...state, folderView };
		},

		onClickedRename: (state: State) => {
			const folderView = { ...state.folderView, visibleRename: true };
			return { ...state, folderView };
		},

		cancelRename: (state: State) => {
			const folderView = { ...state.folderView, visibleRename: false };
			return { ...state, folderView };
		},

		onLoadedFolder: (state: State, payload: { pathname: string; folder: Folder; fileTypes: string[] }) => {
			const { pathname, folder, fileTypes } = payload;
			const folderView = {
				pathname,
				folder,
				visibleNewFolder: false,
				visibleNewFile: false,
				visibleRename: false,
				selection: []
			};
			return { ...state, fileTypes, folderView, fileView: undefined };
		},

		onLoadedFile: (state: State, payload: { pathname: string; file: File; tabs: Tab[]; fileTypes: string[] }) => {
			const { pathname, file, tabs, fileTypes } = payload;
			const fileView = { pathname, file, tabs };
			return { ...state, fileTypes, fileView, folderView: undefined };
		},

		onChangeFieldValue: (state: State, payload: { key: string, value: any }) => {
			const { key, value } = payload;
			const fileView = { ...state.fileView } as FileViewProps;
			fileView.file.content[key] = value;
			return { ...state, fileView };
		},
	},

	effects: {
		async loadContent(payload: { pathname: string }, rootState: State) {
			try {
				const { pathname } = payload;

				const res1 = await axios.get('/api/types');
				const fileTypes = res1.data;

				const res2 = await axios.get(`/api/content${pathname}`);
				const content = res2.data;

				if (content.type === 'Folder') {
					(this as any).onLoadedFolder({ pathname, folder: content, fileTypes });
				} else {
					const res3 = await axios.get(`/api/types/${content.type}`);
					const tabs = res3.data;
					(this as any).onLoadedFile({ pathname, file: content, tabs, fileTypes });
				}

			} catch (err) {
				console.error(err);
			}
		},

		async createNewFolder(payload: { pathname: string, name: string }, rootState: State) {
			try {
				const { pathname, name } = payload;
				const _pathname = [...pathname.split('/'), name].join('/');
				await axios.post(`/api/content${_pathname}`, { name });
				(this as any).loadContent({ pathname });
			} catch (err) {
				console.error(err);
			}
		},

		async createNewFile(payload: { pathname: string, name: string, type: string }, rootState: State) {
			try {
				const { pathname, name, type } = payload;
				const _pathname = [...pathname.split('/'), `${name}.json`].join('/');
				const file = { type, content: {} };
				await axios.post(`/api/content${_pathname}`, { file });
				(this as any).loadContent({ pathname });
			} catch (err) {
				console.error(err);
			}
		},

		async saveFile(payload: { pathname: string, file: File }, rootState: State) {
			const { pathname, file } = payload;
			await axios.post(`/api/content${pathname}`, { file });
			(this as any).loadContent({ pathname });
		},

		async rename(payload: { pathname: string, oldName: string, newName: string }, rootState: State) {
			const { pathname, oldName, newName } = payload;
			const source = pathname + '/' + oldName;
			const target = pathname + '/' + newName;
			await axios.post(`/api/mv`, { source, target });
			(this as any).loadContent({ pathname });
		},

		async remove(payload: { pathname: string, selection: string }, rootState: State) {
			const { pathname, selection } = payload;
			const _pathname = pathname + '/' + selection;
			await axios.post(`/api/rm`, { pathname: _pathname });
			(this as any).loadContent({ pathname });
		},
	},
};

export const store = init({ models: { model } });
