const DATE_ACCURACY_YEAR  = "year"
const DATE_ACCURACY_MONTH = "month"
const DATE_ACCURACY_DAY   = "day"

class Datetime {
  constructor(isJavascriptMode = true) {
    // NOTE: isJavascriptMode is a flag if consumer uses javascript mode date object or not.
    // Here are examples of date 2020-02-20
    // ex1 [isJavascriptMode === true]    { year: 2020, month: 1, day: 20 }
    // ex2 [isJavascriptMode === false]   { year: 2020, month: 2, day: 20 }
    // * month of javascript mode start from 0 to 11
    this.isJavascriptMode = isJavascriptMode;
  }

  generateFormattedNowDateTime(jst = true) {
    const dt = this.generateNowDate()
    const rawFormattedTime = this.getFormattedTime(dt)
    const formattedTime = this.generateFormattedTime(dt, jst)
    return `${this.getFormattedDate(dt)}${formattedTime}`
  }
  generateFormattedDateTime(obj, jst = true) {
    const formattedDate = this.generateFormattedDate(obj)
    if (!formattedDate) {
      return false
    }
    const formattedTime = this.generateFormattedDefaultTime(jst)
    return `${formattedDate}${formattedTime}`
  }
  generateFormattedTime(dt, jst = true) {
    const rawFormattedTime = this.getFormattedTime(dt)
    return this.managedFormattedTime(rawFormattedTime, jst)
  }
  generateFormattedNowDate() {
    return this.getFormattedDate(this.generateNowDate())
  }
  generateFormattedDate(obj, accuracy = null) {
    const dt = this.generateDateFromObject(obj)
    if (!dt) {
      return false
    }
    return this.getFormattedDate(dt, accuracy)
  }
  generateFormattedDefaultTime(jst = true) {
    const rawFormattedTime = this.getDefaultFormattedTime();
    return this.managedFormattedTime(rawFormattedTime, jst)
  }
  generateDateFromObject(obj) {
    if (!obj) return false
    if (obj.formatted) {
      return this.generateDateFromString(obj.formatted)
    }
    if (!obj.year) return false
    if (!obj.month) {
      return new Date(obj.year);
    }
    let monthIndex = obj.month
    if (!this.isJavascriptMode) {
      monthIndex = monthIndex - 1
    }
    if (!obj.day) {
      return new Date(obj.year, monthIndex);
    }
    return new Date(obj.year, monthIndex, obj.day);
  }
  generateNowDate() {
    return new Date();
  }
  generateDateFromString(str) {
    if (typeof str !== "string") return false
    return new Date(str);
  }
  getFormattedDate(dt, accuracy = null) {
    let year = `${this.getFullYear(dt)}`
    if (accuracy === DATE_ACCURACY_YEAR) {
      return year
    }
    let month = `-${this.getFullMonth(dt)}`
    if (accuracy === DATE_ACCURACY_MONTH) {
      return `${year}${month}`
    }
    return `${year}${month}-${this.getFullDate(dt)}`
  }
  getDefaultFormattedTime() {
    return "00:00:00";
  }
  getFormattedTime(dt) {
    return `${this.getFullHour(dt)}:${this.getFullMinutes(dt)}:${this.getFullSeconds(dt)}`
  }
  managedFormattedTime(rawFormattedTime, jst = true) {
    return jst ? this.transformTime2JST(rawFormattedTime) : ` ${rawFormattedTime}`
  }
  transformTime2JST(time) {
    return `T${time}+0900`
  }
  getFullYear(dt) {
    return dt.getFullYear();
  }
  getFullMonth(dt) {
    return ("00" + (dt.getMonth()+1)).slice(-2);
  }
  getFullDate(dt) {
    return ("00" + dt.getDate()).slice(-2);
  }
  getFullHour(dt) {
    return ("00" + dt.getHours()).slice(-2);
  }
  getFullMinutes(dt) {
    return ("00" + dt.getMinutes()).slice(-2);
  }
  getFullSeconds(dt) {
    return ("00" + dt.getSeconds()).slice(-2);
  }

  // generateJSTStr = (date) => {
  //   // let dt = this.generateDateFromString('2018-03')
  //   let obj = { year: "2019", month: 8, day: 28 }
  //   let formattedDate = this.generateFormattedDate(obj, false)
  //   console.log(formattedDate)
  // 
  //   formattedDate = this.generateFormattedDate(obj, false, DATE_ACCURACY_MONTH)
  //   console.log(formattedDate)
  // 
  //   formattedDate = this.generateFormattedDate(obj, false, DATE_ACCURACY_YEAR)
  //   console.log(formattedDate)
  // 
  // 
  //   obj = { formatted: "2015-07-15" }
  //   formattedDate = this.generateFormattedDateTime(obj, true)
  //   console.log(formattedDate)
  // 
  // 
  //   formattedDate = this.generateFormattedNowDate()
  //   console.log(formattedDate)
  //   formattedDate = this.generateFormattedNowDateTime()
  //   console.log(formattedDate)
  // 
  // }
}
export default Datetime;
