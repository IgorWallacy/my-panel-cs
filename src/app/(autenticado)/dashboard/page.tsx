"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/service/api";
import { UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  const getTotalUsuariosAtivos = async () => {
    return api
      .get("/api/usuario/todos")
      .then((response) => {
        setTotalUsuarios(response?.data?.length);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    getTotalUsuariosAtivos();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center m-5 flex-wrap">
        <div className="flex-1 justify-center items-center m-1">
          <Card className="w-full max-w-sm p-6 grid gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Usuários</h3>
            </div>
            <div className="grid gap-2 text-muted-foreground">
              <div className="flex items-center justify-between text-green-500">
                <span>Ativos</span>
                <span className="font-medium">{totalUsuarios}</span>
              </div>
              <div className="flex items-center justify-between text-red-500">
                <span>Inativos</span>
                <span className="font-medium">0</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="font-medium">0</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex-1 justify-center items-center m-1">
          <Card className="w-full max-w-sm p-6 grid gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Clientes</h3>
            </div>
            <div className="grid gap-2 text-muted-foreground">
              <div className="flex items-center justify-between text-green-500">
                <span>Ativos</span>
                <span className="font-medium">{totalUsuarios}</span>
              </div>
              <div className="flex items-center justify-between text-red-500">
                <span>Inativos</span>
                <span className="font-medium">0</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="font-medium">0</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex-1 justify-center items-center m-1">
          <Card className="w-full max-w-sm p-6 grid gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Logins</h3>
            </div>
            <div className="grid gap-2 text-muted-foreground">
              <div className="flex items-center justify-between text-green-500">
                <span>Ativos</span>
                <span className="font-medium">{totalUsuarios}</span>
              </div>
              <div className="flex items-center justify-between text-red-500">
                <span>Inativos</span>
                <span className="font-medium">0</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="font-medium">0</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
