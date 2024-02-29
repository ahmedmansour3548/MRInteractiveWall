
import React from 'react';
import { List, Filter, Datagrid, TextField, SearchInput, Admin, Resource } from 'react-admin';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const AdminGridView = () => {
  // const CustomerFilter = (props) => (
  //   <Filter {...props}>
  //     <SearchInput placeholder='Customer Email' source='email' resettable alwaysOn />
  //   </Filter>
  // );
  const queryClient = new QueryClient()
  const CustomerList = (props) => (
    <List title='List of Customers'>
      <Datagrid
        rowClick={(id, basePath, record) => {
          return `TEST`;
        }}
      >
        <TextField disabled source='id' />
        <TextField source='first_name' />
        <TextField source='last_name' />
        <TextField source='email' />
        <TextField source='activebool' label='Active' />
      </Datagrid>
    </List>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Admin>
        <Resource name='customers' list={CustomerList} />
      </Admin>
    </QueryClientProvider>
    
  );
};
export default AdminGridView;