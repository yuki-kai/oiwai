const options: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
};

export const convertDateString = (date: Date): string => {
	return date.toLocaleDateString("ja-JP", options);
};

export const dateFromString = (date: string): Date => {
	console.log("=== dateFromString ===");
	console.log(date);
	// date が yyyy/mm/dd の形式かどうかをチェック
	const regExp = /^\d{4}\/\d{2}\/\d{2}$/;
	if (!regExp.test(date)) {
		throw new Error("Invalid date format");
	}
	// yyyy/mm/dd を yyyy-mm-dd に変換 (yyyy/mm/dd だと NaN になるため)
	return new Date(date.replaceAll("/", "-"));
};
