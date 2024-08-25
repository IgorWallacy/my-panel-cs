"use client";

import { CircleX, LogOut } from "lucide-react";
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
  className={`flex justify-center items-center gap-1 w-screen h-full ${
    expanded ? "block" : "hidden"
  } md:block md:w-64 bg-white shadow-lg`}
>
  <nav className="h-full flex flex-col border-r">
    <div className="flex items-center justify-end p-4 ">
      <Button className="md:hidden" variant="ghost" onClick={() => setExpanded(false)}>
        <CircleX size="icon" className="text-gray-500" />
      </Button>
    </div>

    <ul className="flex-1 flex flex-col items-start gap-3 p-1 text-base text-gray-700">
      {children}
    </ul>

    <div className="flex flex-col gap-4 p-1 border-t">
      <div className="flex items-center gap-4">
        <img
          className="w-12 h-12 rounded-full"
          src={`data:image/png;base64,${foto}`}
          alt="avatar"
        />
        <div className="flex flex-col">
          <h4 className="font-semibold text-gray-800">{nome}</h4>
          <span className="text-xs text-gray-500">{email}</span>
          <span className="text-xs text-gray-500">{permissao}</span>
        </div>
      </div>
      <Link href="/login">
        <Button
          className="flex items-center justify-center w-full"
          variant="destructive"
          onClick={() => {
            localStorage.clear();
          }}
        >
          <LogOut size={20} className="text-white" />
        </Button>
      </Link>
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
        className={`relative flex items-center py-2 px-3 cursor-pointer font-medium rounded-md transition-colors ${
          active
            ? "bg-indigo-600 text-white"
            : "hover:bg-indigo-100 hover:text-indigo-600"
        }`}
        aria-current={active ? "page" : undefined}
      >
        {icon}
        <span className="ml-3">{text}</span>
       
      </li>
    </Link>
  );
}
