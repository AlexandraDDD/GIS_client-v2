/**
 * Преобразует обьект `Date` во время в соответствии с параметрами
 *
 * Дефолтно преобразует в строку вида 23:50:45
 */
export const formatTime = (date: Date, dateTimeFormatOptions: Intl.DateTimeFormatOptions = {}) => {
    return date.toLocaleTimeString('ru-RU', dateTimeFormatOptions);
};
