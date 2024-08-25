"use client";
import "primereact/resources/themes/tailwind-light/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/service/api";
import Token_dados from "./(token)/util";
import Sidebar, { SidebarItem } from "@/components/app/header";
import toast, { Toaster } from "react-hot-toast";

import {
  BarChart3,
  ChevronFirst,
  ChevronLast,
  Receipt,
  User2Icon,
  UserPlus,
  Users,
} from "lucide-react";
import React from "react";

import moment from "moment-timezone";

moment.tz.setDefault("America/Sao_Paulo");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const [expanded, setExpanded] = React.useState(false);

  const token = useRef<string | null>(null);

  const [tokenDados, setTokenDados] = useState(Token_dados);

  if (typeof window !== "undefined") {
    token.current = localStorage.getItem("access_token") ?? "";
    if (token.current) {
    } else {
      localStorage.removeItem("access_token");
      window.location.reload();
      router.push("/login");
    }
  }

  const token_intercept = () => {
    let a = token.current ? token.current : null;

    api.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = "bearer " + a;
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    if (tokenDados.exp < Date.now() / 1000) {
      router.push("/login");
    }

    api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error?.response?.status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );
  };

  const health = async () => {
    return await api
      .get("/actuator/health")
      .then((r) => {})
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    setInterval(() => {
      token_intercept();
      health();
    }, 10000);
  }, []);

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr] md:grid-cols-[auto,1fr] bg-gray-100">
      <Toaster />
      <header className="md:hidden sticky top-0 z-40 w-full border-b bg-white shadow-sm md:col-span-2 md:row-span-1">
        <div className="container flex h-6 items-center space-x-4 sm:justify-between sm:space-x-0">
          <button
            onClick={() => setExpanded((curr) => !curr)} // Alterna o estado
            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors md:hidden"
          >
            {expanded ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}{" "}
            {/* Icone alternado */}
          </button>
        </div>
      </header>

      <div
        className={`flex flex-col bg-white ${
          expanded ? "block" : "hidden"
        } md:flex`}
      >
        <div className="flex flex-1 p-1 flex-row items-center justify-center space-x-4">
          <nav className="flex items-center space-x-1">
            <h1 className="font-extrabold text-lg">My Panel</h1>
          </nav>
        </div>
        <Sidebar expanded={expanded} setExpanded={setExpanded}>
          <SidebarItem
            setExpanded={setExpanded}
            icon={<BarChart3 size={20} />}
            text="Dashboard"
            active={pathname === "/dashboard"}
            alert={false}
            href={"/dashboard"}
          />
          <SidebarItem
            setExpanded={setExpanded}
            icon={<Users size={20} />}
            text="Gerenciar clientes & Logins"
            active={pathname === "/cliente"}
            alert={false}
            href={"/cliente"}
          />
          <SidebarItem
            setExpanded={setExpanded}
            icon={<UserPlus size={20} />}
            text="Gerenciar usuários"
            active={pathname === "/usuario"}
            alert={false}
            href={"/usuario"}
          />
          <SidebarItem
            setExpanded={setExpanded}
            icon={<Receipt size={20} />}
            text="Faturas"
            active={pathname === ""}
            alert={false}
            href={""}
          />
          <SidebarItem
            setExpanded={setExpanded}
            icon={<User2Icon size={20} />}
            text="Meu perfil"
            active={pathname === "/perfil"}
            alert={false}
            href={"/perfil"}
          />
        </Sidebar>
      </div>
      {expanded ? (
        <></>
      ) : (
        <>
          {" "}
          <div className="h-screen flex-1 p-4 overflow-y-auto">{children}</div>
        </>
      )}
    </div>
  );
}
