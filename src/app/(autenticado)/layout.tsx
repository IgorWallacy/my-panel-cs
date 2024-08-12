"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/service/api";
import Token_dados from "./(token)/util";
import Sidebar, { SidebarItem } from "@/components/app/header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

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
        // Do something before request is sent

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
      .then((r) => {
     //  console.log(r.data)
      })
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
    <>
      <ToastContainer />
      <div className="relative flex min-h-screen flex-row ">
        
        {expanded ? (
          <>
            <Sidebar expanded={expanded} setExpanded={setExpanded}>
              <SidebarItem
                setExpanded={setExpanded}
                icon={<BarChart3 size={20} />}
                text="Dashboard"
                active={false}
                alert={false}
                href={"/dashboard"}
              />
              <SidebarItem
                setExpanded={setExpanded}
                icon={<Users size={20} />}
                text="Cadastro de clientes"
                active={false}
                alert={false}
                href={""}
              />
              <SidebarItem
                setExpanded={setExpanded}
                icon={<UserPlus size={20} />}
                text="Cadastro de usuários"
                active={false}
                alert={false}
                href={"/usuario"}
              />
              <SidebarItem
                setExpanded={setExpanded}
                icon={<Receipt size={20} />}
                text="Faturas"
                active={false}
                alert={false}
                href={""}
              />
              <SidebarItem
                setExpanded={setExpanded}
                icon={<User2Icon size={20} />}
                text="Meu perfil"
                active={false}
                alert={false}
                href={"/perfil"}
              />
            </Sidebar>
          </>
        ) : (
          <></>
        )}

        
        <div
          className={`flex-1  justify-center items-center bg-slate-100   ${
            expanded ? "hidden" : ""
          }`}
        >
          <header className="sticky top-0 z-40 w-full border-b bg-background mb-1">
            <div className="container flex h-8 items-center space-x-4 sm:justify-between sm:space-x-0">
              <div className="flex flex-1 flex-row items-center justify-end space-x-4">
                <nav className="flex items-center space-x-1">
                  <h1 className="font-extrabold">My Panel</h1>
                 
                </nav>
              </div>
            </div>
          </header>
          <button
          onClick={() => setExpanded((curr) => !curr)}
          className="p-1.5 fixed left-0 rounded-lg bg-black text-white mx-1 hover:bg-gray-100 hover:text-black "
        >
          {expanded ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
        </button>
          {children}
          
        </div>
      </div>
    </>
  );
}
