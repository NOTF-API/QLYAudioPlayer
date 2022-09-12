export function format(second) {
    if (!second || isNaN(second)) {
        return "00:00.00";
    }
    let s = parseInt(second % 60);
    let m = parseInt(second / 60);
    let ms = parseFloat(second - parseInt(second)).toFixed(2).slice(2)
    let timeString = "";
    if (m < 10) {
        timeString += "0";
    }
    timeString += m;
    timeString += ":"
    if (s < 10) {
        timeString += "0";
    }
    timeString += s;
    timeString += ".";


    timeString += ms;
    return timeString;
}