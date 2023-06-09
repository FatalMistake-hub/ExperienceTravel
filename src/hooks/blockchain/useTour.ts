import * as anchor from '@project-serum/anchor';
import { useEffect, useMemo, useState } from 'react';
import tourIDL from '../../utils/constants/tour.json';
import { SystemProgram } from '@solana/web3.js';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@chakra-ui/react';
import { TOUR_PROGRAM_PUBKEY } from 'src/utils/constants/programPubkey';
import { IOrder } from 'src/types/order.type';

// Static data that reflects the todo struct of the solana program

export function useTour() {
    const toast = useToast();

    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const anchorWallet = useAnchorWallet();

    const [initialized, setInitialized] = useState(false);
    const [user, setUser] = useState({});
    const [tours, setTours] = useState<any>([]);
    const [lastTour, setLastTour] = useState(0);
    const [loading, setLoading] = useState(false);
    const [transactionPending, setTransactionPending] = useState(false);

    const program = useMemo(() => {
        if (anchorWallet) {
            const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions());
            return new anchor.Program(tourIDL as anchor.Idl, TOUR_PROGRAM_PUBKEY, provider);
        }
    }, [connection, anchorWallet]);

    useEffect(() => {
        const start = async () => {
            if (program && publicKey && !transactionPending) {
                try {
                    const [profilePda, profileBump] = await findProgramAddressSync(
                        [utf8.encode('USER_STATE'), publicKey.toBuffer()],
                        program.programId,
                    );
                    const profileAccount = await program.account.userProfile.fetch(profilePda);
                    if (profileAccount) {
                        setLastTour(profileAccount.lastTour);
                        setInitialized(true);
                        setLoading(true);
                        const listings = await program.account.tourAccount.all();
                        setUser(profileAccount.toString());

                        const myTour = listings.filter(
                            (booking) => booking.account.authority.toString() == profileAccount.authority.toString(),
                        );

                        setTours(myTour);
                    } else {
                        setInitialized(false);
                    }
                } catch (error) {
                    console.log(error);
                    setInitialized(false);
                } finally {
                    setLoading(false);
                }
            }
        };
        start();
    }, [publicKey, program, transactionPending]);

    const initializeUser = async () => {
        if (program && publicKey) {
            try {
                setTransactionPending(true);
                setLoading(true);
                const [profilePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId);

                const tx = await program.methods
                    .initializeUser()
                    .accounts({
                        userProfile: profilePda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc();
                setInitialized(true);
                toast({
                    title: 'Successfully initialized user.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top',
                });
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                setTransactionPending(false);
            }
        }
    };

    const addTour = async ({
        orderId,
        orderDate,
        price,
        tour_title,
        imageMain,
        timeId,
        userId,
    }: Omit<
        IOrder,
        'priceOnePerson' | 'statusOrder' | 'city' | 'orderIdBlockChain' | 'publicKey' | 'timeBookViewDto' | 'date_name' | 'tourId' | 'user'
    >) => {
        if (program && publicKey) {
            setTransactionPending(true);
            setLoading(true);
            try {
                const [profilePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId);
                const [tourPda] = findProgramAddressSync(
                    [utf8.encode('TOUR_STATE'), publicKey.toBuffer(), Uint8Array.from([lastTour])],
                    program.programId,
                );
                await program.methods
                    .addTour(orderId, String(price), tour_title, imageMain, timeId, userId, orderDate)
                    .accounts({
                        userProfile: profilePda,
                        tourAccount: tourPda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                    

                return { publicKeyCreater: publicKey.toString(), publicKeyOrder: tourPda.toString() };
            } catch (error) {
                console.error(error);
            } finally {
                setTransactionPending(false);
                setLoading(false);
            }
        }
    };

    const updateTour = async ({ tourPda, tourIdx }: { tourPda: string; tourIdx: number }) => {
        console.log(tourPda.toString());
        if (program && publicKey) {
            try {
                setLoading(true);
                setTransactionPending(true);
                const [profilePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId);

                await program.methods
                    .updateTour(tourIdx)
                    .accounts({
                        userProfile: profilePda,
                        tourAccount: tourPda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc();
            } catch (error) {
                toast({
                    title: 'Error EDIT TOUR.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top',
                });
            } finally {
                setLoading(false);
                setTransactionPending(false);
            }
        }
    };
    return {
        tours,
        addTour,
        updateTour,
        initializeUser,
        initialized,
        loading,
        transactionPending,
    };
}
