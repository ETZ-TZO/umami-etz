import { getLargestSessionId } from 'lib/queries';
import { badRequest, ok } from '../../../lib/response';
import { useCors } from '../../../lib/middleware';

export default async (req, res) => {
  if (req.method === 'GET') {
    await useCors(req, res);
    getLargestSessionId().then(data => {
      const newSessionId = data + 1;
      return ok(res, newSessionId);
    });
  }
   else {
    return badRequest(res);
  }
};
