import { SimpleGrid, Box, Text, IconButton, Tag, TagLabel, useToast } from '@chakra-ui/react';
import Image from 'next/image';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BiUpload, BiX } from 'react-icons/bi';
import useMutateTourImg from 'src/hooks/guest/tours/mutateImg/useMutateTourImg';
import usePostToCloudinary from 'src/hooks/imageCloudinary/usePostToCloudinary';

import { IImageTour, ITours } from 'src/types/tours.type';
type Props = {
    data: IImageTour[] | undefined;
    imageMain: string | undefined;
    tourId: number | undefined;
};
const ImageList = ({ data, imageMain, tourId }: Props) => {
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { mutationAdd, mutationDel, mutationUpdate } = useMutateTourImg(tourId);
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.png'],
        },
        onDrop: async (acceptedFiles) => {
            setLoading(true);
            const listLink = await Promise.all(
                acceptedFiles.map(async (file) => {
                    const link = await usePostToCloudinary(file);
                    return link;
                }),
            );
            const transformedData = await listLink.map((item) => ({
                link: item.link as string,
                tourId: tourId,
            }));
            console.log(transformedData);
            await mutationAdd.mutateAsync(transformedData);
            setLoading(false);
        },
    });
    const DropMain = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.png'],
            // 'count': 1,
        },
        onDrop: async (acceptedFiles) => {
            setLoading(true);
            const listLink = await Promise.all(
                acceptedFiles.map(async (file) => {
                    const link = await usePostToCloudinary(file);
                    return link;
                }),
            );

            // await mutationAdd.mutateAsync(listLink[0]);
            setLoading(false);
        },
    });
    return (
        <SimpleGrid minChildWidth="300px" spacing="40px" mt={4}>
            <Box key={imageMain} height="200px" position={'relative'}>
                {imageMain && (
                    <Image
                        src={imageMain}
                        alt={`Picture of `}
                        layout="fill"
                        objectFit="cover"
                        placeholder="blur"
                        blurDataURL={imageMain}
                        className={'rounded-[12px]'}
                    />
                )}
                <input {...DropMain.getInputProps()} />
                <IconButton
                    aria-label="del"
                    icon={<BiUpload />}
                    position={'absolute'}
                    top={3}
                    right={3}
                    rounded={'full'}
                    size={'sm'}
                    bgColor={'white'}
                    onClick={open}
                />
                <Tag
                    size={'md'}
                    key={'size'}
                    borderRadius="md"
                    p={2}
                    variant="solid"
                    color={'black'}
                    bgColor={'white'}
                    position={'absolute'}
                    top={3}
                    left={3}
                >
                    <TagLabel>Ảnh bìa</TagLabel>
                </Tag>
            </Box>
            {data?.map(
                (item) =>
                    item.link != imageMain && (
                        <Box height="200px" position={'relative'}>
                            <Image
                                src={item.link}
                                alt={`Picture of `}
                                layout="fill"
                                objectFit="cover"
                                placeholder="blur"
                                blurDataURL={item.link}
                                className={'rounded-[12px]'}
                            />
                            {/* <IconButton
                                aria-label="del"
                                icon={<BiUpload />}
                                position={'absolute'}
                                top={3}
                                right={3}
                                rounded={'full'}
                                size={'sm'}
                                bgColor={'white'}
                                // onClick={() => )}
                            /> */}
                            <IconButton
                                aria-label="del"
                                icon={<BiX />}
                                position={'absolute'}
                                top={3}
                                right={3}
                                rounded={'full'}
                                size={'sm'}
                                bgColor={'white'}
                                onClick={() => {
                                    if (data.length <= 5) {
                                        toast({
                                            title: 'Cảnh báo',
                                            description: 'Phải có ít nhất 5 ảnh',
                                            status: 'warning',
                                            duration: 5000,
                                            isClosable: true,
                                        });
                                    } else {
                                        mutationDel.mutate(item.imageId);
                                    }
                                }}
                            />
                        </Box>
                    ),
            )}

            <Box height="200px" position={'relative'}>
                <Box
                    onClick={open}
                    {...getRootProps({ className: 'dropzone' })}
                    p={10}
                    className="flex flex-col items-center justify-center w-full h-full border-dashed border-black border hover:border-solid"
                >
                    <svg
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="presentation"
                        focusable="false"
                        className="w-8 h-8"
                    >
                        <path d="m27 3c2.209139 0 4 1.790861 4 4v18c0 2.209139-1.790861 4-4 4h-22c-2.209139 0-4-1.790861-4-4v-18c0-2.209139 1.790861-4 4-4zm-18.11289944 16.0381317-.09420734.0831886-5.79289322 5.7926797v.086c0 1.0543618.81587779 1.9181651 1.85073766 1.9945143l.14926234.0054857h13.085l-7.8778932-7.8786797c-.36048398-.3604839-.92771504-.3882135-1.32000624-.0831886zm12.50000004-6-.0942074.0831886-7.1288932 7.1286797 6.751 6.75h6.085c1.0543618 0 1.9181651-.8158778 1.9945143-1.8507377l.0054857-.1492623v-5.585l-6.2928932-6.2936797c-.360484-.3604839-.927715-.3882135-1.3200062-.0831886zm5.6128994-8.0381317h-22c-1.1045695 0-2 .8954305-2 2v15.084l4.37867966-4.3768932c1.12470996-1.12471 2.92027284-1.1696984 4.09865104-.1349652l.1439896.1349652 1.1276797 1.1278932 7.1296797-7.1278932c1.1247099-1.12471 2.9202728-1.1696984 4.098651-.1349652l.1439896.1349652 4.8786797 4.8778932v-9.585c0-1.0543618-.8158778-1.91816512-1.8507377-1.99451426zm-19 2c1.65685425 0 3 1.34314575 3 3 0 1.6568542-1.34314575 3-3 3s-3-1.3431458-3-3c0-1.65685425 1.34314575-3 3-3zm0 2c-.55228475 0-1 .44771525-1 1 0 .5522847.44771525 1 1 1s1-.4477153 1-1c0-.55228475-.44771525-1-1-1z"></path>
                    </svg>
                    <input {...getInputProps()} />

                    <Text mt={2} fontSize={'14px'} fontWeight={600}>
                        Bổ sung thêm
                    </Text>
                </Box>
            </Box>
        </SimpleGrid>
    );
};

export default ImageList;
