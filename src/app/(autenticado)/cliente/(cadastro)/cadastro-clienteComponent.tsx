"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/service/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Player } from "@lottiefiles/react-lottie-player";

import { SaveAllIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

import { z } from "zod";
import Token_dados from "../../(token)/util";

const schema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "Informe um e-mail ").email("Email inválido"),
  observacao: z.string().optional(),
  whastapp: z.string().min(0, "Informe um número de WhatsApp").optional(),
  foto: z.string().optional(),
});

const CadastroClientePage = () => {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const [foto, setFoto] = useState<string | null>(null);


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

  

  const onSubmit = async (data: any) => {
    let fotoWithoutBase64 = foto?.replace(/^data:image\/[a-z]+;base64,/, "");
    let sendData = {
      id: Math.floor(Math.random() * 1000000),
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
      await schema.parseAsync(sendData);

      return api
        .post("/api/cliente/cadastrar", sendData)
        .then((r) => {
          console.log(r.data);
          form.reset({
            nome: "",
            email: "",
            observacao: "",
            whastapp: "",
            foto: "",
          });
          toast.success("Sucesso !", {
           
           
           
          });
         
        })
        .catch((e) => {
          console.log(e);
          toast.error(
            "Erro ao cadastrar! código " +
              e?.response?.status +
              " " +
              e?.response?.data?.message,
            {
              position: "bottom-center",
            }
          );
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    
    <div className="flex flex-row m-5 flex-wrap">
      <Toaster />
      <Player
        autoplay={true}
        loop={true}
        controls={true}
        src="/animations/customers.json"
        style={{ height: "50vh", width: "100%" }}
      ></Player>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
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
          </div>
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
                  <FormLabel>E-mail</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whastapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <Input type="tel" {...field} pattern="[0-9]*" />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-5">
            <FormField
              control={form.control}
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Informações livres</FormLabel>
                  <Textarea {...field} />
                  <p className="text-sm text-muted-foreground">
                    Escreva aqui qualquer informação adicional que desejar
                  </p>

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
  );
};

export default CadastroClientePage;
