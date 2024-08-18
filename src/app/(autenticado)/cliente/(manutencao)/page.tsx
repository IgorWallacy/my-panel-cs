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
  Search,
} from "lucide-react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardContent } from "@mui/material";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ManutencaoClientePage = () => {
  const [clientes, setClientes] = useState([]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const idVendedor = Token_dados().id;

  const schema = z.object({
    login: z.string().min(1, "Login é obrigatório"),
    senha: z.string().min(1, "Senha é obrigatória"),
  });

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const getClientes = () => {
    return api
      .get(`/api/cliente/todos/${idVendedor}`)
      .then((response) => {
        setClientes(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  const onGlobalFilterChange = (e:any) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  useEffect(() => {
    getClientes();
  }, []);

  return (
    <>
      <div className="flex w-full flex-row gap-5 items-center justify-center flex-wrap">
        <DataTable
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
                  <Dialog>
                    <DialogTrigger>
                      <Button>
                        <MoveRightIcon /> Adicionar login
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar login a este cliente</DialogTitle>
                        <DialogDescription>
                         Esta ação adiciona um login ao cliente selecionado
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                          <Card>
                            <CardHeader>
                              <CardTitle>{row?.nome}</CardTitle>
                              <CardDescription>
                                Você esta cadastrando um login de acesso pelo receptor de canais para este cliente
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-col gap-2 items-center flex-wrap">
                                <img
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                  }}
                                  src={`data:image/png;base64,${row?.foto}`}
                                  alt="avatar"
                                />
                                
                              </div>
                              <div className="flex items-center justify-center flex-wrap flex-">
                                <div className="flex gap-5 items-center justify-center flex-row flex-wrap w-full">
                                  <FormField
                                    control={form.control}
                                    name="login"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Login </FormLabel>
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
                                        <FormLabel>
                                          Próximo vencimento
                                        </FormLabel>
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
                              <Button className="w-full">
                                <SaveAll className="mr-2 h-4 w-4" /> Adicionar
                              </Button>
                            </CardFooter>
                          </Card>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </>
              );
            }}
          ></Column>
          <Column
            body={(row) => {
              return (
                <>
                  <Button
                    className="flex gap-2"
                    onClick={() => {
                      console.log(row);
                    }}
                  >
                    <Edit />
                    Editar
                  </Button>
                </>
              );
            }}
          ></Column>
        </DataTable>
      </div>
    </>
  );
};

export default ManutencaoClientePage;
