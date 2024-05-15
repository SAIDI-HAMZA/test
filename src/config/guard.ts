import { UserAccessRole } from '.prisma/client';

// By default all routes are protected. Only role ADMIN can access them. Routes would be opened to lower access roles.
export const guardConfig: Record<
  string,
  Record<string, Array<UserAccessRole>>
> = {
  conversations: {
    '/create': ['TRANSLATOR'],
    '/add': ['TRANSLATOR'],
  },
};
