import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  DateTimeInput,
  SelectInput,
  Admin,
  Resource
} from 'react-admin';
import CustomerList from './AdminGridView';

const EditUser = () => {

    const RentalEdit = (props) => (
    <Edit {...props} title='Edit of Rentals'>
        <SimpleForm>
        <TextInput disabled source='id' />
        <TextInput disabled source='film_title' />
        <TextInput disabled source='customer_email' />
        <DateTimeInput disabled source='rental_date' />

        <SelectInput
            source='status'
            choices={[
            { id: 'borrowed', name: 'borrowed' },
            { id: 'delayed', name: 'delayed' },
            { id: 'lost', name: 'lost' },
            { id: 'returned', name: 'returned' },
            ]}
        />
        <DateTimeInput source='return_date' />
        </SimpleForm>
    </Edit>
    );
    return(
        <Admin>
            <Resource name='rentals' list={CustomerList} edit={RentalEdit}/>
        </Admin>
    );
};
export default EditUser;