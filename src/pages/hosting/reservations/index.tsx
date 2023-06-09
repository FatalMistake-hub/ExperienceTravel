import {
    Heading,
    IconButton,
    VStack,
    Tabs,
    TabList,
    Tab,
    TabIndicator,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Flex,
    TableContainer,
    HStack,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useToast,
} from '@chakra-ui/react';
import Suspense from '@components/Supense';
import { useWallet } from '@solana/wallet-adapter-react';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BiCheck, BiChevronLeft, BiDotsHorizontal, BiX } from 'react-icons/bi';
import { Paginate } from 'react-paginate-chakra-ui';
import { useTour } from 'src/hooks/blockchain/useTour';
import useChangeStatusOrder from 'src/hooks/hosting/order/useChangeOrderStatus';
import useGetAllOwnerOrder from 'src/hooks/hosting/order/useGetAllOwnerOrder';
import useUpdateOrder from 'src/hooks/hosting/order/useUpdateOrder';
import { IOrder } from 'src/types/order.type';
import { EOrderStatus } from 'src/utils/constants/Enums';
import { handleColorStatus, handleNameStatus } from 'src/utils/hostUtil';

const Reservations = () => {
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
    };
    const { data: session } = useSession();
    const toast = useToast();
    const [page, setPage] = useState(1);
    const handlePageClick = (p: number) => setPage(p + 1);
    const { data, isLoading, isError, isSuccess } = useGetAllOwnerOrder(page, 6);
    const [loading, setLoading] = useState(false);
    const { changeStatus } = useChangeStatusOrder();
    const { addTour, updateTour } = useTour();
    const { connected, publicKey } = useWallet();
    const { updateOrder } = useUpdateOrder();
    const handleChangeStatusOrder = async (status: string, orderId: string, order: IOrder) => {
        setLoading(true);
        try {
            if (session?.user.accountAuthorize === publicKey?.toString() && connected) {
                if (status === EOrderStatus.SUCCESS) {
                    const response = await addTour({
                        orderId: order.orderId,
                        orderDate: order.orderDate,
                        price: order.price,
                        tour_title: order.tour_title,
                        imageMain: order.imageMain,
                        timeId: order.timeId,
                        userId: order.userId,
                    });
                    if (response?.publicKeyCreater === '' && response?.publicKeyOrder === '') {
                        throw new Error('Lỗi tạo tour');
                    } else {
                        await updateOrder({
                            orderIdBlockChain: response?.publicKeyOrder,
                            publicKey: response?.publicKeyCreater,
                            orderId: orderId,
                        });
                        await changeStatus({ orderId, status });
                    }
                } else {
                    await changeStatus({ orderId, status });
                }
            } else {
                toast({
                    title: 'Sử dụng không đúng ví',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                    position: 'top',
                });
            }
        } catch (e) {
            toast({
                title: 'Xác nhận thất bại',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top',
            });
        }
        setLoading(false);
    };
    return (
        <div className="px-6 min-h-screen">
            {loading && <Suspense />}

            <VStack float={'left'} alignItems={'flex-start'} w={'full'} className=" border-b border-b-gray-900">
                <IconButton
                    aria-label="back"
                    icon={<BiChevronLeft />}
                    size={'lg'}
                    float={'left'}
                    rounded={'full'}
                    colorScheme={'blackAlpha'}
                    color={'black'}
                    variant={'ghost'}
                    fontSize={'24px'}
                    mt={3}
                    ml={-3}
                />
                <Heading lineHeight={1.4} as="h1" fontSize={'32px'} fontWeight={'600'} width={'full'} noOfLines={2} pt={3} pb={6}>
                    Đặt trải nghiệm
                </Heading>
                <div className="w-full border-b border-b-gray-900 ">
                    <Tabs position="relative" variant="unstyled">
                        <TabList>
                            <Tab
                                className="rounded-xl font-semibold  hover:bg-gray-100"
                                onClick={() => {
                                    handleStatusChange('');
                                }}
                            >
                                Tất cả
                            </Tab>
                            <Tab
                                className="rounded-xl font-semibold  hover:bg-gray-100 "
                                onClick={() => {
                                    handleStatusChange('WAITING');
                                }}
                            >
                                Chờ xác nhận
                            </Tab>
                            <Tab
                                className="rounded-xl font-semibold  hover:bg-gray-100"
                                onClick={() => {
                                    handleStatusChange('SUCCESS');
                                }}
                            >
                                Đã xác nhận
                            </Tab>
                            <Tab
                                className="rounded-xl font-semibold  hover:bg-gray-100"
                                onClick={() => {
                                    handleStatusChange('USED');
                                }}
                            >
                                Đã hoàn tất
                            </Tab>
                            <Tab
                                className="rounded-xl font-semibold  hover:bg-gray-100"
                                onClick={() => {
                                    handleStatusChange('CANCEL');
                                }}
                            >
                                Đã hủy
                            </Tab>
                        </TabList>
                        <TabIndicator mt="-1.5px" height="2px" bg="teal.500" borderRadius="1px" />
                    </Tabs>
                </div>
                {/* <Text py={'128px'} fontSize={'18px'} fontWeight={700} w={'full'} textAlign={'center'}>
                    Bạn không có yêu cầu đặt phòng nào
                </Text> */}
            </VStack>
            <TableContainer borderBottom={'none'} w={'full'} pt={6} h={'60vh'} overflowY={'scroll'}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Trạng thái</Th>

                            <Th>Người đặt</Th>
                            <Th>Bắt đầu</Th>
                            <Th>Đặt lúc</Th>
                            <Th>Trải nghiệm</Th>
                            <Th>Tổng thanh toán</Th>
                            <Th></Th>

                            {/* <Th isNumeric>multiply by</Th> */}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.content
                            ?.filter((order) => !selectedStatus || order.statusOrder === selectedStatus)
                            .sort((a: IOrder, b: IOrder) => {
                                const dateA = new Date(a.orderDate);
                                const dateB = new Date(b.orderDate);

                                return dateB.getTime() - dateA.getTime();
                            })
                            .map((order: IOrder) => (
                                <Tr className=" rounded-2xl hover:bg-gray-100 ">
                                    <Td>
                                        <Badge px={2} rounded={'xl'} variant="solid" colorScheme={handleColorStatus(order.statusOrder)}>
                                            {handleNameStatus(order.statusOrder)}
                                        </Badge>
                                    </Td>

                                    <Td>
                                        <VStack float={'left'} alignItems={'flex-start'}>
                                            <Text
                                                fontSize={'16px'}
                                                fontWeight={600}
                                                noOfLines={1}
                                                as={'p'}
                                                color={'teal'}
                                                textAlign={'left'}
                                            >
                                                {order.user.userName}
                                            </Text>
                                            {/* <Text fontSize={'12px'} fontWeight={400} noOfLines={1} as={'p'} textAlign={'left'}>
                                                6 adults, 2 children, 1 infant
                                            </Text> */}
                                        </VStack>
                                    </Td>
                                    <Td>
                                        <VStack float={'left'} alignItems={'flex-start'}>
                                            <Text fontSize={'16px'} fontWeight={400} noOfLines={1} as={'p'} textAlign={'left'}>
                                                {moment(order.date_name).format('DD MMM YYYY')}
                                            </Text>
                                            <Text fontSize={'12px'} fontWeight={300} noOfLines={1} as={'p'} textAlign={'left'}>
                                                {order.timeBookViewDto.start_time.slice(0, 5)}
                                            </Text>
                                        </VStack>
                                    </Td>
                                    <Td>
                                        <VStack float={'left'} alignItems={'flex-start'}>
                                            <Text fontSize={'16px'} fontWeight={400} noOfLines={1} as={'p'} textAlign={'left'}>
                                                {moment(order.orderDate).format('DD MMM YYYY')}
                                            </Text>
                                            <Text fontSize={'12px'} fontWeight={300} noOfLines={1} as={'p'} textAlign={'left'}>
                                                {moment(order.orderDate).format('HH:mm')}
                                            </Text>
                                        </VStack>
                                    </Td>
                                    <Td>
                                        <Flex alignItems={'center'}>{order.tour_title}</Flex>
                                    </Td>
                                    <Td>{order.price.toLocaleString('vi-VN')}₫</Td>
                                    <Td minW={'300px'}>
                                        <HStack justifyContent={'flex-end'} gap={2}>
                                            <Button variant={'outline'} colorScheme={'teal'}>
                                                Chi tiết
                                            </Button>
                                            {order.statusOrder === 'WAITING' && (
                                                <Menu>
                                                    <MenuButton
                                                        as={IconButton}
                                                        aria-label="Options"
                                                        icon={<BiDotsHorizontal />}
                                                        variant="outline"
                                                        colorScheme="blackAlpha"
                                                    />
                                                    <MenuList maxW={'40px'}>
                                                        <>
                                                            <MenuItem
                                                                _hover={{ backgroundColor: ' #23ce1483 ' }}
                                                                className="flex justify-between "
                                                                onClick={() => {
                                                                    handleChangeStatusOrder('SUCCESS', order.orderId, order);
                                                                }}
                                                            >
                                                                <Text fontWeight={500}> Xác nhận</Text>
                                                                <BiCheck color="green" size={24} />
                                                            </MenuItem>
                                                            <MenuItem
                                                                _hover={{ backgroundColor: ' #fa2b2b83 ' }}
                                                                className="flex justify-between"
                                                                onClick={() => {
                                                                    handleChangeStatusOrder('CANCEL', order.orderId, order);
                                                                }}
                                                            >
                                                                <Text fontWeight={500}> Huỷ</Text>
                                                                <BiX color="red" size={24} />
                                                            </MenuItem>
                                                        </>
                                                    </MenuList>
                                                </Menu>
                                            )}
                                        </HStack>
                                    </Td>

                                    {/* <Td isNumeric>25.4</Td> */}
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <div className="w-full justify-center flex ">
                {data?.totalPages && (
                    <Paginate
                        // required props 👇
                        page={page - 1}
                        count={data?.totalPages * 10}
                        pageSize={10}
                        onPageChange={handlePageClick}
                        // optional props 👇
                        margin={2}
                        shadow="lg"
                        // fontWeight="blue"
                        variant="outline"
                        colorScheme="teal"
                        // ...border and other props also work 💪
                        // border="2px solid"
                        // you can use w to adjust to parent
                        // container
                        // w="400px"
                    />
                )}
            </div>
        </div>
    );
};

export default Reservations;
Reservations.Layout = 'HostingLayout';
Reservations.requireAuth = true;
