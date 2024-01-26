import { ColumnDef, FilterFn } from "@tanstack/react-table";

export interface Location {
  id: number;
  name: string;
  neighborhood: string;
  priorityStatus: number;
  isDeleted: boolean;
  // ... other fields
}

export interface Street {
  id: number;
  name: string;
  locationId: number;
  lastVisited: Date | null;
  lastVisitedby: string | null;
  // ... other fields
}

export interface House {
  // accessorKey: string;
  id: number;
  streetNumber: number;
  lastName: string | null;
  name: string | null;
  type: string | null;
  streetId: number;
  locationId: number;
  statusAttempt: string | null;
  lastUpdated: Date | null;
  lastUpdatedBy: string | null;
  internalNotes: string | null;
  externalNotes: string | null;
  Location: Location;
  Street: Street;
}

export type LocationDropdown = {
  id: number;
  name: string;
}[];


const fuzzyFilter: FilterFn<House> = (row, columnId, filterValue, addMeta) => {
  // Get the value from the row using the columnId
  const rowValue = row.getValue(columnId);

  // If the filter value is undefined or null, return true for all rows
  if (!filterValue) {
    return true;
  }

  // Convert both the row value and the filter value to a common case for case-insensitive comparison
  const rowValueString = String(rowValue).toLowerCase();
  const filterValueLower = filterValue.toLowerCase();

  // Check if the filter value is a substring of the row value
  return rowValueString.includes(filterValueLower);
};

export const columns: ColumnDef<House>[] = [
  {
    accessorKey: "id",
    header: "id",
    // size: 50,
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "streetNumber",
    header: "streetNumber",
    // size: 100,
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "lastName",
    header: "lastName",
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "name",
    header: "name",
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "notes",
    header: "notes",
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "salesForceNotes",
    header: "salesForceNotes",
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "phone",
    header: "phone",
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "email",
    header: "email",
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "type",
    header: "type",
    // size: 50,
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "streetId",
    header: "streetId",
    // size: 50,
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "locationId",
    header: "locationId",
    // size: 50,
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "lastUpdated",
    header: "lastUpdated",
    // size: 50,
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "lastUpdatedBy",
    header: "lastUpdatedBy",
    // size: 50,
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "statusAttempt",
    header: "statusAttempt",
    // size: 50,
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "consent",
    header: "consent",
    // size: 50,
    filterFn: fuzzyFilter as FilterFn<House>,
  },

  //   {
  //     accessorKey: "internalNotes",
  //     header: "Internal Notes",
  //     // size: 25,
  //     filterFn: fuzzyFilter as FilterFn<House>,
  //   },
  //   {
  //     accessorKey: "externalNotes",
  //     header: "External Notes",
  //     // size: 25,
  //     filterFn: fuzzyFilter as FilterFn<House>,
  //   },

  {
    accessorKey: "Street.name",
    header: "street",
    // size: 50,
    filterFn: fuzzyFilter as FilterFn<House>,
  },
  {
    accessorKey: "Location.name",
    header: "location",
    // size: 50,
    filterFn: fuzzyFilter as FilterFn<House>,
  },

  // ... other location and street fields
];
