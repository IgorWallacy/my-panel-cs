"use client";
const key: string = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import CryptoJS from "crypto-js";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { LogIn, RotateCcw } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgressBar } from "primereact/progressbar";

const schema = z.object({
  email: z.string().min(1, "E-mail não informado").email("E-mail inválido"),
  password: z.string().min(1, "Senha não informada"),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any[]>([]);

  const router = useRouter();

  const [baseURL, setBaseURL] = useState("");

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const url =
      window.location.protocol + "//" + window.location.hostname + ":8080";
    setBaseURL(url);
  }, []);

  const encryptJSON = (jsonObject: object, key: string): string => {
    const jsonString = JSON.stringify(jsonObject);

    // Gerar IV aleatório
    const iv = CryptoJS.lib.WordArray.random(16);

    // Criptografar usando AES-256-CBC com PKCS5Padding
    const encrypted = CryptoJS.AES.encrypt(
      jsonString,
      CryptoJS.enc.Hex.parse(key),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    // Concatenar IV e dados criptografados
    const encryptedData = iv
      .concat(encrypted.ciphertext)
      .toString(CryptoJS.enc.Base64);

    return encryptedData;
  };

  async function login(data: any) {
    setLoading(true);

    const email = data?.email;
    const password = data?.password;

    const encryptedData = encryptJSON(data, key);

    var headers = {
      Authorization: "Basic ZG9rczpkb2tzMTIz",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const params = new URLSearchParams({
      encryptedData: encryptedData,
    });

    const api = axios.create({
      baseURL: baseURL,
      headers: headers,
      params: params,
    });

    // console.log(encryptedData);

    localStorage.clear();
    await api
      .post("/oauth/token", encryptedData, { params, headers })
      .then((r) => {
        localStorage.setItem("access_token", r.data?.access_token);
        router.push("/dashboard");
        // console.log(r.data);
      })
      .catch((e) => {
        setError([e]);
        //console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <div className="flex min-h-dvh flex-col bg-gradient-to-b from-[#0D6EFD] to-[#0B5ED7] text-white">
        {error?.length > 0 ? (
          <>
            <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 bg-red-800">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto h-12 w-12 text-red-500" />
                <h1 className=" text-white mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {error[0]?.response?.status === 401
                    ? "🚫 Oops, credenciais inválidas ! "
                    : ""}
                </h1>
                <h1 className=" text-white mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {error[0]?.response?.status === 500
                    ? " Oops, Ocorreu um erro no servidor ! "
                    : ""}
                </h1>
                <p className="text-white">
                  {error.map(
                    (m) =>
                      "Mensagem da API : " +
                      m?.message +
                      " Código do erro : " +
                      m?.response?.status
                  )}
                </p>
                <h1 className=" text-white mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {error[0]?.code === "ERR_NETWORK"
                    ? "👨‍🔧 Oops, Erro no servidor ! "
                    : ""}
                </h1>

                <p className="mt-4 text-muted-foreground text-white">
                  Não foi possível realizar seu login.
                </p>
                <div className="mt-6">
                  <Button
                    className="inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-red-50 shadow-sm transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={() => setError([])}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Tentar novamente
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {" "}
            {loading ? (
              <>
                <ProgressBar
                  mode="indeterminate"
                  style={{ height: "24px" }}
                ></ProgressBar>
              </>
            ) : (
              <>
               
              
                <div className="flex h-screen bg-gray-300  flex-row-reverse flex-wrap justify-around items-center">
                  <Card className="w-full max-w-md absolute ">
                    <form onSubmit={handleSubmit(login)} className="space-y-4">
                      <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">
                          {" "}
                          🔒 Acesso 🔒
                        </CardTitle>
                        <CardDescription>
                          Informe seu e-mail e senha para acessar o sistema
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seuemail@email.com"
                            required
                            {...register("email")}
                          />
                          {errors.email && (
                            <p className="text-red-500">
                              {String(errors.email.message)}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Senha</Label>
                          <Input
                            placeholder="Sua melhor senha "
                            id="password"
                            type="password"
                            required
                            {...register("password")}
                          />
                          {errors.password && (
                            <p className="text-red-500">
                              {String(errors.password.message)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="remember" className="cursor-pointer">
                            <Checkbox id="remember" />
                            Lembre-me
                          </Label>
                          <Link
                            href="#"
                            className="text-sm font-medium underline underline-offset-4 hover:text-primary"
                            prefetch={false}
                          >
                            Esqueci minha senha
                          </Link>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="grid gap-2 sm:flex sm:justify-end">
                          <Button
                            type="submit"
                            variant="default"
                            className="w-full sm:w-auto"
                            disabled={loading}
                          >
                            <LogIn className="mr-2 h-4 w-4" />{" "}
                            {loading ? "Carregando..." : "Entrar"}
                          </Button>

                          <Link
                            href="#"
                            className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                            prefetch={false}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Recuperar senha
                          </Link>
                        </div>
                      </CardFooter>
                    </form>
                  </Card>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
