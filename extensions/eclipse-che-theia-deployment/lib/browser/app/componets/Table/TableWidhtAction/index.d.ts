import React from 'react';
export interface TableProps {
    columnsSource: string[];
    dataSource?: any[];
    loading?: boolean;
    actionEdit?: (i: string) => void;
    actionStop?: (i: string) => void;
}
declare const TableWidthAction: React.FC<TableProps>;
export default TableWidthAction;
//# sourceMappingURL=index.d.ts.map