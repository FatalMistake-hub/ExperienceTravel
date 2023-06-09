import dynamic from 'next/dynamic';
import Footer from '../common/Footer';
import { Header } from '../common/Header';
import { HeaderHosting } from '../common/HeaderHosting';

export default function HostingLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <HeaderHosting />
            <div className="pt-[76px] min-h-screen">{children}</div>
            <Footer />
        </>
    );
}
