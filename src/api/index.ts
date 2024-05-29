import { Router } from 'express';
import identityRoutes from './routes/contact.routes';
export default ()=>{
    const app=Router();
    identityRoutes(app);
    return app;
}