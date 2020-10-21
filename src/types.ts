// GraphQL Response
export type Response = {
  data?: any;
  error?: any;
};

// Parsed Output
export type ParsedResult = {
  board_id: number | undefined;
  item_id: number | undefined;
};

// Monday Column
export interface Column {
  id: string;
  title: string;
  type: string;
}
