"use client";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import Token_dados from "../(token)/util";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SaveAllIcon, UploadIcon } from "lucide-react";
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
import api from "@/service/api";
import { useRouter } from "next/navigation";

type FotoProps = {
  id: string | null;
  foto: string;
  email: string | null;
};

const schema = z
  .object({
    password: z.string().min(1, "Senha não informada"),
    confirmPassword: z.string().min(1, "Senha não informada"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

const Perfil = () => {
  const nome = Token_dados()?.nome;
  const email = Token_dados()?.sub;
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const idFoto = useRef(null);
  const [foto, setFoto] = useState();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    api
      .put("/api/usuario/perfil/atualizar", {
        email: email,
        senha: data.password,
      })
      .then((r) => {
        toast.success("Senha atualizada com sucesso !");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      })
      .catch((e) => {
        toast.error(
          "Erro ao atualizar! código " +
            e?.response?.status +
            " " +
            e?.response?.data,
          {
            position: "bottom-center",
          }
        );
      });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getFotoId = () => {
    return api
      .get(`/api/usuario/perfil/foto/fotoID/${email}`)
      .then((r) => {
        idFoto.current = r.data?.id;
        setFoto(r.data?.foto);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        let base64WithPrefix = reader.result as string;
        let base64WithOutPrefix = base64WithPrefix.replace(
          /^data:image\/[a-z]+;base64,/,
          ""
        );

        let foto: FotoProps = {
          id: idFoto.current
            ? idFoto.current
            : Math.floor(Math.random() * 1000000).toString(),
          foto: base64WithOutPrefix,
          email: email,
        };

        api
          .post("/api/usuario/perfil/foto", foto)
          .then((r) => {
            toast.success("Foto atualizada com sucesso !");

            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          })
          .catch((e) => {
            toast.error("Erro ao atualizar a foto !");
          });
      };
      reader.readAsDataURL(file[0]);
    }
  };

  useEffect(() => {
    getFotoId();
  }, []);

  return (
    <>
      

      <Card className="max-w-md mx-auto md:max-w-lg lg:max-w-xl">
        <CardHeader>
          <CardTitle>Atualizar perfil</CardTitle>
          <CardDescription>Gerenciar meus dados de perfil</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-col items-center justify-center bg-gray-200 p-5 shadow-md rounded-lg">
            <img
              className="w-32 h-32 rounded-full"
              src={`data:image/png;base64,${foto}`}
              alt="avatar"
            />
            <h1 className="text-xl font-semibold mt-5">{nome}</h1>
            <span className="text-gray-500 text-sm">{email}</span>
          </div>
          <div className="grid gap-4">
            <Button variant="outline" onClick={() => handleButtonClick()}>
              <UploadIcon className="mr-2 h-4 w-4" />
              Atualizar minha foto
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <Separator />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Informe sua melhor senha"
                />
                {errors.password?.message && (
                  <p>{errors.password.message.toString()}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirme sua nova senha"
                />
                {errors.confirmPassword?.message && (
                  <p>{errors.confirmPassword.message.toString()}</p>
                )}
              </div>
              <Button>
                <SaveAllIcon className="mr-2 h-4 w-4" />
                Atualizar senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Perfil;
