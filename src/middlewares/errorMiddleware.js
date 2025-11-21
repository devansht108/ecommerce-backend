// agar route nahi mila toh yeh middleware error create karega
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// yeh general error handler hai jo saare errors ko handle karega
export const errorHandler = (err, req, res, next) => {
  // agar status 200 tha toh usko 500 bana do, warna jo hai woh rehne do
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // error ka message aur stack (dev mode me full, production me hide)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};