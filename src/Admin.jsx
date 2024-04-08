import { Routes, Route, NavLink } from 'react-router-dom';
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, useCreate } from 'react-admin';
import { UserList, UserEdit, UserCreate } from "./Admin-Models/users";
import { ModelList, ModelEdit, ModelCreate } from "./Admin-Models/models";
import simpleRestProvider from 'ra-data-simple-rest';

const Admin = () => {
    return (
        <>
        <Admin dataProvider={simpleRestProvider('https://localhost:7121')}>
           <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} recordRepresentation="name" />
           <Resource name="models" list={ModelList} edit={ModelEdit} create={ModelCreate} recordRepresentation="name" />
        </Admin>
        </>
    );
};

export default Admin;