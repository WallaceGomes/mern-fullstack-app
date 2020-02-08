import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
    const USERS = [
        {
        id: 'u1',
        name: 'Wallace Gomes',
        image: 'https://avatars3.githubusercontent.com/u/43701494?s=460&v=4',
        places: 3
    }
    ];

    return <UsersList items={USERS} />;
};

export default Users;
