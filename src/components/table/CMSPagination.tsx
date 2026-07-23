import { Pagination } from "antd";

type Props = {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
};

export default function CMSPagination({ current, pageSize, total, onChange }: Props) {
  return (
    <Pagination
      current={current + 1}
      pageSize={pageSize}
      total={total}
      showSizeChanger
      showTotal={(t) => `Tổng ${t} mục`}
      onChange={(page, size) => onChange(page - 1, size)}
    />
  );
}
