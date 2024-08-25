"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SaveAll, Settings, Settings2Icon } from "lucide-react";

import CadastroClientePage from "./(cadastro)/cadastro-clienteComponent";
import ManutencaoClientePage from "./(manutencao)/cliente-loginComponent";
import ManutencaoLoginPage from "./(manutencao)/loginManutencaoComponent";

import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";

import moment from "moment-timezone";

moment.tz.setDefault("America/Sao_Paulo");

const ClientePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <div className="card">
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel
            header={
              <>
                <div className="flex gap-2">
                  <SaveAll size={16} />
                  <span>Cadastro de Clientes</span>
                </div>
              </>
            }
          >
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <h1 className="font-extrabold m-2">
                    Aqui você pode adicionar novos clientes
                  </h1>
                </CardDescription>
                <CadastroClientePage />
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel
            header={
              <>
                <div className="flex gap-2">
                  <Settings2Icon size={16} />
                  <span>Manutenção de Clientes</span>
                </div>
              </>
            }
          >
            <Card>
              <CardHeader>
                <CardTitle>Manutenção de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <h1 className="font-extrabold m-2">
                    Aqui você pode adicionar logins aos clientes
                  </h1>
                  <h1 className="font-extrabold m-2">
                    Gerenciar os clientes cadastrados
                  </h1>
                </CardDescription>
                <ManutencaoClientePage />
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel
            header={
              <>
                <div className="flex gap-2">
                  <Settings size={16} />
                  <span>Manutenção de logins</span>
                </div>
              </>
            }
          >
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Manutenção de Logins</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <h1 className="font-extrabold m-2">
                      Aqui você pode gerenciar os logins dos clientes
                    </h1>
                  </CardDescription>
                  <ManutencaoLoginPage />
                </CardContent>
              </Card>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default ClientePage;
