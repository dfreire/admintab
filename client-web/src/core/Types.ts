export interface GlobalProps {
	location: {
		pathname: string;
	};
	folderView?: FolderViewProps;
	fileView?: FileViewProps;
}

export interface FolderViewProps {
	pathname: string;
	folder: Folder;
	visibleNewFolder: boolean;
	visibleNewFile: boolean;
}

export interface Folder {
	type: 'Folder';
	content: string[];
}

export interface FileViewProps {
	pathname: string;
	file: File;
	tabs: Tab[];
}

export interface File {
	type: string;
	content: object;
}

export interface Tab {
	title: string;
	fields: Field[];
}

export interface Field {
	type: 'text';
	key: string;
	tab?: string;
}

export interface TextField extends Field {
	type: 'text';
	label: string;
	value?: string;
	isRequired?: boolean;
}
