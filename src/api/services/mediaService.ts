import apiClient from "@/api/apiClient";
import type { MediaUploadResult } from "@/types/catalog";

export const mediaService = {
  upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<MediaUploadResult>({
      url: "/admin/media/upload",
      data: formData,
    });
  },
};
