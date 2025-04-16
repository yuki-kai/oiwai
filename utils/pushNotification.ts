import * as Notifications from "expo-notifications";
import { CelebrationDto } from "../types/celebration";
import { countDownCelebrateDay } from "./dateFormat";

export const scheduleRemindNotification = async (celebration: CelebrationDto) => {
  console.log("スケジュール通知" + celebration.date);
  celebration.reminds.forEach((remind) => {
    if (remind.isChecked) {
      const remindDate = new Date(celebration.date);
      remindDate.setDate(remindDate.getDate() - remind.value);
      console.log(remindDate.getFullYear() + "/" + (remindDate.getMonth() + 1) + "/" + remindDate.getDate());
      Notifications.scheduleNotificationAsync({
        content: {
          title: getRemindTitle(celebration.dayName, remindDate),
          body: `${celebration.date}は${celebration.dayName}です`,
        },
        
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          year: remindDate.getFullYear(),
          month: remindDate.getMonth() + 1,
          day: remindDate.getDate(),
          hour: 7,
          minute: 0,
          repeats: undefined, // TODO
          timezone: "Asia/Tokyo",
        },
      });
    }
  });
}

const getRemindTitle = (dayName: string, date: Date) => {
  const countDown = countDownCelebrateDay(date);
  if (countDown !== "今日" && countDown !== "明日") {
    return `${dayName}まで${countDown}です`;
  }
  return `${countDown}は${dayName}です`;
}
