import React from 'react';

import './UsersList.css';
import UserItem from './UserItem';

const UsersList = props => {
    if (props.items.length === 0) {
        return <div className="center">
            <h2>No users found.</h2>
        </div>
    }
    //retorna cada usuário da lista percorrendo com o map e pegando as props
    return <ul className="users-list">
        {props.items.map(user => {
            return <UserItem 
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places}  
            />
        })}
    </ul>

};

export default UsersList;
