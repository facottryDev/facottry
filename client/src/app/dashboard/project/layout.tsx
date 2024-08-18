import { ReactNode } from 'react';
import OnboardingNav from "../OnboardingNav";

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <div>
            <OnboardingNav />
            <main>{children}</main>
            <footer>
                {/* Footer content */}
            </footer>
        </div>
    );
};

export default Layout;