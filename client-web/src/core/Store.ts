import { init } from '@rematch/core';
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

		onCancelNewFolder: (state: State) => {
			const folderView = { ...state.folderView, visibleNewFolder: false };
			return { ...state, folderView };
		},

		onClickedNewFile: (state: State) => {
			const folderView = { ...state.folderView, visibleNewFile: true };
			return { ...state, folderView };
		},

		onCancelNewFile: (state: State) => {
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
		async fetchContent(payload: { pathname: string }, rootState: State) {
			console.log('fetchContent', payload);
			const { pathname } = payload;
			const content = await fetch(`/api/content${pathname}`)
				.then(response => response.json());
			(this as any).onLoadedContent({ pathname, content });
		}
	},
};

export const store = init({ models: { model } });
