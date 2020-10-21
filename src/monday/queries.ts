export const getColumns = `
  query getColumns($board_ids: ![Int]) {
    boards(ids: $board_ids) {
      columns {
        id
        title
        type
      }
    }
  }
`;

export const changeItemStatus = `
  mutation changeItemStatus($board_id: Int!, $item_id: Int!, $column_id: String!, $value: String!) {
    change_simple_column_value(board_id: $board, item_id: $item_id, column_id: $column_id, value: $value) {
      id
    }
  }
`;
