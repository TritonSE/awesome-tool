export const getItems = `
  query getItems($item_ids: [Int]!) {
    items(ids: $item_ids) {
      column_values {
        id
        title
        type
        additional_info
      }
    }
  }
`;

export const changeItemStatus = `
  mutation changeItemStatus($board_id: Int!, $item_id: Int!, $column_id: String!, $value: String!) {
    change_simple_column_value(board_id: $board_id, item_id: $item_id, column_id: $column_id, value: $value) {
      id
    }
  }
`;
