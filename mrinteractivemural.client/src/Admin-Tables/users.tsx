import React from "react";
import { Datagrid, List, TextField, EmailField, UrlField, SimpleList,ReferenceField, EditButton, Edit, SimpleForm,  ReferenceInput,TextInput, Create } from "react-admin";

export const UserList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="number" />
            <TextField source="email" />
            <TextField source="notes" />
            <TextField source="role" />
            <EditButton />
        </Datagrid>
    </List>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput  source="id" InputProps={{ disabled: true }}/>
            <TextInput  source="name" />
            <TextInput  source="number" />
            <TextInput  source="email" />
            <TextInput  source="notes"/>
            <TextInput  source="role"/>
        </SimpleForm>
    </Edit>
);

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput  source="name" />
            <TextInput  source="number" />
            <TextInput  source="email" />
            <TextInput  source="notes"/>
            <TextInput  source="role"/>
        </SimpleForm>
    </Create>
);