"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Player } from "@lottiefiles/react-lottie-player";
import { useForm } from "react-hook-form";
import moment from "moment";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CalendarIcon, SaveAllIcon, Settings, UserCircle2 } from "lucide-react";

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
import { Box, IconButton, MenuItem } from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import { Edit } from "@mui/icons-material";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  permissao: string;
  foto: string;
  dataCadastro: string;
  dataAlteracao: string;
  faturamento: number;
  vencimento: string;
  subUsuarios: [];
};

const Usuario = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

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
        accessorFn: (row) =>
          `${moment(row.dataCadastro).format("DD/MM/YYYY HH:mm")}`,
        header: "Data de cadastro",
        size: 150,
      },
      {
        accessorFn: (row) =>
          `${moment(row.dataAlteracao).format("DD/MM/YYYY HH:mm")}`,
        header: "Última alteracão",
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
    faturamento: z.coerce
      .number()
      .positive()
      .int()
      .nonnegative()
      .min(1, "Dia de faturamento é obrigatório")
      .max(28, "Dia de faturamento no máximo até 28"),

    permissoes: z.string().min(1, "Permissão é obrigatória"),
    vencimento: z.date({
      message: "Data de vencimento é obrigatória",
      
    }),
  });

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const { reset } = form;

  const permissoes = [
    { id: "1", nome: "Administrador" },
    { id: "2", nome: "Vendedor" },
  ];

  const onSubmit = async (data: any) => {
    console.log(data);
    const permissao = permissoes.find((p) => p.id === data?.permissoes);
    let dataToSend = {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      usuarioPai: {
        id: Token_dados().id,
      },
      faturamento: data.faturamento,
      vencimento: data.vencimento,

      permissoes: {
        id: permissao_scope === "Administrador" ? permissao?.id : 2,
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
        form.reset({
          permissoes: "",
          nome: "",
          email: "",
          senha: "",
          faturamento: "",
        });
        getTodosUsuarios();
      })
      .catch((e) => {
        toast.error(`Erro : ${e?.response?.data?.message}`, {
          position: "bottom-center",
        });
        console.log(e);
      })
      .finally(() => {});
  };

  const getTodosUsuarios = async () => {
    setLoadingUsuarios(true);
    return await api
      .get(`/api/usuario/${meuId}/pai-e-descendentes`)
      .then((r) => {
        setData(r.data);
        console.log(r.data);
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
    filterFromLeafRows: true,
    enableExpanding: true,
    enableStickyHeader: true,
    enableFullScreenToggle: false,
    muiTableContainerProps: { sx: { maxHeight: "50vh" } },
    layoutMode: "semantic",
    globalFilterFn: "contains",
    initialState: {
      isLoading: loadingUsuarios,

      showColumnFilters: false,
    },
    getSubRows: (originalRow) => originalRow?.subUsuarios,

    enableRowActions: true,

    renderRowActions: ({ row }) => [
      <IconButton>
        <Dialog>
          <DialogTrigger
            onClick={() => {
              setNome(row?.original?.nome);
              setEmail(row?.original?.email);
            }}
          >
            {" "}
            <Edit />{" "}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edição de dados</DialogTitle>
              <DialogDescription>
                Faça as alterações desejadas aqui. Clique em salvar ao terminar.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nome" className="text-right">
                  Nome
                </Label>
                <Input
                  id="nome"
                  required
                  value={nome}
                  className="col-span-3"
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  className="col-span-3"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={() => handleEdit(row?.original)}>
                  <SaveAllIcon className="mr-2 h-4 w-4" />
                  Gravar alterações
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </IconButton>,
    ],
  });

  const handleEdit = (row: any) => {
    const send = z.object({
      id: z.number(),
      nome: z.string().min(1, "Nome é obrigatório"),
      email: z
        .string()
        .min(1, " E-mail é  obrigatório ")
        .email("E-mail inválido"),
    });

    const data = { id: row.id, nome: nome, email: email };

    try {
      // Validação dos dados
      send.parse(data);

      // Envio dos dados para a API
      return api
        .put("/api/usuario/atualizar", data)
        .then((r) => {
          toast.success("Sucesso!", {
            position: "top-center",
          });
          getTodosUsuarios();
        })
        .catch((e) => {
          toast.error(`Erro : ${e?.response?.data?.message}`, {
            position: "bottom-center",
          });
        });
    } catch (e) {
      // Tratamento de erro de validação
      if (e instanceof z.ZodError) {
        e.errors.forEach((error) => {
          toast.error(`Erro : ${error.message}`, {
            position: "top-center",
          });
        });
      } else {
        console.error("Erro inesperado:", e);
      }
    }
  };

  useEffect(() => {
    getTodosUsuarios();
  }, []);

  return (
    <>
      <ToastContainer />

      <div className="flex flex-col m-5 flex-wrap ">
        <Tabs defaultValue="cadastro" className="w-full p-4">
          <TabsList>
            <TabsTrigger value="cadastro">
              <span className="flex items-center justify-center gap-2">
                <SaveAllIcon className="h-4 w-4" />
                Cadastro de usuários
              </span>
            </TabsTrigger>
            <TabsTrigger value="manutencao">
              <span className="flex items-center justify-center gap-2">
                <Settings className="h-4 w-4" />
                Manutenção de usuários
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cadastro">
            <Card>
              <CardHeader>
                <CardTitle>Novo</CardTitle>
                <CardDescription>Cadastrar novo usuário </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row gap-10 m-5 justify-around item-center flex-wrap">
                  <Player
                    autoplay={true}
                    loop={true}
                    controls={true}
                    src="/animations/add-user.json"
                    style={{ height: "50vh", width: "100%" }}
                  ></Player>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="permissoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Permissão</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleione uma permissão" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {permissoes.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-5">
                        <FormField
                          control={form.control}
                          name="nome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="senha"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <Input type="text" {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex gap-5">
                        <FormField
                          control={form.control}
                          name="faturamento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dia de faturamento</FormLabel>
                              <Input
                                type="number"
                                id="number"
                                placeholder="Informe o dia do faturamento"
                                pattern="[0-9]*"
                                {...field}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vencimento"
                          render={({ field }) => (
                            <FormItem className="flex flex-col m-2">
                              <FormLabel>Próximo vencimento</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        moment(field.value).format("DD/MM/YYYY")
                                      ) : (
                                        <span>Escolha uma data</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date <= new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center justify-center my-5">
                        <Button type="submit">
                          <SaveAllIcon className="mr-2 h-4 w-4" />
                          Gravar
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="manutencao">
            <Card>
              <CardHeader>
                <CardTitle>Manutenção</CardTitle>
              </CardHeader>
              <CardContent>
                <MaterialReactTable table={table} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Usuario;
<></>;
