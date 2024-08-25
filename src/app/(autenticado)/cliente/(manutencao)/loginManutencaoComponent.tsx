"use client";

import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Tag } from "primereact/tag";

import { Column } from "primereact/column";
import api from "@/service/api";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Edit3Icon,
  SaveAll,
  Shuffle,
  ShuffleIcon,
  UserRound,
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

import "moment/locale/pt-br";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { FilterMatchMode } from "primereact/api";

import toast, { Toaster } from "react-hot-toast";
import { Cancel } from "@mui/icons-material";
import Token_dados from "../../(token)/util";
import moment from "moment-timezone";

moment.tz.setDefault("America/Sao_Paulo");
moment.locale("pt-br");

const ManutencaoLoginPage = ({
  ativo,
}: {
  ativo: (index: number) => void;
}) => {
  const vendedor_id = Token_dados().id;
  const [rowLogin, setRowLogin] = useState<any>(null);
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | any[]
  >([]);

  const [dialogLoginVisible, setDialogLoginVisible] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const schema = z.object({
    id: z.number().min(1, "ID é obrigatório"),
    login: z.string().min(1, "Login é obrigatório"),
    senha: z.string().min(1, "Senha é obrigatória"),
    vencimento: z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Vencimento é obrigatório",
    }),
    // cliente: z.object({ id: z.number().min(1, "Cliente é obrigatório") }),
  });

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const getLogins = async () => {
    setLoading(true);
    return await api
      .get(`/api/login/listar/${vendedor_id}`)
      .then((r) => {
        setLogins(r.data);
        setLoading(false);
        console.log(r.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = async (data: any) => {
    await schema.parseAsync(data);

    console.log(data);

    let sendData = {
      id: data.id,
      login: data.login,
      senha: data.senha,
      cliente: {
        id: rowLogin.clienteId,
      },
      vencimento: data.vencimento,
    };

    console.log(sendData);

    const myPromise = api
      .post("/api/login/atualizar", sendData)
      .then((r) => {
        form.reset({
          login: "",
          senha: "",
          vencimento: "",
        });

        setDialogLoginVisible(false);
        getLogins();
        ativo(2);
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

  useEffect(() => {
    if (rowLogin) {
      form.setValue("id", rowLogin?.id);

      form.setValue("login", rowLogin?.login);
      form.setValue("senha", rowLogin?.senha);
      form.setValue("vencimento", moment(rowLogin?.vencimento).toDate());
    }
  }, [rowLogin, form.setValue]);

  useEffect(() => {
    getLogins();
  }, []);

  return (
    <>
      <div className="flex-1  flex-row gap-1">
       
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
                      <CardTitle>Editar login</CardTitle>
                      <CardDescription>
                        Editar um login de acesso para o cliente selecionado.
                      </CardDescription>

                      <CardDescription>
                        <h1>
                          {" "}
                          <strong>
                            {" "}
                            Cliente selecionado {"-->"} {rowLogin?.nomeCliente}{" "}
                          </strong>
                        </h1>
                      </CardDescription>

                      <CardDescription>
                        Você está atualizando um login de acesso pelo receptor
                        de canais para o(a) cliente{" "}
                        <strong>{rowLogin?.nomeCliente}</strong>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2 items-center flex-wrap">
                        {rowLogin?.foto ? (
                          <>
                            {" "}
                            <img
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                              }}
                              src={`data:image/png;base64,${rowLogin?.foto}`}
                              alt="avatar"
                            />
                          </>
                        ) : (
                          <>
                            <Avatar />
                          </>
                        )}
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
                              <div className="flex flex-col gap-4 m-2">
                                <FormItem className="flex flex-col">
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
                                          moment(date).isBefore(moment(), "day")
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                                <Button
                                  type="button"
                                  onClick={() =>
                                    field.onChange(
                                      moment().add(30, "days").toDate()
                                    )
                                  }
                                  className="flex items-center"
                                >
                                  <ShuffleIcon className="mr-2 h-4 w-4" />
                                  Adicionar +30 dias
                                </Button>
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex  items-center gap-5 flex-wrap w-full">
                        <Button type="submit" className="w-full">
                          <SaveAll className="mr-2 h-4 w-4" /> Atualizar
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
                            Ao clicar em atualizar, você estará salvando as
                            alterações do login.
                          </p>
                          <p>
                            <strong>Atenção:</strong> Ao clicar em fechar, você
                            estará fechando a janela de edição sem salvar as
                            informações alteradas.
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
              emptyMessage="Nada por enquanto para exibir"
              loading={loading}
              value={logins}
              responsiveLayout="stack"
              breakpoint="968px"
              stripedRows
              globalFilterFields={["nomeCliente", "login"]}
              filters={filters}
              rowGroupMode="subheader"
              dataKey="id"
              groupRowsBy="clienteId"
              sortMode="single"
              sortField="clienteId"
              sortOrder={1}
              rowGroupHeaderTemplate={(row, i) => {
                return (
                  <>
                    {row?.foto ? (
                      <>
                        <div className=" flex justify-center items-center bg-black p-1 text-white rounded-2xl m-1">
                          <img
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              verticalAlign: "middle",
                            }}
                            src={`data:image/png;base64,${row?.foto}`}
                            alt="avatar"
                            className="ml-2"
                          />
                          <span className="vertical-align-middle ml-2 font-bold line-height-3">
                            {row?.nomeCliente}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className=" flex justify-center items-center bg-black p-1 text-white rounded-2xl m-1">
                          <UserRound size="40" />
                          <span className="vertical-align-middle ml-2 font-bold line-height-3">
                            {row?.nomeCliente}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                );
              }}
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
              <Column field="login" header="Login"></Column>
              <Column field="senha" header="Senha"></Column>
              <Column
                field="vencimento"
                header="Próximo vencimento"
                body={(row) =>
                  moment(row.vencimento).format("DD/MM/YYYY - dddd")
                }
              ></Column>
              <Column
                body={(row) => {
                  const now = moment();
                  const vencimento = moment(row.vencimento);
                  const isToday = vencimento.isSame(now, "day");
                  const isPast = vencimento.isBefore(now, "day");

                  const diffYears = vencimento.diff(now, "years");
                  now.add(diffYears, "years");
                  const diffMonths = vencimento.diff(now, "months");
                  now.add(diffMonths, "months");
                  const diffDays = vencimento.diff(now, "days");
                  now.add(diffDays, "days");
                  const diffHours = vencimento.diff(now, "hours");

                  return (
                    <>
                      <Tag severity={isPast ? "danger" : isToday ? 'warning' : 'success'}>
                        {isToday
                          ? "Vencendo hoje"
                          : isPast
                          ? `Vencido  ${
                              diffYears > 0 ? `${diffYears} ano(s), ` : ""
                            }${
                              diffMonths > 0 ? `${diffMonths} mês(es), ` : ""
                            }${diffDays > 0 ? `${diffDays} dia(s), ` : ""}${
                              diffHours > 0 ? `${diffHours} hora(s)` : ""
                            }`
                          : `falta(m) ${
                              diffYears > 0 ? `${diffYears} ano(s), ` : ""
                            }${
                              diffMonths > 0 ? `${diffMonths} mês(es), ` : ""
                            }${diffDays > 0 ? `${diffDays} dia(s) ` : ""}`}
                      </Tag>
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
                          setDialogLoginVisible(true);
                          setRowLogin(row);
                        }}
                      >
                        <Edit3Icon /> Editar login
                      </Button>
                    </>
                  );
                }}
              ></Column>
            </DataTable>
          </>
        )}
      </div>
    </>
  );
};

export default ManutencaoLoginPage;
