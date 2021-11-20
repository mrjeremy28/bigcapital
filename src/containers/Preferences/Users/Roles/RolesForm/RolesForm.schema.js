import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  role_name: Yup.string().label(intl.get('name')).required(),
  role_description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),

  permissions: Yup.object().shape({
    subject: Yup.string(),
    ability: Yup.string(),
    value: Yup.boolean(),
  }),
});

export const CreateRolesFormSchema = Schema;
export const EditRolesFormSchema = Schema;
