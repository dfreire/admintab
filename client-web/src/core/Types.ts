export interface GlobalProps {
	location: {
		pathname: string;
	};
	folderView?: FolderViewProps;
	fileView?: FileViewProps;
	fileTypes: string[];
}

export interface FolderViewProps {
	pathname: string;
	folder: Folder;
	visibleNewFolder: boolean;
	visibleNewFile: boolean;
	visibleRename: boolean;
	selection: string[];
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
	type: 'text' | 'textarea' | 'number';
	key: string;
	tab?: string;
}

export interface TextField extends Field {
	type: 'text';
	label: string;
	value?: string;
	isRequired?: boolean;
}

export interface TextAreaField extends Field {
	type: 'textarea';
	label: string;
	value?: string;
	isRequired?: boolean;
}

export interface NumberField extends Field {
	type: 'number';
	label: string;
	value?: number;
	precision?: number;
	step?: number;
	min?: number;
	max?: number;
	isRequired?: boolean;
}