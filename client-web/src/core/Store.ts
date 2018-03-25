import { init } from '@rematch/core';
import axios from 'axios';
import { Folder, File } from './Types';

export interface State {
	folderView?: {
		pathname: string;
		folder: Folder;
		visibleNewFolder: boolean;
		visibleNewFile: boolean;
	};
	fileView?: {
		pathname: string;
		file: File,
	};
}

const INITIAL_STATE: State = {
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

		onLoadedContent: (state: State, payload: { pathname: string; content: { type: string } }) => {
			const { pathname, content } = payload;
			let folderView, fileView;
			if (content.type === 'Folder') {
				folderView = {
					pathname,
					folder: content,
					visibleNewFolder: false,
					visibleNewFile: false,
				};
			} else {
				fileView = {
					pathname,
					file: content,
				};
			}
			return { ...state, folderView, fileView };
		},
	},

	effects: {
		async loadContent(payload: { pathname: string }, rootState: State) {
			const { pathname } = payload;
			const response = await axios.get(`/api/content${pathname}`); // TODO try catch
			const content = response.data;
			(this as any).onLoadedContent({ pathname, content });
		},

		async createNewFolder(payload: { pathname: string, name: string }, rootState: State) {
			const { pathname, name } = payload;
			const response = await axios.post(`/api/content${pathname}`, { name }); // TODO try catch
			console.log('response', response);
			(this as any).loadContent({ pathname });
		},

		async createNewFile(payload: { pathname: string, name: string, type: string }, rootState: State) {
			const { pathname, name, type } = payload;
			const response = await axios.post(`/api/content${pathname}`, { name, type }); // TODO try catch
			console.log('response', response);
			(this as any).loadContent({ pathname });
		},
	},
};

export const store = init({ models: { model } });
