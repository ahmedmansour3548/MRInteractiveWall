import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, useCreate } from 'react-admin';
import { UserList, UserEdit, UserCreate } from "./Admin-Tables/users";
import { ModelList, ModelEdit, ModelCreate } from "./Admin-Tables/models";
import simpleRestProvider from 'ra-data-simple-rest';

export const AdminPage = () => (
    <Admin basename="/admin" dataProvider={simpleRestProvider('https://localhost:7121')}>
        <Resource name="models" list={ModelList} edit={ModelEdit} create={ModelCreate} recordRepresentation="name" />
        <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} recordRepresentation="name" />
    </Admin>
);