const paginate = (query, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { ...query, limit: parseInt(limit), offset: parseInt(offset) };
};

const paginateMeta = (total, page, limit) => ({
  total,
  page: parseInt(page),
  limit: parseInt(limit),
  totalPages: Math.ceil(total / limit),
});

module.exports = { paginate, paginateMeta };