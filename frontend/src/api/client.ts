/**
 * API client for backend OCR and document export endpoints.
 */
import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { DocxExportPayload, OcrResponse } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

/**
 * Upload an image for OCR extraction (backend: Tesseract/EasyOCR/Google Vision).
 */
export async function extractOcr(
  file: File,
  languages: string,
  preprocess = false,
): Promise<OcrResponse> {
  const form = new FormData();
  form.append('file', file);
  form.append('languages', languages);
  form.append('use_fallback', 'true');
  form.append('preprocess', String(preprocess));

  const { data } = await api.post<OcrResponse>('/api/ocr/extract', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * Export editor content to .docx (backend: python-docx).
 */
export async function exportDocx(payload: DocxExportPayload): Promise<Blob> {
  const { data } = await api.post('/api/document/export-docx', payload, {
    responseType: 'blob',
  });
  return data;
}

/**
 * Trigger browser download of a blob as a file.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
