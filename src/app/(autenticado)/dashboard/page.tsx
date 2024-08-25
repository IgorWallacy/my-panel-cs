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
import Token_dados from "../(token)/util";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalLogins, setTotalLogins] = useState(0);
  const [totalLoginsInativos, setTotalLoginsInativos] = useState(0);
  const meuId = Token_dados().id;

  const getTotalUsuariosAtivos = async () => {
    return api
      .get(`/api/usuario/${meuId}/pai-e-descendentes`)
      .then((response) => {
        setTotalUsuarios(response?.data?.[0]?.subUsuarios?.length);
       
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getTotalClientesAtivos = async () => {
    return api
              .get(`/api/cliente/todos/${meuId}`)
      .then((response) => {
        setTotalClientes(response?.data?.length);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getTotalLoginsAtivos = async () => {
    return api
              .get(`/api/login/listar/ativos/${meuId}`)
      .then((response) => {
        setTotalLogins(response?.data?.length);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  
  const getTotalLoginsInativos = async () => {
    return api
              .get(`/api/login/listar/inativos/${meuId}`)
      .then((response) => {
        setTotalLoginsInativos(response?.data?.length);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    getTotalUsuariosAtivos();
    getTotalClientesAtivos();
    getTotalLoginsAtivos();
    getTotalLoginsInativos();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 p-4">
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>Total de Usuários</CardTitle>
          <CardDescription>Usuários ativos e inativos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-green-500">Ativos</h3>
              <p className="text-2xl text-green-500">{totalUsuarios}</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <h3 className="text-lg font-semibold text-red-500">Inativos</h3>
              <p className="text-2xl text-red-500">{0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>Total de Clientes & Logins</CardTitle>
          <CardDescription>Logins & Clientes ativos e inativos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Clientes</h3>
              <p className="text-2xl">{totalClientes}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-500">Logins ativos</h3>
              <p className="text-2xl text-green-500">{totalLogins}</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <h3 className="text-lg font-semibold text-red-500">Logins inativos</h3>
              <p className="text-2xl text-red-500">{totalLoginsInativos}</p>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
       
      
    </>
  );
}
