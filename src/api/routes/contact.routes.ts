import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import ContactController from '../../controllers/contact.controller';
const route = Router();
export default (app:Router)=>{
    app.use('/contact',route);

    //create mappin in model
    route.post(
      '/order',
      async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger');
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        logger.debug('Calling contact/order endpoint with body: %o', req.body);
        try {
          console.log("b",req.body)
          const ContactControllerInstance=Container.get(ContactController);
         const result=await ContactControllerInstance.search();
         res.status(200).json({
          data: result,
        });
        } catch (e) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          logger.error('Error: %o', e);
          return next(e);
        }
      },
    );

  route.get(
    '/_search',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      logger.debug('Calling appSetting/_search endpoint with body: %o', req.body);
      try {
        const UserControllerInstance=Container.get(ContactController);
       const result=await UserControllerInstance.search();
       res.status(200).json({
        data: result,
      });
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        logger.error('Error: %o', e);
        return next(e);
      }
    },
  );

}