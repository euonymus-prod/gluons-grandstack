import moment from "moment";
import ja_JP from "../locales/ja_JP";
import en_US from "../locales/en_US";
// constancts
import * as LOCALSTORAGE from "../constants/localstorage";

const LOCALE_JA = "ja";
const LOCALE_EN = "en";

class Util {
  constructor(isJavascriptMode = true) {
    // NOTE: isJavascriptMode is a flag if consumer uses javascript mode date object or not.
    // Here are examples of date 2020-02-20
    // ex1 [isJavascriptMode === true]    { year: 2020, month: 1, day: 20 }
    // ex2 [isJavascriptMode === false]   { year: 2020, month: 2, day: 20 }
    // * month of javascript mode start from 0 to 11
    this.isJavascriptMode = isJavascriptMode;
    this.setLocale();
  }

  setLocale = () => {
    const domainString = document.domain;
    const domainFirstPart = domainString.split(".")[0];
    this.locale = this.isEnglish(domainFirstPart) ? LOCALE_EN : LOCALE_JA;
  };

  isEnglish = (locale, strict = false) => {
    if (strict && ![LOCALE_EN, LOCALE_JA].includes(locale)) {
      return false;
    }
    if (locale !== LOCALE_JA) {
      locale = LOCALE_EN;
    }
    return locale === LOCALE_EN;
  };

  localeInitializer = () => {
    let locale_messages = en_US;
    if (!this.isEnglish(this.locale)) {
      locale_messages = ja_JP;
      // This is required to manually differ the behavior depends on locale.
      localStorage.setItem(LOCALSTORAGE.LOCALE, JSON.stringify(this.locale));
    }
    return [this.locale, locale_messages];
  };

  period2str(data) {
    if (!data || (!data.start && !data.end)) return "";

    let start_str = this.date2str(data.start, data.start_accuracy);
    let end_str = this.date2str(data.end, data.end_accuracy);
    if (!start_str && !end_str) return "";

    let ret = "";
    if (data.is_momentary) {
      ret = "(" + start_str + ")";
    } else {
      ret = "(" + start_str;
      ret = ret + " ~ ";
      ret = ret + end_str + ")";
    }
    return ret;
  }
  date2str(date, accuracy) {
    if (
      !date ||
      date.year === null ||
      date.month === null ||
      date.day === null
    ) {
      return "";
    }
    let format = "";
    if (accuracy === "year") {
      format = "YYYY";
    } else if (accuracy === "month") {
      format = "YYYY-MM";
    } else if (accuracy === "day") {
      format = "YYYY-MM-DD";
    } else {
      format = "YYYY-MM-DD";
    }
    // return moment(date.toString()).format(format)
    if (!this.isJavascriptMode) {
      date = {
        ...date,
        month: date.month - 1
      };
    }
    return moment(date).format(format);
  }
  fCamelToSnake(p) {
    //大文字を_+小文字にする(例:A を _a)
    return p.replace(/([A-Z])/g, function(s) {
      return "_" + s.charAt(0).toLowerCase();
    });
  }
  fPascalToSnake(p) {
    return this.fCamelToSnake(p).replace(/^_/, "");
  }
}
export default Util;

export const getObjectId = (subject_id, gluon) => {
  if (subject_id === gluon.active_id) {
    return gluon.passive_id;
  } else if (subject_id === gluon.passive_id) {
    return gluon.active_id;
  }
  return false;
};
