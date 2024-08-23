import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaveAllIcon, Settings } from "lucide-react";

import CadastroClientePage from "./(cadastro)/cadastro-clienteComponent";
import ManutencaoClientePage from "./(manutencao)/cliente-loginComponent";

const ClientePage = () => {
  return (
    <>
      

      <div className="flex flex-col m-5 flex-wrap ">
        <Tabs defaultValue="cadastro" className="w-full p-4">
          <TabsList>
            <TabsTrigger value="cadastro">
              <span className="flex items-center justify-center gap-2">
                <SaveAllIcon className="h-4 w-4" />
                Cadastro de clientes
              </span>
            </TabsTrigger>
            <TabsTrigger value="manutencao">
              <span className="flex items-center justify-center gap-2">
                <Settings className="h-4 w-4" />
                Manutenção de clientes
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cadastro">
           <Card>
            <CardHeader>
                <CardTitle>Cadastro de clientes</CardTitle>
                <CardDescription>Aqui é possível cadastrar os clientes</CardDescription>
            </CardHeader>
            <CardContent>
                <CadastroClientePage />
            </CardContent>
            
           </Card>
          </TabsContent>
          <TabsContent value="manutencao">
          <Card>
            <CardHeader>
                <CardTitle>Manutenção de clientes</CardTitle>
                <CardDescription>Aqui é possível gerenciar os clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <ManutencaoClientePage />
            </CardContent>
            
           </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ClientePage;
