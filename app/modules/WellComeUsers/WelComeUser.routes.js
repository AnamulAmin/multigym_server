import Router  from 'express';
import { 
  createVisitor, 
  getAllVisitors, 
  getVisitorById, 
  updateVisitor, 
  deleteVisitor, 
  getVisitorsByBranch 
} from './WelComeUser.controller.js';

const WelcomeUserRoutes = Router();


WelcomeUserRoutes.post('/create', createVisitor);


WelcomeUserRoutes.get('/', getAllVisitors);


WelcomeUserRoutes.get('/:id', getVisitorById);


WelcomeUserRoutes.put('/:id', updateVisitor);


WelcomeUserRoutes.delete('/:id', deleteVisitor);


WelcomeUserRoutes.get("/branch/:branch", getVisitorsByBranch);

export default WelcomeUserRoutes;
