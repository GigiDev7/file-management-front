export interface File {
  _id: string;
  name: string;
  path: string;
  size?: number;
  fsPath?: string;
  mimeType?: string;
  createdBy: string;
  hash?: string;
}
