function asyncHandler(callback) {
    return async function (req, res, next) {
        try {
            await callback(req, res, next);
        } catch (error) {
            if(["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(error.name)) {
                error.status = 400;
                error.message = error.errors.map(error => error.message).join(" - ");
                next(error);
            } else {
                next(error)
            }
        }
    }
};

module.exports = asyncHandler;
