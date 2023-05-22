import { Box, VStack, Text, Heading, Button, SimpleGrid, RadioGroup, Radio, Select } from '@chakra-ui/react';

import React, { ChangeEvent, FC, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { selectBecomeHost, SET_btnSTATUS, SET_CATEGORY, SET_TIMEBOOKEND, SET_TIMEBOOKSTART } from 'src/redux/slice/becomeHostSlice';
import { minuteToTime, TimeFrameList, timeToMinute } from 'src/utils/dateUntils';

const TimeFrameSt2: FC = () => {
    const { tour } = useAppSelector(selectBecomeHost);

    const dispatch = useAppDispatch();

    useMemo(() => {
        if (
            tour.timeBookStart.hour === undefined ||
            tour.timeBookStart.minutes === undefined ||
            tour.timeBookEnd.hour === undefined ||
            tour.timeBookEnd.minutes === undefined
        ) {
            dispatch(SET_btnSTATUS(true));
        } else {
            dispatch(SET_btnSTATUS(false));
        }
    }, [tour.timeBookStart.hour, tour.timeBookStart.minutes, tour.timeBookEnd.hour, tour.timeBookEnd.minutes]);
    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(SET_TIMEBOOKSTART(minuteToTime(event.target.value)));
    };
    const handleSelectChange1 = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(SET_TIMEBOOKEND(minuteToTime(event.target.value)));
    };

    const timeListStart = TimeFrameList(0, tour.timeSlotLength);

    let timeListEnd = [
        {
            hour: 0,
            minutes: 0,
        },
    ];
    if (tour.timeBookStart.hour !== undefined && tour.timeBookStart.minutes !== undefined) {
        timeListEnd = TimeFrameList(timeToMinute(tour.timeBookStart), tour.timeSlotLength);
        console.log(timeListEnd);
    }
    console.log('start', timeListStart);
    return (
        <>
            <div className="w-full justify-center  flex h-full px-20">
                <VStack w={'700px'} align={'left'} gap={2} mt={8}>
                    <Heading
                        lineHeight={1.2}
                        as="h1"
                        fontSize={'32px'}
                        fontWeight={'600'}
                        width={'full'}
                        // noOfLines={2}
                    >
                        Xác định khung giờ khả dụng cho trải nghiệm của bạn ?
                    </Heading>
                    <Text fontSize={'16px'} fontWeight={'500'} color={'gray.600'} pb={4}>
                        Bạn sẽ lên lịch ngày và giờ chính xác mà bạn sẵn sàng để thực hiện trải nghiệm trước khi đăng tải.
                    </Text>
                    <Text fontSize={'16px'} fontWeight={'500'} pt={4}>
                        Thời gian trải nghiệm bắt đầu
                    </Text>
                    <Select w={'50%'} size="lg" rounded={'lg'} focusBorderColor={'teal.500'} onChange={handleSelectChange}>
                        {timeListStart.map((rs) => (
                            <option value={timeToMinute(rs)} selected={timeToMinute(rs) === timeToMinute(tour.timeBookStart)}>
                                {rs.hour}:{rs.minutes === 0 ? '00' : rs.minutes}
                            </option>
                        ))}
                    </Select>{' '}
                    <Text fontSize={'16px'} fontWeight={'500'} pt={4}>
                        Thời gian trải nghiệm kết thúc
                    </Text>
                    <Select
                        w={'50%'}
                        size="lg"
                        rounded={'lg'}
                        focusBorderColor={'teal.500'}
                        onChange={handleSelectChange1}
                        isDisabled={!(tour.timeBookStart.hour !== undefined && tour.timeBookStart.minutes !== undefined)}
                    >
                        {timeListEnd?.map((rs) => (
                            <option value={timeToMinute(rs)} selected={timeToMinute(rs) === timeToMinute(tour.timeBookEnd)}>
                                {rs.hour}:{rs.minutes === 0 ? '00' : rs.minutes}
                            </option>
                        ))}
                    </Select>
                </VStack>
            </div>
        </>
    );
};

export default TimeFrameSt2;