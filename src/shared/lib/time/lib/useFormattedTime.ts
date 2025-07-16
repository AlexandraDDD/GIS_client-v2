import { useState, useEffect } from 'react';

import { formatTime } from './formatTime';

export const useFormattedTime = (timeZone?: string) => {
    const [date, setDate] = useState<Date>(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return formatTime(date, { timeZone });
};
