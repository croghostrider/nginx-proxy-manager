import { useEffect, useMemo } from "react";

import {
	tableEvents,
	ActionsFormatter,
	DomainsFormatter,
	GravatarFormatter,
	HostStatusFormatter,
	HostTypeFormatter,
	IDFormatter,
	TableFilter,
	TableLayout,
	TablePagination,
	TableSortBy,
	TextFilter,
} from "components";
import { intl } from "locale";
import { FiEdit } from "react-icons/fi";
import { useSortBy, useFilters, useTable, usePagination } from "react-table";

const rowActions = [
	{
		title: intl.formatMessage({ id: "action.edit" }),
		onClick: (e: any, data: any) => {
			alert(JSON.stringify(data, null, 2));
		},
		icon: <FiEdit />,
		show: (data: any) => !data.isSystem,
	},
];

export interface HostsTableProps {
	data: any;
	pagination: TablePagination;
	sortBy: TableSortBy[];
	filters: TableFilter[];
	onTableEvent: any;
}
function HostsTable({
	data,
	pagination,
	onTableEvent,
	sortBy,
	filters,
}: HostsTableProps) {
	const [columns, tableData] = useMemo(() => {
		const columns: any[] = [
			{
				accessor: "user.gravatarUrl",
				Cell: GravatarFormatter(),
				className: "w-80",
			},
			{
				Header: intl.formatMessage({ id: "column.id" }),
				accessor: "id",
				Cell: IDFormatter(),
				className: "w-80",
			},
			{
				Header: intl.formatMessage({ id: "column.domain-names" }),
				accessor: "domainNames",
				Cell: DomainsFormatter(),
				sortable: true,
				Filter: TextFilter,
			},
			{
				Header: intl.formatMessage({ id: "column.type" }),
				accessor: "type",
				Cell: HostTypeFormatter(),
				sortable: true,
				Filter: TextFilter,
			},
			{
				Header: intl.formatMessage({ id: "column.validation-type" }),
				accessor: "certificate.type",
			},
			{
				Header: intl.formatMessage({ id: "column.status" }),
				accessor: "isDisabled",
				Cell: HostStatusFormatter(),
			},
			{
				id: "actions",
				accessor: "id",
				Cell: ActionsFormatter(rowActions),
				className: "w-80",
			},
		];
		return [columns, data];
	}, [data]);

	const tableInstance = useTable(
		{
			columns,
			data: tableData,
			initialState: {
				pageIndex: Math.floor(pagination.offset / pagination.limit),
				pageSize: pagination.limit,
				sortBy,
				filters,
			},
			// Tell the usePagination
			// hook that we'll handle our own data fetching
			// This means we'll also have to provide our own
			// pageCount.
			pageCount: Math.ceil(pagination.total / pagination.limit),
			manualPagination: true,
			// Sorting options
			manualSortBy: true,
			disableMultiSort: true,
			disableSortRemove: true,
			autoResetSortBy: false,
			// Filter options
			manualFilters: true,
			autoResetFilters: false,
		},
		useFilters,
		useSortBy,
		usePagination,
	);

	const gotoPage = tableInstance.gotoPage;

	useEffect(() => {
		onTableEvent({
			type: tableEvents.PAGE_CHANGED,
			payload: tableInstance.state.pageIndex,
		});
	}, [onTableEvent, tableInstance.state.pageIndex]);

	useEffect(() => {
		onTableEvent({
			type: tableEvents.PAGE_SIZE_CHANGED,
			payload: tableInstance.state.pageSize,
		});
		gotoPage(0);
	}, [gotoPage, onTableEvent, tableInstance.state.pageSize]);

	useEffect(() => {
		if (pagination.total) {
			onTableEvent({
				type: tableEvents.TOTAL_COUNT_CHANGED,
				payload: pagination.total,
			});
		}
	}, [pagination.total, onTableEvent]);

	useEffect(() => {
		onTableEvent({
			type: tableEvents.SORT_CHANGED,
			payload: tableInstance.state.sortBy,
		});
	}, [onTableEvent, tableInstance.state.sortBy]);

	useEffect(() => {
		onTableEvent({
			type: tableEvents.FILTERS_CHANGED,
			payload: tableInstance.state.filters,
		});
	}, [onTableEvent, tableInstance.state.filters]);

	return <TableLayout pagination={pagination} {...tableInstance} />;
}

export { HostsTable };
