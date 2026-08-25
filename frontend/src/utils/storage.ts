import type { LocalDocument } from '../types';

const STORAGE_KEY = 'ai_typist_documents';

/**
 * Fetch and parse all documents stored in localStorage, sorted by updatedAt descending.
 */
export function listDocuments(): LocalDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalDocument[];
    return parsed.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.error('Failed to parse documents from localStorage', err);
    return [];
  }
}

/**
 * Retrieve a specific document by its ID.
 */
export function getDocument(id: string): LocalDocument | null {
  const docs = listDocuments();
  return docs.find((d) => d.id === id) || null;
}

/**
 * Save or update a document in localStorage.
 */
export function saveDocument(doc: LocalDocument): void {
  const docs = listDocuments();
  const index = docs.findIndex((d) => d.id === doc.id);

  if (index >= 0) {
    docs[index] = doc;
  } else {
    docs.push(doc);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

/**
 * Delete a specific document by its ID.
 */
export function deleteDocument(id: string): void {
  const docs = listDocuments();
  const filtered = docs.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
