/**
 * Преобразует обьект `Date` в дату в соответствии с параметрами
 *
 * Дефолтно преобразует в строку вида 10.10.2020
 */
export const formatDate = (
    date: Date,
    dateTimeFormatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric', year: 'numeric' },
) => {
    return date.toLocaleString('ru-RU', dateTimeFormatOptions);
};
