// GraphQL Response
export type Response = {
  data?: any;
  error?: any;
};

// Parsed Output
export type ParsedResult = {
  board_id?: number;
  item_id?: number;
};

// Monday Column
export interface Column {
  id: string;
  title: string;
  type: string;
  additional_info: string;
}

export interface Item {
  id: string;
  name: string;
  column_values: [Column];
}
