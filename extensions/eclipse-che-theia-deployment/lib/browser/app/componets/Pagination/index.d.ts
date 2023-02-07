import React from 'react';
import { PaginationState } from '../../../../common/ifaces';
interface PaginationProps {
    skip: number;
    total: number;
    limit: number;
    setState: React.Dispatch<React.SetStateAction<PaginationState>>;
}
declare const Pagination: React.FC<PaginationProps>;
export default Pagination;
//# sourceMappingURL=index.d.ts.map