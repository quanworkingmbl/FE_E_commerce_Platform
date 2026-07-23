import { useEffect, useState } from "react";
import { Upload, message, Image } from "antd";
import { DeleteOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { mediaService } from "@/api/services/mediaService";

const API_ORIGIN = import.meta.env.VITE_APP_API_ORIGIN || "http://localhost:8080";

export function resolveMediaUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_ORIGIN}${url}`;
}

type ImageUploadFieldProps = {
  value?: string;
  onChange?: (url: string) => void;
  maxSizeMB?: number;
};

export function ImageUploadField({ value, onChange, maxSizeMB = 10 }: ImageUploadFieldProps) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(value || "");

  useEffect(() => setImageUrl(value || ""), [value]);

  const customRequest: UploadProps["customRequest"] = async ({ file, onSuccess, onError }) => {
    setLoading(true);
    try {
      const res = await mediaService.upload(file as File);
      setImageUrl(res.url);
      onChange?.(res.url);
      message.success("Upload thành công");
      onSuccess?.(res);
    } catch (e) {
      message.error("Upload thất bại");
      onError?.(e as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {imageUrl ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <Image src={resolveMediaUrl(imageUrl)} style={{ maxWidth: 160, maxHeight: 160, borderRadius: 8 }} />
          <button type="button" onClick={() => { setImageUrl(""); onChange?.(""); }} style={{ position: "absolute", top: -8, right: -8, background: "#ff4d4f", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer" }}>
            <DeleteOutlined />
          </button>
        </div>
      ) : (
        <Upload listType="picture-card" showUploadList={false} customRequest={customRequest} beforeUpload={(file) => {
          if (!file.type.startsWith("image/")) { message.error("Chỉ chấp nhận ảnh"); return Upload.LIST_IGNORE; }
          if (file.size / 1024 / 1024 >= maxSizeMB) { message.error(`Tối đa ${maxSizeMB}MB`); return Upload.LIST_IGNORE; }
          return true;
        }}>
          <div>{loading ? <LoadingOutlined /> : <PlusOutlined />}<div style={{ marginTop: 8 }}>Upload</div></div>
        </Upload>
      )}
    </div>
  );
}

type MultiImageUploadFieldProps = {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxCount?: number;
};

export function MultiImageUploadField({ value = [], onChange, maxCount = 5 }: MultiImageUploadFieldProps) {
  const customRequest: UploadProps["customRequest"] = async ({ file, onSuccess, onError }) => {
    try {
      const res = await mediaService.upload(file as File);
      onChange?.([...value, res.url].slice(0, maxCount));
      onSuccess?.(res);
    } catch (e) {
      onError?.(e as Error);
    }
  };

  return (
    <Upload listType="picture-card" fileList={value.map((url, i) => ({ uid: String(i), name: url, status: "done" as const, url: resolveMediaUrl(url) }))}
      onRemove={(file) => onChange?.(value.filter((u) => resolveMediaUrl(u) !== file.url && u !== file.url))}
      customRequest={customRequest} beforeUpload={() => value.length < maxCount}>
      {value.length < maxCount && <div><PlusOutlined /><div>Upload</div></div>}
    </Upload>
  );
}
