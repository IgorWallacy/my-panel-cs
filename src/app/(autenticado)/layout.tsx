"use client";
import Sidebar, { SidebarItem } from "@/components/app/header";
import {
  BarChart3,
  ChevronFirst,
  ChevronLast,
  MountainIcon,
  Receipt,
  User2Icon,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex border-2 py-1 items-center justify-start bg-gray-300 shadow-sm md:px-6 overflow-hidden z-10">
        <Link href="/dashboard" className="flex items-center" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="ml-2 text-sm font-semibold">My Panel</span>
        </Link>
      </header>

      <div className="flex  flex-col w-full h-full">
        <div className="flex  w-full h-full  flex-row ">
          <div className="flex h-full w-full flex-row  justify-start items-center">
          <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 md:hidden"
            >
              {expanded ? (
                <ChevronFirst size={20} />
              ) : (
                <ChevronLast size={20} />
              )}
            </button>

            <Sidebar  expanded={expanded}>
              <SidebarItem
                icon={<BarChart3 size={20} />}
                text="Dashboard"
                active={false}
                alert={false}
                href={"/dashboard"}
              />
              <SidebarItem
                icon={<Users size={20} />}
                text="Cadastro de clientes"
                active={false}
                alert={false}
                href={""}
              />
              <SidebarItem
                icon={<UserPlus size={20} />}
                text="Cadastro de usuários"
                active={false}
                alert={false}
                href={""}
              />
              <SidebarItem
                icon={<Receipt size={20} />}
                text="Faturas"
                active={false}
                alert={false}
                href={""}
              />
              <SidebarItem
                icon={<User2Icon size={20} />}
                text="Meu perfil"
                active={false}
                alert={false}
                href={"/perfil"}
              />
            </Sidebar>
            {expanded ? (
              <></>
            ) : (
              <>
                <div className="flex p-5 h-full w-full justify-center items-start flex-wrap">
                  {children}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
