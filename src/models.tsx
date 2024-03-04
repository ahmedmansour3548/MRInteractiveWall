// import React from "react";
// import { Datagrid, List, TextField, EmailField, UrlField, SimpleList,ReferenceField, EditButton, Edit, SimpleForm,  ReferenceInput,TextInput, Create } from "react-admin";
// import MyUrlField from './MyUrlField';

// export const ModelList = () => (
//     <List>
//         <Datagrid rowClick="show">
//             <TextField source="id" />
//             <TextField source="modelName" />
//             <TextField source="labMemberName" />
//             <TextField source="modelFilePath" />
//             <TextField source="modelFolderPath" />
//             <EditButton />
//         </Datagrid>
//     </List>
// );

// export const ModelEdit = () => (
//     <Edit>
//         <SimpleForm>
//             <TextInput  source="id" InputProps={{ disabled: true }}/>
//             <TextInput  source="modelName" />
//             <TextInput  source="labMemberName" />
//             <TextInput  source="modelFilePath" />
//             <TextInput  source="modelFolderPath"/>
//         </SimpleForm>
//     </Edit>
// );

// export const ModelCreate = () => (
//     <Create>
//         <SimpleForm>
//             <TextInput source="id" />
//             <TextInput  source="modelName" />
//             <TextInput source="labMemberName" />
//             <TextInput  source="modelFilePath" />
//             <TextInput  source="modelFolderPath"/>
//         </SimpleForm>
//     </Create>
// );