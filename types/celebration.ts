export type CelebrationDto = {
	docId?: string;
	dayName: string;
	date: string; // yyyy/mm/dd
	reminds: Remind[];
	memo?: string;
	createdAt?: Date;
	updatedAt?: Date;
};

export type InputCelebration = {
	dayName: string;
	date: Date;
	reminds: Remind[];
	memo?: string;
};

export type Remind = {
	label: string;
	value: number;
	isChecked: boolean;
};

export const defaultReminds: Remind[] = [
	{
		label: "当日",
		value: 0,
		isChecked: true,
	},
	{
		label: "前日",
		value: 1,
		isChecked: true,
	},
	{
		label: "3日前",
		value: 3,
		isChecked: false,
	},
	{
		label: "7日前",
		value: 7,
		isChecked: false,
	},
	{
		label: "30日前",
		value: 30,
		isChecked: false,
	},
];
