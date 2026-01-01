import { Router } from 'express';





export const articlesRouter = Router(

);

articlesRouter.get('/', (req, res) => {
  res.json({'articles':[
    'article1',
    'article2',
    'article3'
  ]});
});

