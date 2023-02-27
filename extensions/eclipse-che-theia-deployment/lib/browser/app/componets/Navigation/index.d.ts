import React from 'react';
interface NavigationProps {
    currentView: string;
    viewList: Record<string, string>[];
    setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}
declare const Navigation: React.FC<NavigationProps>;
export default Navigation;
//# sourceMappingURL=index.d.ts.map