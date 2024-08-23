"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import api from "@/service/api";
import { useEffect, useState } from "react";
import Token_dados from "../../(token)/util";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Edit,
  MoveRightIcon,
  SaveAll,
  SaveAllIcon,
  UserRound,
  X,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, CardContent } from "@mui/material";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { FilterMatchMode } from "primereact/api";

import { Textarea } from "@/components/ui/textarea";
import toast, { Toaster } from "react-hot-toast";
import { Cancel } from "@mui/icons-material";


const ManutencaoClientePage = () => {
  const [row, setRow] = useState<any>(null);
  const [rowLogin, setRowLogin] = useState<any>(null);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogLoginVisible, setDialogLoginVisible] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const idVendedor = Token_dados().id;

  const schema = z.object({
    
    login: z.string().min(1, "Login é obrigatório"),
    senha: z.string().min(1, "Senha é obrigatória"),
    vencimento: z.date({
      message: "Data de vencimento é obrigatória",
    }),
   // cliente: z.object({ id: z.number().min(1, "Cliente é obrigatório") }), 
  });

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const getClientes = () => {
    setLoading(true);
    return api
      .get(`/api/cliente/todos/${idVendedor}`)
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = async (data: any) => {

    
   
    await schema.parseAsync(data);

  //  console.log(data);

    let sendData = {
      id: null,
      login: data.login,
      senha: data.senha,
      cliente: {
        id: rowLogin.id,
      },
      vencimento: data.vencimento,
    };

   // console.log(sendData);

    const myPromise = api
      .post("/api/login/cadastrar", sendData)
      .then((r) => {
        form.reset({
          login: "",
          senha: "",
          vencimento: "",
        });

        setDialogLoginVisible(false);
        getClientes();
        return r.data;
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {});
   return toast.promise(myPromise, {
      loading: "Salvando...",
      success: "Sucesso!",
      error: (err) => `Erro ao salvar dados: ${err.message || "Desconhecido"}`,
    });

  };

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const [foto, setFoto] = useState<string | null>(null);

  const schemaCliente = z.object({
    id: z.number(),
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().min(1, "Informe um e-mail ").email("Email inválido"),
    observacao: z.string().min(0).optional(),
    whastapp: z.string().min(0, "Informe um número de WhatsApp").optional(),
    foto: z.string().min(0).optional(),
  });

  const formCliente = useForm({
    resolver: zodResolver(schemaCliente),
    mode: "onBlur",
  });

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFoto(e?.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitCliente = async (data: any) => {
    let fotoWithoutBase64 = foto?.replace(/^data:image\/[a-z]+;base64,/, "");
    let sendDataCliente = {
      id: data?.id,
      nome: data.nome,
      email: data.email,
      observacao: data.observacao,
      whatsapp: data.whastapp,
      foto: fotoWithoutBase64,
      usuario: {
        id: Token_dados().id,
      },
    };

    try {
      await schemaCliente.parseAsync(sendDataCliente);
      //  console.log(sendDataCliente);

      const myPromise = api
        .put("/api/cliente/atualizar", sendDataCliente)
        .then((r) => {
          // console.log(r.data);
          form.reset({
            nome: "",
            email: "",
            observacao: "",
            whastapp: "",
            foto: "",
          });

          setDialogVisible(false);
          getClientes();
          return r.data;
        })
        .catch((e) => {
          throw e;
        })
        .finally(() => {});
      return toast.promise(myPromise, {
        loading: "Carregando...",
        success: "Sucesso!",
        error: (err) =>
          `Erro ao salvar dados: ${err.message || "Desconhecido"}`,
      });
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    if (row) {
      formCliente.setValue("id", row?.id);
      formCliente.setValue("nome", row?.nome);
      formCliente.setValue("email", row?.email);
      formCliente.setValue("observacao", row?.observacao);
      formCliente.setValue("whastapp", row?.whastapp);
    }
  }, [row, formCliente.setValue]);

  useEffect(() => {
    getClientes();
  }, []);
  
  return (
    <>
      <div className="flex w-full flex-row gap-5  flex-wrap">
        {dialogVisible ? (
          <>
            <Card className="flex-1 ">
              <CardHeader>
                <CardTitle>Editar cliente</CardTitle>
                <CardDescription>
                  Realize as mudanças no perfil do cliente aqui. Clique em
                  gravar quando você terminar.
                </CardDescription>
              </CardHeader>
              <div className="flex gap-4 p-4 flex-wrap">
                <Form {...formCliente}>
                  <form
                    className="flex flex-col gap-4 flex-wrap"
                    autoComplete="off"
                    onSubmit={formCliente.handleSubmit(onSubmitCliente)}
                  >
                    <div className="flex flex-col gap-2">
                      <img
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                        src={`data:image/png;base64,${row?.foto}`}
                        alt="avatar"
                      />
                      <span>{row.nome}</span>
                    </div>

                    <FormField
                      control={formCliente.control}
                      name="foto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Foto do cliente </FormLabel>
                          <Input
                            {...field}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e)}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={formCliente.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <Input {...field} autoComplete="off" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formCliente.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <Input {...field} autoComplete="off" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formCliente.control}
                      name="whastapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp</FormLabel>
                          <Input
                            type="tel"
                            {...field}
                            pattern="[0-9]*"
                            autoComplete="off"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={formCliente.control}
                      name="observacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Informações livres</FormLabel>
                          <Textarea {...field} autoComplete="off" />
                          <p className="text-sm text-muted-foreground">
                            Escreva aqui qualquer informação adicional que
                            desejar
                          </p>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-5 items-center justify-center m-5">
                      <Button type="submit">
                        <SaveAllIcon className="mr-2 h-4 w-4" />
                        Gravar
                      </Button>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => setDialogVisible(false)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Fechar
                      </Button>
                    </div>
                    <CardDescription>
                      <p className="text-muted-foreground">
                        Ao clicar em gravar, você estará salvando as informações
                        do cliente.
                      </p>
                      <p>
                        <strong>Atenção:</strong> Ao clicar em fechar, você
                        estará fechando a janela de edição sem salvar as
                        informações.
                      </p>
                    </CardDescription>
                  </form>
                </Form>
              </div>
            </Card>
          </>
        ) : (
          <>
            {dialogLoginVisible ? (
              <>
                <Form {...form}>
                  <form
                    autoComplete="off"
                    autoCorrect="false"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <div className="flex flex-col gap-5 flex-wrap items-center">
                      <Card>
                        <CardHeader>
                          <CardTitle>Adicionar login</CardTitle>
                          <CardDescription>
                            Adicione um login de acesso para o cliente
                            selecionado.
                          </CardDescription>

                          <CardDescription>
                         <h1>   Cliente selecionado {"-->"} {rowLogin?.nome}</h1>
                          </CardDescription>
                          
                          <CardDescription>
                            Você esta cadastrando um login de acesso pelo
                            receptor de canais para o(a) cliente {rowLogin?.nome}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-2 items-center flex-wrap">
                            {rowLogin?.foto ? <> <img
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                              }}
                              src={`data:image/png;base64,${rowLogin?.foto}`}
                              alt="avatar"
                            /></> : <>
                            <Avatar />
                            </>}

                           
                          </div>
                          <div className="flex items-center justify-center flex-wrap flex-">
                            <div className="flex gap-5 items-center justify-center flex-row flex-wrap w-full">
                              <FormField
                                control={form.control}
                                name="login"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Login </FormLabel>
                                    <Input {...field} autoComplete="off" />
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
                                    <Input {...field} />
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
                                              !field.value &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              moment(field.value).format(
                                                "DD/MM/YYYY"
                                              )
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
                                          disabled={(date) =>
                                            date <= new Date()
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className="flex  items-center gap-5 flex-wrap w-full">
                            <Button type="submit" className="w-full">
                              <SaveAll className="mr-2 h-4 w-4" /> Adicionar
                            </Button>
                            <Button
                              variant="destructive"
                              className="w-full"
                              onClick={() => setDialogLoginVisible(false)}
                            >
                              <Cancel className="mr-2 h-4 w-4" /> Fechar
                            </Button>
                            <CardDescription>
                            <p className="text-muted-foreground">
                              Ao clicar em adicionar, você estará salvando as
                              informações do login.
                            </p>
                            <p>
                              <strong>Atenção:</strong> Ao clicar em fechar,
                              você estará fechando a janela de adição sem salvar as
                              informações.
                            </p>
                          </CardDescription>
                          </div>

                          

                        </CardFooter>
                      </Card>
                    </div>
                  </form>
                </Form>
              </>
            ) : (
              <>
                <DataTable
                  loading={loading}
                  className="w-full"
                  value={clientes}
                  responsiveLayout="stack"
                  breakpoint="968px"
                  stripedRows
                  rows={3}
                  paginator
                  globalFilterFields={["nome", "email", "whatsapp"]}
                  filters={filters}
                  header={() => {
                    return (
                      <div className="flex justify-content-end">
                        <Input
                          value={globalFilterValue}
                          onChange={onGlobalFilterChange}
                          placeholder="Pesquisar"
                        />
                      </div>
                    );
                  }}
                >
                  <Column
                    field="foto"
                    body={(row) => {
                      return (
                        <>
                          <div className="flex gap-2 items-center">
                            {row?.foto ? (
                              <>
                                <img
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                  }}
                                  src={`data:image/png;base64,${row?.foto}`}
                                  alt="avatar"
                                />
                              </>
                            ) : (
                              <>
                                <UserRound size={50} />
                              </>
                            )}

                            <span>{row.nome}</span>
                          </div>
                        </>
                      );
                    }}
                  ></Column>

                  <Column field="email" header="E-mail"></Column>
                  <Column field="whatsapp" header="WhatsApp"></Column>
                  <Column
                    body={(row) => {
                      return (
                        <>
                          <Button
                            onClick={() => {
                              setDialogLoginVisible(true);
                              setRowLogin(row);
                            }}
                          >
                            <MoveRightIcon /> Adicionar login
                          </Button>
                        </>
                      );
                    }}
                  ></Column>
                  <Column
                    body={(row) => {
                      return (
                        <>
                          <Button
                            onClick={() => {
                              setDialogVisible(true);
                              setRow(row);
                            }}
                          >
                            <Edit /> Editar
                          </Button>
                        </>
                      );
                    }}
                  ></Column>
                </DataTable>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ManutencaoClientePage;
