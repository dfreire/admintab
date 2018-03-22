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
