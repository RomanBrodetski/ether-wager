class MathUtils {

  // static valueToCaption(value, decimals) {
  //   return this.round(value  / Math.pow(10, decimals), ShowDecimals)
  // }

  static format(value, decimals, showDecimals) {
    if (value === "" || isNaN(value)) {
      return ""
    }
    return this.round(value / Math.pow(10, decimals), ShowDecimals)
  }

  static round(value, decimals) {
    return value === "" ? "" : Math.round(value  * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
}
