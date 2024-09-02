const availableTimes = (spTime, allTimeValues) => {

    return allTimeValues.filter(atv => !spTime.includes(atv));

};

const splitUsedTimes = (datesTimesUsed) => {
    let d = [];
    datesTimesUsed.map((du) => {
        let date = du.date.toLocaleTimeString();
        let hourminutes = date.substring(0, 4);
        d.push(hourminutes);
    });
    return d;
}

const processDatesUsed = (datesUsed, range) => {
    const timeValues = joinHourMinute(range[0].hourValues, range[0].minuteValues);
    const spDates = splitUsedDates(datesUsed);
    const gd = groupDates(spDates);
    return datesWithNotPlace(gd, timeValues);
}


const datesWithNotPlace = (gd, timeValues) => {

    let ad = [];

    for (let i = 0; i < gd.length; i++) {

        if (gd[i].hours.length === timeValues.length) {
            ad.push(gd[i].date);
        }
    }

    return ad;
}

const groupDates = (spDates) => {
    let objs = [];
    spDates.forEach(pair => {
        let obj = objs.find(obj => obj.date === pair.date);
        if (obj) {
            obj.hours.push(pair.hour);
        } else {
            objs.push({ date: pair.date, hours: [pair.hour] });
        }
    });
    return objs;
};

const splitUsedDates = (datesUsed) => {
    let d = [];
    datesUsed.map((du) => {
        let date = du.date.toISOString().substring(0, 10);
        let hour = du.date.toISOString().substring(11, 16);
        d.push({ date: date, hour: hour });
    });
    return d;
}

const joinHourMinute = (hourValues, minuteValues) => {
    let hm = [];
    for (i = 0; i < hourValues.length; i++) {
        for (x = 0; x < minuteValues.length; x++) {
            hm.push(hourValues[i] + ':' + minuteValues[x]);
        }
    }
    return hm;
}

module.exports = { availableTimes, splitUsedTimes, processDatesUsed }