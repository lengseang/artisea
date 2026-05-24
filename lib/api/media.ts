import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { ApiResponse } from '@/types/common';

export interface MediaUploadResponse {
  url: string;
  public_id?: string;
  width?: number;
  height?: number;
  format?: string;
}

export async function uploadMedia(file: File): Promise<MediaUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient<ApiResponse<MediaUploadResponse> | MediaUploadResponse>(
    API_ENDPOINTS.media.upload,
    {
      method: 'POST',
      body: formData,
    }
  );

  return 'data' in res ? res.data : res;
}
