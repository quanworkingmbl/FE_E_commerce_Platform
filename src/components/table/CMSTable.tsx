import { Table, type TableProps } from "antd";
import CMSPagination from "./CMSPagination";

type CMSTableProps<T> = {
  columns: TableProps<T>["columns"];
  dataSource: T[];
  rowKey?: string;
  loading?: boolean;
  scroll?: TableProps<T>["scroll"];
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
};

export default function CMSTable<T extends object>({
  columns,
  dataSource,
  rowKey = "id",
  loading = false,
  scroll = { x: "max-content" },
  pagination,
}: CMSTableProps<T>) {
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} rowKey={rowKey} loading={loading} scroll={scroll} pagination={false} />
      {pagination && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <CMSPagination {...pagination} />
        </div>
      )}
    </div>
  );
}
