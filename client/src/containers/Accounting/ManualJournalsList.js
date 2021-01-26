import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Route, Switch, useHistory, withRouter } from 'react-router-dom';
import { queryCache, useQuery } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';
import AppToaster from 'components/AppToaster';
import {
  FormattedMessage as T,
  useIntl,
} from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import ManualJournalsViewTabs from 'containers/Accounting/ManualJournalsViewTabs';
import ManualJournalsDataTable from 'containers/Accounting/ManualJournalsDataTable';
import ManualJournalsActionsBar from 'containers/Accounting/ManualJournalActionsBar';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withManualJournals from 'containers/Accounting/withManualJournals';
import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';
import withViewsActions from 'containers/Views/withViewsActions';
import withRouteActions from 'containers/Router/withRouteActions';
import withResourceActions from 'containers/Resources/withResourcesActions';

import { compose } from 'utils';

import 'style/pages/ManualJournal/List.scss';

/**
 * Manual journals table.
 */
function ManualJournalsTable({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,

  // #withResourceActions
  requestFetchResourceFields,

  // #withManualJournals
  manualJournalsTableQuery,

  // #withManualJournalsActions
  requestFetchManualJournalsTable,
  requestDeleteManualJournal,
  requestPublishManualJournal,
  requestDeleteBulkManualJournals,
  addManualJournalsTableQueries,
}) {
  const history = useHistory();

  const [deleteManualJournal, setDeleteManualJournal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [publishManualJournal, setPublishManualJournal] = useState(false);

  const { formatMessage } = useIntl();

  const fetchResourceViews = useQuery(
    ['resource-views', 'manual-journals'],
    () => requestFetchResourceViews('manual_journals'),
  );

  // const fetchResourceFields = useQuery(
  //   ['resource-fields', 'manual-journals'],
  //   () => requestFetchResourceFields('manual_journals'),
  // );

  const fetchManualJournals = useQuery(
    ['manual-journals-table', manualJournalsTableQuery],
    (key, q) => requestFetchManualJournalsTable(),
  );

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'manual_journals' }));
  }, [changePageTitle, formatMessage]);

  // Handle delete manual journal click.
  const handleDeleteJournal = useCallback(
    (journal) => {
      setDeleteManualJournal(journal);
    },
    [setDeleteManualJournal],
  );

  // Handle cancel delete manual journal.
  const handleCancelManualJournalDelete = useCallback(() => {
    setDeleteManualJournal(false);
  }, [setDeleteManualJournal]);

  // Handle confirm delete manual journal.
  const handleConfirmManualJournalDelete = useCallback(() => {
    requestDeleteManualJournal(deleteManualJournal.id).then(() => {
      AppToaster.show({
        message: formatMessage(
          { id: 'the_journal_has_been_deleted_successfully' },
          { number: deleteManualJournal.journal_number },
        ),
        intent: Intent.SUCCESS,
      });
      setDeleteManualJournal(false);
    });
  }, [deleteManualJournal, requestDeleteManualJournal, formatMessage]);

  // Calculates the selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  const handleBulkDelete = useCallback(
    (accountsIds) => {
      setBulkDelete(accountsIds);
    },
    [setBulkDelete],
  );

  // Handle confirm journals bulk delete.
  const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkManualJournals(bulkDelete)
      .then(() => {
        setBulkDelete(false);
        AppToaster.show({
          message: formatMessage(
            { id: 'the_journals_has_been_deleted_successfully' },
            { count: selectedRowsCount },
          ),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {
        setBulkDelete(false);
      });
  }, [
    requestDeleteBulkManualJournals,
    bulkDelete,
    formatMessage,
    selectedRowsCount,
  ]);

  // Handle cancel bulk delete alert.
  const handleCancelBulkDelete = useCallback(() => {
    setBulkDelete(false);
  }, []);

  const handleEditJournal = useCallback(
    (journal) => {
      history.push(`/manual-journals/${journal.id}/edit`);
    },
    [history],
  );

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {}, []);

  // Handle view change to re-fetch data table.
  // const handleViewChanged = useCallback(() => {

  // }, [fetchManualJournals]);

  // Handle fetch data of manual jouranls datatable.
  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      const page = pageIndex + 1;

      addManualJournalsTableQueries({
        ...(sortBy.length > 0
          ? {
              column_sort_by: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
        page_size: pageSize,
        page,
      });
    },
    [addManualJournalsTableQueries],
  );

  // Handle publish manual Journal click.
  const handlePublishMaunalJournal = useCallback(
    (jouranl) => {
      setPublishManualJournal(jouranl);
    },
    [setPublishManualJournal],
  );

  // Handle cancel manual journal alert.
  const handleCancelPublishMaunalJournal = useCallback(() => {
    setPublishManualJournal(false);
  }, [setPublishManualJournal]);

  // Handle publish manual journal confirm.
  const handleConfirmPublishManualJournal = useCallback(() => {
    requestPublishManualJournal(publishManualJournal.id)
      .then(() => {
        setPublishManualJournal(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_manual_journal_has_been_published',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('manual-journals-table');
      })
      .catch((error) => {
        setPublishManualJournal(false);
      });
  }, [publishManualJournal, requestPublishManualJournal, formatMessage]);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (accounts) => {
      setSelectedRows(accounts);
    },
    [setSelectedRows],
  );

  return (
    <DashboardInsider
      loading={fetchResourceViews.isFetching}
      name={'manual-journals'}
    >
      <ManualJournalsActionsBar
        onBulkDelete={handleBulkDelete}
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
      />

      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/manual-journals/:custom_view_id/custom_view',
              '/manual-journals',
            ]}
          >
            <ManualJournalsViewTabs />

            <ManualJournalsDataTable
              onDeleteJournal={handleDeleteJournal}
              onEditJournal={handleEditJournal}
              onPublishJournal={handlePublishMaunalJournal}
              onSelectedRowsChange={handleSelectedRowsChange}
              manualJournalViewLoading={fetchManualJournals.isFetching}
            />
          </Route>
        </Switch>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon="trash"
          intent={Intent.DANGER}
          isOpen={deleteManualJournal}
          onCancel={handleCancelManualJournalDelete}
          onConfirm={handleConfirmManualJournalDelete}
        >
          <p>
            <T id={'once_delete_this_journal_you_will_able_to_restore_it'} />
          </p>
        </Alert>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={
            <T id={'delete_count'} values={{ count: selectedRowsCount }} />
          }
          icon="trash"
          intent={Intent.DANGER}
          isOpen={bulkDelete}
          onCancel={handleCancelBulkDelete}
          onConfirm={handleConfirmBulkDelete}
        >
          <p>
            <T
              id={'once_delete_these_journals_you_will_not_able_restore_them'}
            />
          </p>
        </Alert>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'publish'} />}
          intent={Intent.WARNING}
          isOpen={publishManualJournal}
          onCancel={handleCancelPublishMaunalJournal}
          onConfirm={handleConfirmPublishManualJournal}
        >
          <p>
            <T id={'are_sure_to_publish_this_manual_journal'} />
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withRouter,
  withRouteActions,
  withDashboardActions,
  withManualJournalsActions,
  withViewsActions,
  withResourceActions,
  withManualJournals(({ manualJournalsTableQuery }) => ({
    manualJournalsTableQuery,
  })),
)(ManualJournalsTable);
