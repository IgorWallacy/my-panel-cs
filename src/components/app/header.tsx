"use client";

import { CircleX,  LogOut } from "lucide-react";
import Token_dados from "@/app/(autenticado)/(token)/util";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import api from "@/service/api";

export default function Sidebar({
  children,
  setExpanded,
  expanded,
}: {
  children: React.ReactNode;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const nome = Token_dados()?.nome;
  const email = Token_dados()?.sub;
  const permissao = Token_dados()?.scope;

  const [foto, setFoto] = useState();

  const getFoto = () => {
    return api
      .get(`/api/usuario/perfil/foto/fotoID/${email}`)
      .then((r) => {
        setFoto(r?.data?.foto);
        // console.log(foto.current)
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getFoto();
  }, []);

  return (
    <>
      <aside
        className={`h-screen w-screen ${
          expanded ? "block" : "hidden"
        } md:block`}
      >
        <nav className="h-screen  flex flex-col  border-r shadow-sm">
          <div className="flex items-center justify-end p-1">
            <Button variant="destructive" onClick={() => setExpanded(false)}>
              <CircleX size="icon" />
            </Button>
          </div>

          <ul className="flex flex-col h-screen items-center  gap-5 p-1 text-xl text-black bg-gray-100 border-2">
            {children}
          </ul>

          
            <div
              className={`flex flex-row  gap-5  h-24 items-center justify-center w-full`}
            >
              <div className="flex gap-5">
                
             
              <img
                className="w-16 h-12  rounded-full"
                src={`data:image/png;base64,${foto}`}
                alt="avatar"
              />
              <div className="flex flex-col justify-around w-full ">
                <h4 className="font-semibold"> {nome} </h4>
                <span className="text-xs text-gray-500">{email}</span>
                <span className="text-xs text-gray-500">{permissao}</span>
              </div>
              <Link href="/login">
                <Button
                  className="flex items-center justify-center"
                  variant="destructive"
                  onClick={() => {
                    localStorage.clear();
                   
                    //  router.push("/login")
                  }}
                >
                  <LogOut size={20} />
                </Button>
              </Link>
            </div>
            </div>
        </nav>
      </aside>
    </>
  );
}

export function SidebarItem({
  icon,
  text,
  active,
  alert,
  href,
  setExpanded,
}: {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  alert: boolean;
  href: string;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Link href={href} onClick={() => setExpanded(false)}>
      <li
        className={`relative flex items-center py-2 px-3 cursor-pointer hover:text-white font-medium rounded-md transition-colors ${
          active
            ? "bg-gradient-to-tr from-indigo-500 to-indigo-100 text-white"
            : "hover:text-gray-600 hover:bg-indigo-200 "
        }`}
      >
        {icon}
        <span className="w-52 ml-3  hover:text-white ">{text}</span>
        {alert && (
          <div className="absolute right-2 rounded bg-indigo-400 text-white"></div>
        )}
      </li>
    </Link>
  );
}
