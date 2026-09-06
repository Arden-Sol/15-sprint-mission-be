export function searchWhere(keyword) {
  return {
    OR: [
      {
        title: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
      {
        content: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
    ],
  };
}
