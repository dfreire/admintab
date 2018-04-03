import { init } from '@rematch/core';
import axios from 'axios';
import { Folder, File, Field, GlobalProps, FileViewProps } from './Types';

type State = GlobalProps;

const INITIAL_STATE: State = {
	location: {
		pathname: '',
	},
	folderView: undefined,
	fileView: undefined,
};

const model = {
	state: { ...INITIAL_STATE },

	reducers: {
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

		onLoadedFolder: (state: State, payload: { pathname: string; folder: Folder }) => {
			const { pathname, folder } = payload;
			const folderView = { pathname, folder, visibleNewFolder: false, visibleNewFile: false };
			return { ...state, folderView, fileView: undefined };
		},

		onLoadedFile: (state: State, payload: { pathname: string; file: File; fields: Field[] }) => {
			const { pathname, file, fields } = payload;
			const fileView = { pathname, file, fields };
			return { ...state, fileView, folderView: undefined };
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

		async createNewFolder(payload: { pathname: string, name: string }, rootState: State) {
			try {
				const { pathname, name } = payload;
				await axios.post(`/api/content${pathname}`, { name });
				(this as any).loadContent({ pathname });
			} catch (err) {
				console.error(err);
			}
		},

		async createNewFile(payload: { pathname: string, name: string, type: string }, rootState: State) {
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
