const getCols = `
  query getColumns($board_ids: [Int]!) {
    boards(ids: $board_ids) {
      columns {
        id
        title
        type
      }
    }
  }
`;
export const getColumnsMock = {
  query: getCols,
  variables: '{"board_ids":[785685546]}',
};

export const getItemsResponseMock = {
  data: {
    items: [
      {
        column_values: [
          {
            id: 'person',
            title: 'Owner',
            type: 'multiple-person',
            additional_info: null,
          },
          {
            id: 'status_1',
            title: 'Status',
            type: 'color',
            additional_info:
              '{"label":"Working on it","color":"#e2445c","changed_at":"2020-11-09T09:35:32.709Z"}',
          },
          {
            id: 'last_updated',
            title: 'Last Updated',
            type: 'pulse-updated',
            additional_info: null,
          },
          {
            id: 'item_id',
            title: 'Item ID',
            type: 'pulse-id',
            additional_info: null,
          },
        ],
      },
    ],
  },
  account_id: 4351600,
};

/*
const changeItems = `
mutation changeItemStatus($board_id: Int!, $item_id: Int!, $column_id: String!, $value: String!) {
  change_simple_column_value(board_id: $board_id, item_id: $item_id, column_id: $column_id, value: $value) {
    id
  }
}
`;


export const mondayResponseMock = {
  data: {
    boards: [
      {
        columns: [
          {
            id: 'name',
            title: 'Name',
            type: 'name',
          },
          {
            id: 'person',
            title: 'Owner',
            type: 'multiple-person',
          },
          {
            id: 'status_1',
            title: 'Status',
            type: 'color',
          },
          {
            id: 'last_updated',
            title: 'Last Updated',
            type: 'pulse-updated',
          },
          {
            id: 'item_id',
            title: 'Item ID',
            type: 'pulse-id',
          },
        ],
      },
    ],
  },
  account_id: 4351600,
};

export const invalidIdsCommentMock = {
  body: 'Please provide valid Monday.com IDs in description!',
}; */
