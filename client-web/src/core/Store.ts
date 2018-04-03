import { init } from '@rematch/core';
import axios from 'axios';
import { Folder, File, Field, GlobalState, FileViewProps } from './Types';

const INITIAL_STATE: GlobalState = {
	location: {
		pathname: '',
	},
	folderView: undefined,
	fileView: undefined,
};

const model = {
	state: { ...INITIAL_STATE },

	reducers: {
		onClickedNewFolder: (state: GlobalState) => {
			const folderView = { ...state.folderView, visibleNewFolder: true };
			return { ...state, folderView };
		},

		cancelNewFolder: (state: GlobalState) => {
			const folderView = { ...state.folderView, visibleNewFolder: false };
			return { ...state, folderView };
		},

		onClickedNewFile: (state: GlobalState) => {
			const folderView = { ...state.folderView, visibleNewFile: true };
			return { ...state, folderView };
		},

		cancelNewFile: (state: GlobalState) => {
			const folderView = { ...state.folderView, visibleNewFile: false };
			return { ...state, folderView };
		},

		onLoadedFolder: (state: GlobalState, payload: { pathname: string; folder: Folder }) => {
			const { pathname, folder } = payload;
			const folderView = { pathname, folder, visibleNewFolder: false, visibleNewFile: false };
			return { ...state, folderView, fileView: undefined };
		},

		onLoadedFile: (state: GlobalState, payload: { pathname: string; file: File; fields: Field[] }) => {
			const { pathname, file, fields } = payload;
			const fileView = { pathname, file, fields };
			return { ...state, fileView, folderView: undefined };
		},

		onChangeFieldValue: (state: GlobalState, payload: { key: string, value: any }) => {
			const { key, value } = payload;
			const fileView = { ...state.fileView } as FileViewProps;
			fileView.file.content[key] = value;
			return { ...state, fileView };
		},
	},

	effects: {
		async loadContent(payload: { pathname: string }, rootState: GlobalState) {
			try {
				const { pathname } = payload;
				const res1 = await axios.get(`/api/content${pathname}`);
				const content = res1.data;

				if (content.type === 'Folder') {
					(this as any).onLoadedFolder({ pathname, folder: content });
				} else {
					const res2 = await axios.get(`/api/types/${content.type}`);
					const fields = res2.data;
					(this as any).onLoadedFile({ pathname, file: content, fields });
				}
			} catch (err) {
				console.error(err);
			}
		},

		async createNewFolder(payload: { pathname: string, name: string }, rootState: GlobalState) {
			try {
				const { pathname, name } = payload;
				await axios.post(`/api/content${pathname}`, { name });
				(this as any).loadContent({ pathname });
			} catch (err) {
				console.error(err);
			}
		},

		async createNewFile(payload: { pathname: string, name: string, type: string }, rootState: GlobalState) {
			try {
				const { pathname, name, type } = payload;
				await axios.post(`/api/content${pathname}`, { name, type });
				(this as any).loadContent({ pathname });
			} catch (err) {
				console.error(err);
			}
		},
	},
};

export const store = init({ models: { model } });
