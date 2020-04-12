import { createContext } from "react";

//  Componentes de contexto são utilizados para egernciar dados que são utilizados por todo o app
//  qualquer outro componente que mantiver algum tipo de ligação com ele poderá acessar esse dados
//  deverá ser utilizado em componentes no topo da hierarquia
//  tem que ser utilizado emm contjunto com useState e useCallback
//  para ter acesso os componentes tem de estar dentro do contexto (ver App.js)
//  Este component será responsável por guardar se o usuário está logado ou não
export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    login: () => {},
    logout: () => {}
});
