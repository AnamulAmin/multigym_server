import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Employee from '../models/bizDev/users/employees/employeeModel.js';

const { verify } = jwt;

const protect = asyncHandler(async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {

            token = req.headers.authorization.split(' ')[1];

            const decoded = verify(token, process.env.JWT_SECRET);

            req.employee = await Employee.findById(decoded.id).select('-password');

            next();

        } catch (error) {
            console.log(error);
            res.send(401);
            throw new Error('Not Authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

})

const protectByLevel = asyncHandler(async (req, res, next) => {
    if (req.employee?.level === "admin") {
        next();
    } else {
        res.send({ status: 400, message: "You have to must be admin" });
    }
});

const protectByDesignations = asyncHandler(async (req, res, next) => {
    if (req.employee?.desigantions === "sbuManager") {
        next();
    } else {
        res.send({ status: 400, message: "You have an designation" });
    }
});

export { protect, protectByLevel, protectByDesignations };