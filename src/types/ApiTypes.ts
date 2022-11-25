export type ListView<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};

export type QuerysetParams = {
  limit: number;
  offset: number;
  ordering: string;
  search: string;
};

export type EmptyRequest = Record<string, never>;
export type EmptyResponse = Record<string, never>;
