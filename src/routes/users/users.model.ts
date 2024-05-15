import { Type } from '@sinclair/typebox';
import {
  HospitalDepartmentModel,
  HospitalModel,
} from '../hospitals/hospitals.model';
import { UUID } from '../../common/models';

const ConversationModel = Type.Object({});

const AccessRoleModel = Type.Union([Type.String()], {
  title: 'The user role',
  description:
    "Set a sign-up, can be changed. Can be either 'TRANSLATOR' or 'ADMIN'",
  default: 'TRANSLATOR',
  examples: ['TRANSLATOR', 'ADMIN'],
});

export const UserModel = Type.Object({
  id: Type.String({
    format: 'uuid',
    minLength: 36,
    maxLength: 36,
    title: "The user's unique identifier",
    description: 'Used to identify the user in the database',
  }),
  email: Type.String({
    format: 'email',
    maxLength: 300,
    minLength: 3,
    description: "The user's email, coming from Azure AD",
    examples: ['john.doe@gmail.com'],
    title: 'User email',
  }),
  job: Type.String({
    title: "The user's job in the hospital.",
    description: 'Set at sign-up',
    examples: ['Doctor', 'Patient'],
    minLength: 2,
    maxLength: 32,
  }),
  first_name: Type.String({
    title: "The user's first name",
    description: 'Set at sign-up',
    examples: ['John'],
    minLength: 2,
    maxLength: 64,
  }),
  last_name: Type.String({
    title: "The user's last name",
    description: 'Set at sign-up',
    examples: ['Doe'],
    minLength: 2,
    maxLength: 64,
  }),
  user_name: Type.String({
    title: "The user's username",
    description: 'Set at sign-up',
    examples: ['joe'],
    minLength: 2,
    maxLength: 64,
  }),
  access_roles: Type.Array(AccessRoleModel),
  conversations: Type.Array(ConversationModel),
  department: HospitalDepartmentModel,
  hospital: HospitalModel,
  spoken_languages: Type.Array(UUID, {
    title: 'User spoken languages',
    description: 'A list of IDs of supported languages',
  }),
});
