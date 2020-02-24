import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
//NavLink = permite avaliar o link que o usuário se encontra e mudar estilos de acordo

import './NavLinks.css';
import { AuthContext } from '../../context/auth-context';

const NavLinks = props => {

    //permite que este componente mantenha uma visão sobre o context de Auth do usuário
    //sempre que este context mudar este componente irá rendreizar novamente
    const auth = useContext(AuthContext);

    //somente mostra os links(botões) caso esteja autenticado isLoggedIn = true
    // auth.isLoggedIn && -> condicional
    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/" exact >All USERS</NavLink>
            </li>
            {auth.isLoggedIn &&
                <li>
                    <NavLink to="/u1/places">MY PLACES</NavLink>
                </li>
            }
            {auth.isLoggedIn &&
                <li>
                    <NavLink to="/places/new">ADD PLACES</NavLink>
                </li>
            }
            {!auth.isLoggedIn &&
                <li>
                    <NavLink to="/auth">AUTHENTICATE</NavLink>
                </li>
            }
        </ul>
    );
};

export default NavLinks;
