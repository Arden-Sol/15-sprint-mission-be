export function searchWhere(searchField1, searchField2, keyword) {
  return {
    OR: [
      {
        [searchField1]: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
      {
        [searchField2]: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
    ],
  };
}
