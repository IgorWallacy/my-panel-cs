"use client";
import { jwtDecode } from "jwt-decode";

interface Token {
  id : string   | null;
  nome: string | null;
  sub: string  | null;
  scope: string | null;
  exp: number  ;
  iat: number ;
  
}

const Token_dados = (): Token => {


    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token') ?? '';
        if (token) {
            const decoded = jwtDecode<Token>(token);
            return decoded;
        }
    }
  
    return { id: null , nome: null, sub: null, scope: null , exp: 0 , iat: 0  }; 
  
};

export default Token_dados;
