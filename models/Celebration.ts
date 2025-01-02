import { CelebrationDto, Remind } from "../types/celebration";

type CelebrationProps = {
	dayName: string;
	date: string;
	reminds: Remind[];
	memo?: string;
	docId?: string;
};

export class Celebration {
	public readonly dayName: string;
	public readonly date: string; // yyyy/mm/dd
	public readonly reminds: Remind[];
	public readonly memo?: string;
	public readonly docId?: string;

	private constructor(props: CelebrationProps) {
		this.dayName = props.dayName;
		this.date = props.date;
		this.reminds = props.reminds;
		this.memo = props.memo;
		this.docId = props.docId;
	}

	public static create(props: CelebrationProps): CelebrationDto {
		const celebration = new Celebration(props);
		return celebration.toDto();
	};

	public toDto(): CelebrationDto {
		return {
			docId: this.docId,
			dayName: this.dayName,
			date: this.date,
			reminds: this.reminds,
			memo: this.memo,
		};
	};
}
