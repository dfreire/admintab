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

export interface FileViewProps {
	pathname: string;
	file: File;
	fields: Field[];
}

export interface Folder {
	type: 'Folder';
	content: string[];
}

export interface File {
	type: string;
	content: object;
}

export interface Field {
	type: 'text';
	key: string;
}

export interface TextField extends Field {
	type: 'text';
	label: string;
	value?: string;
	isRequired?: boolean;
}
