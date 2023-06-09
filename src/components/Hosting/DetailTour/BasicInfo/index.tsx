import { VStack, StackDivider, Button, Text, useDisclosure, Fade, Box, Textarea } from '@chakra-ui/react';
import TourFormWrapper from '@components/Wrapper/TourFormWrapper';
import { useState } from 'react';
import { ITours } from 'src/types/tours.type';
type Props = {
    value: Partial<ITours>;
    tourId?: string;
};
const BasicInfo = ({ tourId, value }: Props) => {
    const { isOpen, onToggle } = useDisclosure();
    const Disclosure1 = useDisclosure();
    const [title, setTitle] = useState(value.title);
    const [working, setWorking] = useState(value.working);
    return (
        <>
            <VStack divider={<StackDivider borderColor="black.200" />} align="stretch" width={'full'} spacing={6}>
                <Box>
                    <div className="py-2 flex items-start justify-between w-full">
                        <div>
                            <Text mb={1} fontSize={'16px'} fontWeight={400}>
                                Tiêu đề trải nghiệm
                            </Text>
                            <Text mb={1} fontSize={'14px'} color={'gray.600'}>
                                {value?.title}
                            </Text>
                        </div>
                        <div className="flex flex-col items-end">
                            <Button
                                size={'sm'}
                                variant={'ghost'}
                                textDecoration={'underline'}
                                color={'black'}
                                rounded={'lg'}
                                onClick={onToggle}
                            >
                                {!isOpen ? 'Chỉnh sửa' : 'Thu gọn'}
                            </Button>
                        </div>
                    </div>
                    <Fade in={isOpen}>
                        <Box display={isOpen ? 'block' : 'none'}>
                            <TourFormWrapper value={{ title: title }} tourId={tourId}>
                                <Text
                                    fontSize={'16px'}
                                    fontWeight={'600'}
                                    width={'full'}
                                    // noOfLines={2}
                                    letterSpacing={'tight'}
                                >
                                    Hãy đặt tên cho trải nghiệm của bạn
                                </Text>
                                <Text fontSize={'14px'} fontWeight={'400'}>
                                    Tạo một tiêu đề mô tả sắc nét và độc đáo để khách hàng hiểu rõ về những gì bạn đang cung cấp.
                                </Text>
                                <Textarea
                                    focusBorderColor={'teal.500'}
                                    resize={'vertical'}
                                    p={4}
                                    mt={4}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={title ? title : 'Những viên ngọc ẩn giấu của Hội An xưa'}
                                    fontSize={'base'}
                                    size="sm"
                                    rounded={'lg'}
                                    colorScheme={'teal'}
                                    w={'70%'}
                                    fontWeight={'600'}
                                    _placeholder={{ color: 'gray.300' }}
                                    minH={'100px'}
                                />
                            </TourFormWrapper>
                        </Box>
                    </Fade>
                </Box>
                <Box>
                    <div className="py-2 flex items-start justify-between w-full">
                        <div>
                            <Text mb={1} fontSize={'16px'} fontWeight={400}>
                                Mô tả trải nghiệm cho thuê
                            </Text>
                            <Text mb={1} fontSize={'14px'} color={'gray.600'} noOfLines={2} maxW={'50%'}>
                                {value?.working}
                            </Text>
                        </div>
                        <div className="flex flex-col items-end">
                            <Button
                                size={'sm'}
                                variant={'ghost'}
                                textDecoration={'underline'}
                                color={'black'}
                                rounded={'lg'}
                                onClick={Disclosure1.onToggle}
                            >
                                {!Disclosure1.isOpen ? 'Chỉnh sửa' : 'Thu gọn'}
                            </Button>
                        </div>
                    </div>
                    <Fade in={Disclosure1.isOpen}>
                        <Box display={Disclosure1.isOpen ? 'block' : 'none'}>
                            <TourFormWrapper value={{ working: working }} tourId={tourId}>
                                <Text
                                    fontSize={'16px'}
                                    fontWeight={'600'}
                                    width={'full'}
                                    // noOfLines={2}
                                    letterSpacing={'tight'}
                                >
                                    Hãy mô tả về trải nghiệm của bạn
                                </Text>
                                <Text fontSize={'14px'} fontWeight={'400'}>
                                    Bạn và khách tham gia sẽ làm gì?
                                </Text>
                                <Textarea
                                    focusBorderColor={'teal.500'}
                                    resize={'vertical'}
                                    p={4}
                                    mt={4}
                                    value={working?.replace(/<br\/>/g, '\n')}
                                    onChange={(e) => setWorking(e.target.value.replace(/\n/g, '<br/>'))}
                                    placeholder={
                                        working
                                            ? working
                                            : 'Kể cho khách nghe câu chuyện về những gì họ sẽ làm trong buổi trải nghiệm của bạn'
                                    }
                                    fontSize={'base'}
                                    size="sm"
                                    rounded={'lg'}
                                    colorScheme={'teal'}
                                    w={'70%'}
                                    fontWeight={'600'}
                                    _placeholder={{ color: 'gray.300' }}
                                    minH={'100px'}
                                />
                            </TourFormWrapper>
                        </Box>
                    </Fade>
                </Box>
            </VStack>
        </>
    );
};

export default BasicInfo;
