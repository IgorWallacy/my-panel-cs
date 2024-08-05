"use client";

import { LogOut } from "lucide-react";
import Token_dados from "@/app/(autenticado)/(token)/util";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import api from "@/service/api";

export default function Sidebar({
  children,
  expanded,
}: {
  children: React.ReactNode;
  expanded: boolean;
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
        className={`h-screen pt-10 ${expanded ? "block" : "hidden"} md:block`}
      >
        <nav className="h-full flex flex-col  border-r shadow-sm">
          <ul className="flex-1">{children}</ul>

          <div className="py-1 border-t flex ">
            <div
              className={`flex gap-1 justify-between h-24 items-start overflow-hidden transition-all w-52 ml-3`}
            >
              <img
                className="w-16 h-12  rounded-full"
                src={`data:image/png;base64,${foto}`}
                alt="avatar"
              />
              <div className="flex flex-col">
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
}: {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  alert: boolean;
  href: string;
}) {
  return (
    <Link href={href}>
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
