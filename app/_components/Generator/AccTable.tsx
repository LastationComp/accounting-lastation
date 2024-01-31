'use client';

import { generateAccHeaderTable } from '@/app/_lib/Generator/HeaderAccTable';
import { faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react';
import React, { useMemo, useState } from 'react';

interface AccTable {
  columns: any[];
  data?: any[];
  isLoading?: any;
  searchPlaceholder?: string;
  isSearchable?: boolean;
  searchFilterColumn?: string[];
  extraContent?: JSX.Element;
}

export default function AccTable({ columns, data = [], isLoading = false, extraContent, isSearchable = false, searchFilterColumn = [] }: AccTable) {
  const columnsFinal: any[] = generateAccHeaderTable(columns);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const pages = Math.ceil(data.length / rowsPerPage);

  const filtered = (filter: any) => {
    let result = true;

    if (isSearchable) {
      searchFilterColumn.every((filterColumn: string) => {
        const searchFilter = filterColumn.toLocaleLowerCase().replaceAll(' ', '_');
        const regex = new RegExp(`${search}`, 'gi');
        result = regex.test(filter[searchFilter]);
        if (!result) return true;
      });
    }

    return result;
  };

  const generateSearchPlaceHolder = () => {
    if (searchFilterColumn.length === 0) return 'Search something...';

    let text = 'Search by ';

    searchFilterColumn.forEach((filterColumn, i) => {
      if (i === 0) return (text += filterColumn);

      return (text += ' or ' + filterColumn);
    });

    return text;
  };
  const TopContent = () => {
    return (
      <div className="flex justify-between items-center">
        {extraContent}
        {isSearchable && <Input type="search" className="w-1/2" value={search} onValueChange={(val) => setSearch(val)} size={'sm'} placeholder={generateSearchPlaceHolder()} startContent={<FontAwesomeIcon icon={faSearch} />} />}
      </div>
    );
  };

  const BottomContent = () => {
    if (pages === 0) return;
    return (
      <div className="flex items-center justify-between">
        <Dropdown>
          <DropdownTrigger>
            <Button variant={'light'} endContent={<FontAwesomeIcon icon={faCaretDown} />}>
              Rows per Page : {rowsPerPage}
            </Button>
          </DropdownTrigger>
          <DropdownMenu onAction={(key) => setRowsPerPage(Number(key))}>
            <DropdownItem key={'10'}>10</DropdownItem>
            <DropdownItem key={'25'}>25</DropdownItem>
            <DropdownItem key={'50'}>50</DropdownItem>
            <DropdownItem key={'100'}>100</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Pagination showControls isCompact page={page} total={pages} onChange={(page) => setPage(page)} />
      </div>
    );
  };

  const dataFinal = useMemo(() => {
    let finalPage = page - 1;
    if (pages < page && data.length !== 0) {
      finalPage = 0;
      setPage(1);
    }
    const start = finalPage * rowsPerPage;
    const end = start + rowsPerPage;

    const filteredData = data.filter(filtered);
    return filteredData.slice(start, end);
  }, [search, data, page, pages]);
  return (
    <Table aria-label="Accounting Table" className="my-5" bottomContentPlacement={'outside'} topContentPlacement={'outside'} topContent={TopContent()} bottomContent={BottomContent()}>
      <TableHeader columns={columnsFinal}>
        {(column) => (
          <TableColumn className="bg-posgray text-white" aria-label={column.key} key={column.key}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={dataFinal} emptyContent={'No Data Display'} isLoading={isLoading} loadingContent={'Loading Data...'}>
        {(item: any) => (
          <TableRow aria-label={item.key} key={item.key} className="odd:bg-poslight even:bg-slate-200 ">
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
