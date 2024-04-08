import React from 'react';

import { Datagrid, List, TextField, EmailField, UrlField, SimpleList,ReferenceField, EditButton, Edit, SimpleForm,  ReferenceInput,TextInput, Create, SelectInput, FileInput, FileField } from "react-admin";


export const ModelList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="modelName" />
            <ReferenceField source="labMemberID" reference="users" /> 
            <TextField source="modelFilePath" />
            <TextField source="modelFileName" />
            <EditButton />
        </Datagrid>
    </List>
);

export const ModelEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput label="labMemberID" source="id" InputProps={{ disabled: true }}/>
            <TextInput  source="modelName" />
            <ReferenceInput reference="users" source="labMemberID">
                <SelectInput
                    label="labMemberID"
                    source="name"
                    optionText="name"
                />
            </ReferenceInput>
            <TextInput source="modelFilePath"/>
            <FileInput source="modelFileName">
                <FileField source="src" title="title" />
            </FileInput>
        </SimpleForm>
    </Edit>
);

export const ModelCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="modelName" />
            <ReferenceInput reference="users" source="labMemberID">
                <SelectInput
                    label="labMemberID"
                    source="name"
                    optionText="name"
                />
            </ReferenceInput>
            <TextInput source="modelFilePath"/>
            <FileInput source="fileImport">
                <FileField source="src" title="title" />
            </FileInput>
        

        {/* <div>
          <label htmlFor="fileInput">Select a file: </label>
          <input
            type="file"
            id="fileInput"
            accept=".jpg, .jpeg, .png, .pdf" // Specify accepted file types if needed
            onChange={console.log("")}
          />
        </div> */}
        
      </SimpleForm>
    </Create>
);