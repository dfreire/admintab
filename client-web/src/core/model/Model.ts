export type Model = Field[];

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
