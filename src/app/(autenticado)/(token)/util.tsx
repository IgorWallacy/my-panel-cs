"use client";
import { jwtDecode } from "jwt-decode";

interface Token {
  nome: string | null;
  sub: string  | null;
  scope: string | null;
  
}

const Token_dados = (): Token => {


    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token') ?? '';
        if (token) {
            const decoded = jwtDecode<Token>(token);
            return decoded;
        }
    }
  
    return { nome: null, sub: null, scope: null }; 
  
};

export default Token_dados;
