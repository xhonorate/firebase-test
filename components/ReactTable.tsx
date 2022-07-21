
import { 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td,
  Text,
  Checkbox,
  Input,
  useColorModeValue, 
  chakra, 
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  IconButton,
  Stack,
  Tooltip,
} from '@chakra-ui/react'
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  TriangleDownIcon, 
  TriangleUpIcon,
} from "@chakra-ui/icons";
import { useTable, useSortBy, usePagination, useGlobalFilter, useAsyncDebounce } from 'react-table'
import React from "react"

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <Input
      variant={'flushed'}
      value={value || ""}
      onChange={e => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

const ReactTable = ({ columns, data, buttons=[] }) => {
    // stored in memory for react-table (colors dep on darkmode / lightmode update)
    const { 
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page, // Instead of using 'rows', we'll use page,
      // which has only the rows for the active page
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      preGlobalFilteredRows,
      setGlobalFilter,
      state: { pageIndex, pageSize, globalFilter }
    } = useTable(
      {
        columns,
        data,
      },
      useGlobalFilter,
      useSortBy,
      usePagination
    )
    const textColor = useColorModeValue("gray.700", "white");  

    return (
      <Stack direction={'column'} w={'100%'}>
        { preGlobalFilteredRows.length > 1 &&
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        /> }
        <Table variant={'simple'} color={textColor} {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup, idx) => (
              <Tr key={idx} my='.8rem' pl='0px' color='gray.400' {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, idx) => (
                  <Th
                    color='gray.400' userSelect={'none'} key={idx}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isNumeric={column.isNumeric}
                  >
                    {column.render('Header')}
                    { idx !== 0 && <chakra.span ps={2} pb={1}>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <TriangleDownIcon mb={'1px'} aria-label='sorted descending' />
                        ) : (
                          <TriangleUpIcon mb={'1px'} aria-label='sorted ascending' />
                        )
                      ) : null}
                    </chakra.span> }
                  </Th>
                ))}
                { buttons.length > 0 && <Th />}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <React.Fragment key={row.getRowProps().key}>
                  <Tr>
                    {row.cells.map((cell, idx) => (
                      <Td key={idx} {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                        {cell.render('Cell')}
                      </Td>
                    ))}
                    { buttons.length > 0 && <Td>{ /* <MagicMenuButton buttons={buttons(row.original)} />*/ }</Td> }
                  </Tr>
                </React.Fragment>
              )
            })}
          </Tbody>
        </Table>

        { (pageCount > 1 || pageSize > 10) && 
        <Flex pt={2} justifyContent="space-between" m={4} alignItems="center">
          <Flex>
            <Tooltip label="First Page">
              <IconButton
                aria-label={'First Page'}
                onClick={() => gotoPage(0)}
                isDisabled={!canPreviousPage}
                icon={<ArrowLeftIcon h={3} w={3} />}
                mr={4}
              />
            </Tooltip>
            <Tooltip label="Previous Page">
              <IconButton
                aria-label={'Previous Page'}
                onClick={previousPage}
                isDisabled={!canPreviousPage}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>
          <Flex alignItems="center">
            <Text flexShrink="0" mr={8}>
              Page{" "}
              <Text fontWeight="bold" as="span">
                {pageIndex + 1}
              </Text>{" "}
              of{" "}
              <Text fontWeight="bold" as="span">
                {pageOptions.length}
              </Text>
            </Text>
            <Text flexShrink="0">Go to page:</Text>{" "}
            <NumberInput
              ml={2}
              mr={8}
              w={28}
              defaultValue={pageIndex + 1} 
              min={1}
              max={pageCount ? pageCount : 1}
              onChange={val => {
                gotoPage(val ? parseInt(val) - 1 : 0)
              }}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Select
              w={32}
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[10, 25, 50, 100, 250].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
          </Flex>

          <Flex>
            <Tooltip label="Next Page">
              <IconButton
                aria-label={'Next Page'}
                onClick={nextPage}
                isDisabled={!canNextPage}
                icon={<ChevronRightIcon h={6} w={6} />}
              />
            </Tooltip>
            <Tooltip label="Last Page">
              <IconButton
                aria-label={'Last Page'}
                onClick={() => gotoPage(pageCount - 1)}
                isDisabled={!canNextPage}
                icon={<ArrowRightIcon h={3} w={3} />}
                ml={4}
              />
            </Tooltip>
          </Flex>
        </Flex>}
      </Stack>
    )
}

export default ReactTable;