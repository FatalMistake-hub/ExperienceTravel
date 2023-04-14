import React, { FC, useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    HStack,
    IconButton,
    LightMode,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    ToastId,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { FaAirbnb, FaGlobe, FaMoon, FaSearch, FaSun } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Link from 'next/link';
import LoginModal from '@components/Modal/LoginModal';
import Search from '@components/Search';
import SignUpModal from '@components/Modal/RegisterModal';
import { IExploreNearby } from 'src/types/interface';
import { EHeaderOpions } from 'src/types';
import { formatRangeDate } from 'src/utils/dateUntils';
import { formatGuests } from 'src/utils/guestsUtil';
import HeaderOption from './HeaderOption';

interface HeaderProps {
    exploreNearby?: IExploreNearby[];
    searchPage?: boolean;
    query?: any;
}
export const Header: FC<HeaderProps> = ({ exploreNearby, searchPage = true, query }) => {
    const { isOpen: isLoginOpen, onClose: onLoginClose, onOpen: onLoginOpen } = useDisclosure();
    const { isOpen: isSignUpOpen, onClose: onSignUpClose, onOpen: onSignUpOpen } = useDisclosure();
    const { toggleColorMode } = useColorMode();
    const logoColor = useColorModeValue('teal.500', 'teal.200');
    const Icon = useColorModeValue(FaMoon, FaSun);

    const [isSnapTop, setIsSnapTop] = useState<boolean>(searchPage ? false : true);
    const [isActiveSearch, setIsActiveSearch] = useState<boolean>(searchPage ? false : true);
    const [activeMenu, setActiveMenu] = useState<EHeaderOpions | null>(EHeaderOpions.PLACES_TO_STAY);

    const handleOnScroll = () => {
        const position = window.scrollY;
        if (position >= 50) {
            setIsSnapTop(false);
            setIsActiveSearch(false);
        } else {
            setIsSnapTop(true);
            setIsActiveSearch(true);
        }
    };
    const headerBehavior = () => {
        let style = [];
        if (!isSnapTop) style.push('bg-white shadow-lg');
        if (!isActiveSearch) style.push('bg-white shadow-lg h-[86px] pb-5');
        if (isActiveSearch) style.push('bg-white shadow-lg pb-8');
        return style.join(' ');
    };
    useEffect(() => {
        // listen to scroll
        if (!searchPage) {
            window.addEventListener('scroll', handleOnScroll);
        }
        return () => window.removeEventListener('scroll', handleOnScroll);
    }, [searchPage]);
    return (
        <>
            <header className={`${headerBehavior()} z-50 fixed top-0 w-full pt-5 duration-300 md:transition-none`}>
                {/* header top */}
                <div
                    className={`${
                        searchPage ? 'px-10' : 'container'
                    } hidden md:grid md:grid-cols-[auto,1fr,auto] xl:grid-cols-[1.5fr,3fr,1.5fr] 2xl:grid-cols-[1fr,3fr,0.75fr] items-start`}
                >
                    {/* left side - logo */}
                    <div className="flex items-center h-12">
                        <Link href="/">
                            <Box color={logoColor}>
                                <Link href={'/'}>
                                    <FaAirbnb size={'48'} />
                                </Link>
                            </Box>
                        </Link>
                    </div>
                    {/* small search bar */}
                    <button
                        className={`${isActiveSearch && ' scale-[1.33] translate-y-[75px] opacity-0 z-[-50] '} ${
                            searchPage ? 'pl-3' : 'pl-6'
                        } relative flex items-center h-12 pr-2 mx-auto text-left transform  border border-gray-200 rounded-full shadow-md cursor-pointer min-w-[320px] min-h-[50px] hover:shadow-lg md:absolute left-24 lg:left-auto lg:right-1/2 lg:translate-x-1/2 duration-200`}
                        onClick={() => setIsActiveSearch(true)}
                    >
                        {searchPage ? (
                            <span className="flex-grow text-sm font-medium tracking-wide text-gray-500">
                                <span className="px-4 py-1 border-r border-gay-200">
                                    {query?.location || <span className="font-normal text-gray-300">Location</span>}
                                </span>
                                <span className="px-4 py-1 border-r border-gay-200">
                                    {formatRangeDate(query?.checkIn, query?.checkOut) || (
                                        <span className="font-normal text-gray-300">Add dates</span>
                                    )}
                                </span>
                                <span className="px-4 py-1">
                                    {formatGuests(query?.guests, { noInfants: true }) || (
                                        <span className="font-normal text-gray-300">Add guests</span>
                                    )}
                                </span>
                            </span>
                        ) : (
                            <span className="flex-grow text-sm font-medium tracking-wide text-gray-500">Start your search</span>
                        )}
                        <Button
                            colorScheme="teal"
                            variant="solid"
                            type="submit"
                            rounded={'full'}
                            className={` flex items-center justify-center   h-12  rounded-full   hover:saturate-200`}
                        >
                            <FaSearch className="h-5 text-white" />
                        </Button>
                    </button>
                    {/* middle side navigation */}
                    <div className="relative flex flex-col items-center justify-center order-last col-span-2 xl:order-none xl:col-span-1">
                        <div className="text-white">
                            <HeaderOption
                                isSnap={isSnapTop}
                                isActiveHeader={isActiveSearch}
                                active={activeMenu === EHeaderOpions.PLACES_TO_STAY}
                                onClick={() => setActiveMenu(EHeaderOpions.PLACES_TO_STAY)}
                            >
                                Places to stay
                            </HeaderOption>
                            <HeaderOption
                                isSnap={isSnapTop}
                                isActiveHeader={isActiveSearch}
                                active={activeMenu === EHeaderOpions.FIND_EXPERIENCES}
                                onClick={() => setActiveMenu(EHeaderOpions.FIND_EXPERIENCES)}
                            >
                                Experiences
                            </HeaderOption>
                            <HeaderOption isSnap={isSnapTop} isActiveHeader={isActiveSearch}>
                                <Link href="/">
                                    <a>Online Experiences</a>
                                </Link>
                            </HeaderOption>
                        </div>
                    </div>
                    {/* right side */}
                    {/* <HStack spacing={2}></HStack> */}
                    <div className="flex items-center justify-between ">
                        <Link href="/">
                            <a
                                className={`${
                                    isSnapTop ? 'text-white hover: hover:bg-opacity-10' : 'text-gray-500 hover:bg-gray-100 '
                                } flex items-center h-10 px-4 rounded-full font-medium tracking-wide text-sm`}
                            >
                                Become a host
                            </a>
                        </Link>
                        <Link href="/">
                            <a
                                className={`${
                                    isSnapTop ? 'text-white hover: hover:bg-opacity-10' : 'text-gray-500 hover:bg-gray-100 '
                                } flex items-center h-10 px-3 mr-1 rounded-full `}
                            >
                                <FaGlobe className="h-5" />
                            </a>
                        </Link>
                        <IconButton onClick={toggleColorMode} variant={'ghost'} aria-label="Toggle dark mode" icon={<Icon />} />

                        <Menu>
                            <MenuButton
                                transition="all 0.2s"
                                borderRadius="full"
                                borderWidth="1px"
                                _hover={{ bg: 'gray.400' }}
                                _expanded={{ bg: 'teal.400' }}
                                _focus={{ boxShadow: 'outline' }}
                            >
                                <Avatar name="minhnhat" src="" size={'md'} />
                            </MenuButton>
                            <MenuList className="shadow-md">
                                <MenuItem onClick={onLoginOpen}>Log in</MenuItem>

                                <MenuItem onClick={onSignUpOpen}>Sign up</MenuItem>
                                <MenuDivider />
                                <Link href="/rooms/upload">
                                    <MenuItem>Upload room</MenuItem>
                                </Link>

                                <MenuItem>Log out</MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                </div>
                {/* main search bar */}
                <Search
                    menu={activeMenu}
                    isActiveHeader={isActiveSearch}
                    searchPage={searchPage}
                    closeSearch={() => setIsActiveSearch(false)}
                />
            </header>
            {/* background layer */}
            {isActiveSearch && !isSnapTop && (
                <div className="fixed inset-0 z-40 bg-transparent-black" onClick={() => setIsActiveSearch(false)} />
            )}
            <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
            <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
        </>
    );
};
