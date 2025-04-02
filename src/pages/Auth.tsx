
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Recycle } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

// Esquema de validación para registro
const signUpSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
  type: z.enum(["individual", "organization"], {
    required_error: "Por favor selecciona un tipo de cuenta.",
  }),
});

// Esquema de validación para inicio de sesión
const signInSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido.",
  }),
  password: z.string().min(1, {
    message: "Por favor ingresa tu contraseña.",
  }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignInFormValues = z.infer<typeof signInSchema>;

export default function Auth() {
  const { signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>("signin");

  // Formulario de registro
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      type: "individual",
    },
  });

  // Formulario de inicio de sesión
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Manejar envío de formulario de registro
  async function onSignUpSubmit(values: SignUpFormValues) {
    await signUp(values.email, values.password, values.name, values.type);
  }

  // Manejar envío de formulario de inicio de sesión
  async function onSignInSubmit(values: SignInFormValues) {
    await signIn(values.email, values.password);
  }

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-10">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-2">
            <Recycle size={32} className="text-primary" />
            <span className="font-bold text-2xl">Garbage Social</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {tab === "signin" ? "Iniciar sesión" : "Crear cuenta"}
            </CardTitle>
            <CardDescription className="text-center">
              {tab === "signin"
                ? "Ingresa a tu cuenta para continuar"
                : "Registra una nueva cuenta para comenzar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Iniciar sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-6">
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input placeholder="ejemplo@correo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup">
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-6">
                    <FormField
                      control={signUpForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre o nombre de la organización" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input placeholder="ejemplo@correo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de cuenta</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="individual" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Persona (Individual)
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="organization" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Organización / Institución
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Registrando..." : "Crear cuenta"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            {tab === "signin" ? (
              <span>
                ¿No tienes cuenta?{" "}
                <Button variant="link" className="p-0" onClick={() => setTab("signup")}>
                  Regístrate
                </Button>
              </span>
            ) : (
              <span>
                ¿Ya tienes cuenta?{" "}
                <Button variant="link" className="p-0" onClick={() => setTab("signin")}>
                  Inicia sesión
                </Button>
              </span>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
