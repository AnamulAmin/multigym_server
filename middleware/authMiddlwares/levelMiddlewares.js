export function protectForSuperAdmin (req, res, next) {
    try {
        
        if (req.employee.level !== 'superAdmin') {
            res.status(400)
            throw new Error('Only SuperAdmin can access this');
        }

        if (req.employee.level === 'superAdmin') {
            next();
        }

    } catch (error) {
        res.json(error.message);
    }
}