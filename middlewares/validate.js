
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const constraints = {};
      for (const issue of result.error.errors) {
        // lấy tên field (nếu nested, join bằng '.')
        const key = issue.path.join('.') || '_';
        if (!(key in constraints)) {
          constraints[key] = issue.message;
        }
      }

      return res.status(422).json({
        message: 'Lỗi validate',
        constraints
      });
    }

    // Ghi đè body đã được parse & transform
    req.body = result.data;
    next();
  };
}

module.exports = validate;
