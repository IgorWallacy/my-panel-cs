"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveAllIcon, UserCircle2 } from "lucide-react";

import api from "@/service/api";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import Token_dados from "../(token)/util";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, CardActionArea } from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  permissao: string;
  foto: string;
  subUsuarios: [];
};

const Usuario = () => {
  const columns = useMemo<MRT_ColumnDef<Usuario>[]>(
    () => [
      {
        accessorFn: (row) => `${row.nome}`,
        id: "nome",
        header: "Nome",
        size: 250,
        Cell: ({ renderedCellValue, row }) => (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {row?.original?.foto ? (
                <>
                  <img
                    src={`data:image/png;base64,${row?.original?.foto}`}
                    alt="avatar"
                    className="w-12 h-12 rounded-full"
                  />
                </>
              ) : (
                <>
                  <UserCircle2 className="w-12 h-12 rounded-full" />
                </>
              )}

              {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
              <span>{renderedCellValue}</span>
            </Box>
          </>
        ),
      },
      {
        accessorKey: "email",
        header: "E-mail",
        size: 150,
      },
      {
        accessorKey: "permissoes.nome", //normal accessorKey
        header: "Permissão",
        size: 150,
      },
    ],
    []
  );

  const [data, setData] = useState<Usuario[]>([]);

  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  const permissao_scope = Token_dados().scope;
  const meuId = Token_dados().id;

  const schema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(1, "Senha é obrigatória"),
    permissoes: z.string().min(1, "Permissão é obrigatória"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const permissoes = [
    { id: "1", nome: "Administrador" },
    { id: "2", nome: "Vendedor" },
  ];

  const onSubmit = async (data: any) => {
    const permissao = permissoes.find((p) => p.id === data?.permissoes);
    let dataToSend = {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      usuarioPai: {
        id: Token_dados().id,
      },

      permissoes: {
        id: permissao?.id,
        nome: permissao?.nome,
      },
    };
    // console.log(dataToSend);
    return api
      .post("/api/usuario/novo", dataToSend)
      .then((r) => {
        toast.success("Sucesso!", {
          position: "top-center",
        });
        getTodosUsuarios();
        reset();
      })
      .catch((e) => {
        toast.error(`Erro ao salvar ${e?.message}`, {
          position: "bottom-center",
        });
      })
      .finally(() => {
       
      });
  };

  const getTodosUsuarios = async () => {
    setLoadingUsuarios(true);
    return await api
      .get(`/api/usuario/${meuId}/pai-e-descendentes`)
      .then((r) => {
        setData(r.data);
        //console.log(r.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoadingUsuarios(false);
      });
  };

  const table = useMaterialReactTable({
    localization: MRT_Localization_PT_BR,
    columns,
    data,
    enableExpanding: true,
    enableStickyHeader: true,
    muiTableContainerProps: { sx: { maxHeight: "50vh" } },
    layoutMode: "grid",
    globalFilterFn: "contains",
    initialState: {
      isLoading: loadingUsuarios,

      showColumnFilters: false,
    },
    getSubRows: (originalRow) => originalRow?.subUsuarios,
  });

  useEffect(() => {
    getTodosUsuarios();
  }, []);

  return (
    <>
      <ToastContainer />

      <div className="flex flex-col m-5 flex-wrap ">
        <Card>
          <CardHeader>
            <CardTitle>Novo</CardTitle>
            <CardDescription>Cadastrar novo usuário </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-5 m-5 justify-around flex-wrap">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col items-center justify-center gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="permissoes">Permissão</Label>

                    <select
                      className="m-1 p-2 border w-full   border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...register("permissoes", { required: true })}
                    >
                      {permissao_scope === "Administrador" ? (
                        permissoes.map((permissao) => (
                          <option key={permissao.id} value={permissao.id}>
                            {permissao.nome}
                          </option>
                        ))
                      ) : (
                        <option key="2" value="2">
                          Vendedor
                        </option>
                      )}
                    </select>

                    {errors.permissoes?.message && (
                      <p>{errors.permissoes.message.toString()}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      {...register("nome")}
                      type="mome"
                      placeholder="Informe o nome"
                    />
                    {errors.nome?.message && (
                      <p className="font-bold text-red-500">
                        {errors.nome.message.toString()}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="Informe o e-mail"
                    />
                    {errors.email?.message && (
                      <p className="font-bold text-red-500">
                        {errors.email.message.toString()}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="senha">Senha</Label>
                    <Input
                      {...register("senha")}
                      type="text"
                      placeholder="Informe a senha"
                    />
                    {errors.senha?.message && (
                      <p className="font-bold text-red-500">
                        {errors.senha.message.toString()}
                      </p>
                    )}
                  </div>
                </div>
                <CardActionArea className="m-1">
                 
                    <Button className="flex items-center justify-center w-56 m-5 ">
                      <SaveAllIcon className="mr-2 h-4 w-4" />
                      Gravar
                    </Button>
                 
                </CardActionArea>
              </form>
              <MaterialReactTable table={table} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Usuario;
<></>;
