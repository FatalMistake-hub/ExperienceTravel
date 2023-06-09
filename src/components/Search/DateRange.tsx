// import { DATA_ACTION_TYPES } from 'context/actionTypes';

import { DateRange } from 'react-date-range';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { SET_CHECK_IN, SET_CHECK_OUT } from 'src/redux/slice/searchSlice';
import vi from 'date-fns/locale/vi';

// import { useDataContext } from 'hooks/useDataContext';

// context

interface IAppDateRangeProps {
    months?: number;
}

const DateRangeCP: FC<IAppDateRangeProps> = ({ months }) => {
    const { checkIn, checkOut } = useAppSelector((state) => state.search);
    const dispatch = useAppDispatch();
    let checkInDate = new Date(checkIn);
    let checkOutDate = new Date(checkOut);
    const selectionRange: any = {
        startDate: checkInDate,
        endDate: checkOutDate,
        key: 'selection',
    };

    const handleDatePicker = (range: any) => {
        const { startDate, endDate } = range.selection;
        dispatch(SET_CHECK_IN(startDate));
        dispatch(SET_CHECK_OUT(endDate));
    };

    return (
        <div className="md:py-4 rounded-3xl">
            <DateRange
                ranges={[selectionRange]}
                onChange={handleDatePicker}
                months={months || 2}
                direction="horizontal"
                showMonthAndYearPickers={false}
                rangeColors={['#F7F7F7']}
                minDate={new Date()}
                showDateDisplay={false}
                monthDisplayFormat="MMMM YYY"
                locale={vi}
            />
        </div>
    );
};

export default DateRangeCP;
