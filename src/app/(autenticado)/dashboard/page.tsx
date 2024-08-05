"use client";
import {  useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import api from "@/service/api";
import { SmilePlus, Users2 } from "lucide-react";




export default function Page() {
  const router = useRouter();
  const token = useRef<string | null>(null);

  if (typeof window !== "undefined") {
    token.current = localStorage.getItem("access_token") ?? "";
    if (token.current) {
    } else {
      router.push("/login");
    }
  }

  const token_intercept = () => {
    let a = token.current ? token.current : null;

    api.interceptors.request.use(
      (config) => {
        // Do something before request is sent

        config.headers["Authorization"] = "bearer " + a;
        return config;
      },

      (error) => {
        Promise.reject(error);
      }
    );
  };

  useEffect(() => {
    token_intercept();
  }, []);

  return (
    <>
      <div className=" flex gap-5 flex-wrap m-2">
        <Card>
          <CardHeader>
            <CardTitle>Meus logins(s)</CardTitle>
            <CardDescription className="max-w-lg text-balance leading-relaxed">
              Atualmente você tem 5 login(s) cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <SmilePlus className="mr-2" />
              Criar um novo login
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Meus cliente(s)</CardTitle>
            <CardDescription className="max-w-lg text-balance leading-relaxed">
              Atualmente você tem 10 cliente(s) cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Users2 className="mr-2" />
              Criar um novo cliente
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
