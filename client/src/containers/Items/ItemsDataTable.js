import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core'
import {compose} from 'utils';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Money from 'components/Money';

import withItems from 'containers/Items/withItems';
import LoadingIndicator from 'components/LoadingIndicator';


const ItemsDataTable = ({
  loading,

  // #withItems
  itemsTableLoading,
  itemsCurrentPage,

  // props
  onEditItem,
  onDeleteItem,
  onFetchData,
  onSelectedRowsChange,
}) => {
  const [initialMount, setInitialMount] = useState(false);

  useEffect(() => {
    if (!itemsTableLoading) {
      setInitialMount(true);
    }
  }, [itemsTableLoading, setInitialMount]);

  const handleEditItem = (item) => () => { onEditItem(item); };
  const handleDeleteItem = (item) => () => { onDeleteItem(item); };
  
  const actionMenuList = useCallback((item) =>
    (<Menu>
      <MenuItem text="View Details" />
      <MenuDivider />
      <MenuItem text="Edit Item" onClick={handleEditItem(item)} />
      <MenuItem text="Delete Item" onClick={handleDeleteItem(item)} />
    </Menu>), [handleEditItem, handleDeleteItem]);

  const columns = useMemo(() => [
    {
      Header: 'Item Name',
      accessor: 'name',
      className: "actions",
    },
    {
      Header: 'SKU',
      accessor: 'sku',
      className: "sku",
    },
    {
      Header: 'Category',
      accessor: 'category.name',
      className: 'category',
    },
    {
      Header: 'Sell Price',
      accessor: row => (<Money amount={row.sell_price} currency={'USD'} />),
      className: 'sell-price',
    },
    {
      Header: 'Cost Price',
      accessor: row => (<Money amount={row.cost_price} currency={'USD'} />),
      className: 'cost-price',
    },
    // {
    //   Header: 'Cost Account',
    //   accessor: 'cost_account.name',
    //   className: "cost-account",
    // },
    // {
    //   Header: 'Sell Account',
    //   accessor: 'sell_account.name',
    //   className: "sell-account",
    // },
    // {
    //   Header: 'Inventory Account',
    //   accessor: 'inventory_account.name',
    //   className: "inventory-account",
    // },
    {
      id: 'actions',
      Cell: ({ cell }) => (
        <Popover
          content={actionMenuList(cell.row.original)}
          position={Position.RIGHT_BOTTOM}>
          <Button icon={<Icon icon="ellipsis-h" />} />
        </Popover>
      ),
      className: 'actions',
      width: 50,
    },
  ], [actionMenuList]);

  const selectionColumn = useMemo(() => ({
    minWidth: 42,
    width: 42,
    maxWidth: 42,
  }), []);

  const handleFetchData = useCallback((...args) => {
    onFetchData && onFetchData(...args)
  }, [onFetchData]);

  const handleSelectedRowsChange = useCallback((selectedRows) => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRows.map(s => s.original));
  }, [onSelectedRowsChange]);

  return (
    <LoadingIndicator loading={loading} mount={false}>
      <DataTable
        columns={columns}
        data={itemsCurrentPage}
        selectionColumn={selectionColumn}
        onFetchData={handleFetchData}
        loading={itemsTableLoading && !initialMount}
        noInitialFetch={true}
        onSelectedRowsChange={handleSelectedRowsChange} />
    </LoadingIndicator>
  );
};

export default compose(
  withItems(({ itemsCurrentPage, itemsTableLoading }) => ({
    itemsCurrentPage,
    itemsTableLoading,
  })),
)(ItemsDataTable);