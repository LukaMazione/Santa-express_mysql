class ValidationError extends Error {}
// class NotFoundError extends Error {}
// class DatabaseConnectionError extends Error {}

const handleError = (err, req, res, next) => {
  // Jeżeli w programie wchodzimy do elementu, który nie istnieje to obsługujemy również 404
  // if (err instanceof NotFoundError) {
  //   res
  //     .status(404)
  //     .render('error', {
  //       message: 'Nie można znaleźć elementu o danym ID',
  //     });
  // }
  console.error(err);
  // if (err instanceof DatabaseConnectionError) {
  //   res.status(503).render('error', {
  //     message: 'Serwis niedostępny. Problem z połączeniem z bazą danych.',
  //   });
  // } else {
  res
    .status(err instanceof ValidationError ? 400 : 500)
    .render('error', {
      message: err instanceof ValidationError ? err.message : 'Przepraszamy spróbuj za chwilę',
    });
  // }
};

module.exports = {
  handleError,
  ValidationError,
  // DatabaseConnectionError,
};
