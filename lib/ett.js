'use strict';

/**
 * Converts weekly schedule array to octet string
 * @param {Array} data
 * @return {Array}
 */
const scheduleToOctetStr = (data) => {
    return data.map((dayData) =>
        dayData.reduce((sum, currentIntervalSetting, index) => sum + (Number(currentIntervalSetting) << index), 0)
    );
};

/**
 * Converts intervals array to octet string
 * @param {Array} data
 * example: [
    { start: '12:00', stop: '12:00' },
    { start: '12:00', stop: '12:00' },
    { start: '12:00', stop: '12:00' },
    { start: '12:00', stop: '12:00' },
    { start: '12:00', stop: '12:00' }
  ]
 * @return {string}
 */
const intervalsToOctetStr = (data) => {
    return data
        .map((interval) => interval.start.split(':').concat(interval.stop.split(':')))
        .reduce((sum, item) => sum.concat(item.map((s) => parseInt(s))), []);
};

/**
 * Converts intervals buffer from 'ettSprySchedule' to array of 5 intervals
 * @param {Buffer} data
 * @return {Array}
 */
const bufferToTimeIntervals = (data) => {
    const intervalsArray = [...data];
    const schedule = [];
    let interval = [];
    for (let i = 0; i < intervalsArray.length; i++) {
        interval.push(intervalsArray[i]);
        if ((i + 1) % 4 === 0) {
            schedule.push({
                start: `${interval[0]}:${String('0' + interval[1]).slice(-2)}`,
                stop: `${interval[2]}:${String('0' + interval[3]).slice(-2)}`,
            });
            interval = [];
        }
    }
    return schedule;
};

const bufferToWeeklySchedule = (data) => {
    const scheduleArray = [...data].map((bitMap) => {
        const weekDay = [];
        for (let i = 0; i < 7; i++) {
            weekDay.push(Boolean(bitMap & (1 << i)));
        }
        return weekDay;
    });
    return scheduleArray;
};

module.exports = {
    scheduleToOctetStr,
    intervalsToOctetStr,
    bufferToTimeIntervals,
    bufferToWeeklySchedule,
};