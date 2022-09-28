import {
  Div,
  Text,
  Checkbox,
  Input,
  Select,
  Button,
  Tooltip,
  SelectRef,
  Icon,
} from "react-native-magnus";
import { useTable, useSortBy, usePagination, useGlobalFilter, useAsyncDebounce } from "react-table";
import React, { createRef } from "react";
import NumberInput from "../styles/components/NumberInput";

// Define a default UI for filtering
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Input
      variant={"flushed"}
      value={value || ""}
      onChange={(e: any) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

const ReactTable = ({ columns, data }) => {
  const selectRef = createRef<SelectRef>();
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
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  return (
    <Div m={10}>
      {preGlobalFilteredRows.length > 1 && (
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      )}
      <Div w={"100%"} variant={"simple"} color={"gray700"} {...getTableProps()}>
        <Div w={"100%"} row>
          {headerGroups.map((headerGroup, idx) => (
            <Div
              w={"100%"}
              row
              key={idx}
              pl={0}
              color="gray.400"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column, idx) => (
                <Div
                  row
                  minH={20}
                  alignItems={"center"}
                  borderBottomWidth={1}
                  pb={4}
                  borderBottomColor={"gray.700"}
                  w={column.width}
                  color="gray.400"
                  userSelect={"none"}
                  key={idx}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  isNumeric={column.isNumeric}
                >
                  <Text fontWeight={"bold"}>{column.render("Header")}</Text>
                  {idx !== 0 && (
                    <Div ps={2} pb={1}>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <Icon name={"caretdown"} ms={2} aria-label="sorted descending" />
                        ) : (
                          <Icon name={"caretup"} ms={2} mt={4} aria-label="sorted ascending" />
                        )
                      ) : null}
                    </Div>
                  )}
                </Div>
              ))}
            </Div>
          ))}
        </Div>
        <Div {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Div row my={8} flex={1} alignItems={'center'} key={row.getRowProps().key}>
                {row.cells.map((cell, idx) => (
                  <Div
                    key={idx}
                    w={cell.column.width}
                    {...cell.getCellProps()}
                    isNumeric={cell.column.isNumeric}
                  >
                    {cell.render("Cell")}
                  </Div>
                ))}
              </Div>
            );
          })}
        </Div>
      </Div>

      {(pageCount > 1 || pageSize > 10) && (
        <Div row flex={1} justifyContent="space-between" m={4} alignItems="center">
          <Div flex={1}>
            <Button
              aria-label={"First Page"}
              onPress={() => gotoPage(0)}
              disabled={!canPreviousPage}
              mr={4}
            >
              <Icon name={"doubleleft"} h={3} w={3} />
            </Button>
            <Button aria-label={"Previous Page"} onPress={previousPage} disabled={!canPreviousPage}>
              <Icon name={"left"} h={6} w={6} />
            </Button>
          </Div>
          <Div flex={1} alignItems="center">
            <Text mr={8}>
              Page <Text fontWeight="bold">{pageIndex + 1}</Text> of{" "}
              <Text fontWeight="bold">{pageOptions.length}</Text>
            </Text>
            <Text>Go to page:</Text>{" "}
            <NumberInput
              ml={2}
              mr={8}
              w={28}
              value={pageIndex + 1}
              min={1}
              max={pageCount ? pageCount : 1}
              setValue={(val) => {
                gotoPage(val ? parseInt(val) - 1 : 0);
              }}
            />
            <Button
              flex={1}
              block
              borderWidth={1}
              bg="white"
              color="gray900"
              borderColor="gray300"
              onPress={() => {
                if (selectRef.current) {
                  selectRef.current.open();
                }
              }}
            >
              {pageSize}
            </Button>
            <Select
              onSelect={(e) => setPageSize(e.target.value)}
              ref={selectRef}
              value={pageSize}
              title="This is your title"
              mt="md"
              w={32}
              pb="2xl"
              message="This is the long message used to set some context"
              roundedTop="xl"
              data={[10, 25, 50, 100, 250]}
              renderItem={(item, index) => (
                <Select.Option value={item} py="md" px="xl">
                  <Text>Show {item}</Text>
                </Select.Option>
              )}
            />
          </Div>

          <Div flex={1}>
            <Button aria-label={"Next Page"} onPress={nextPage} disabled={!canNextPage}>
              <Icon name={"right"} h={6} w={6} />
            </Button>
            <Button
              aria-label={"Last Page"}
              onPress={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              ml={4}
            >
              <Icon name={"doubleright"} h={3} w={3} />
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
};

export default ReactTable;
