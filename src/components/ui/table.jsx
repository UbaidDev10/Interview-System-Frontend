export const Table = ({ children }) => (
  <table className="w-full border border-gray-200 rounded text-sm">{children}</table>
);
export const TableHead = ({ children }) => (
  <thead className="bg-gray-100 text-left">{children}</thead>
);
export const TableRow = ({ children }) => (
  <tr className="border-t">{children}</tr>
);
export const TableCell = ({ children }) => (
  <td className="p-3">{children}</td>
);
export const TableBody = ({ children }) => <tbody>{children}</tbody>;
