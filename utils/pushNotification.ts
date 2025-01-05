import * as Notifications from "expo-notifications";
import { Remind } from "../types/celebration";
import { dateFromString } from "./dateFormat";

export const scheduleRemindNotification = async (date: string, reminds: Remind[]) => {
  console.log("スケジュール通知" + date);
  reminds.forEach((remind) => {
    if (remind.isChecked) {
      console.log(remind.label);
      const remindDate = dateFromString(date);
      remindDate.setDate(remindDate.getDate() - remind.value);
      console.log(remindDate.getFullYear() + "/" + (remindDate.getMonth() + 1) + "/" + remindDate.getDate());
      Notifications.scheduleNotificationAsync({
        content: {
          title: "test_title",
          body: "test_body",
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
