/**
 * Map a sortDirection prop value to the ARIA-spec aria-sort value.
 * Apply the result on the surrounding <th>:
 *
 *   <th aria-sort={sortDirectionToAria(sortDirection, sortable)}>
 *     <TableHeaderCell sortable sortDirection={sortDirection} ... />
 *   </th>
 */
export const sortDirectionToAria = (
  direction: 'asc' | 'desc' | null | undefined,
  sortable: boolean,
): 'ascending' | 'descending' | 'none' | undefined => {
  if (!sortable) return undefined;
  if (direction === 'asc') return 'ascending';
  if (direction === 'desc') return 'descending';
  return 'none';
};
