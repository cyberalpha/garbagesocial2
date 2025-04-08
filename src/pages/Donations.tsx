import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, DollarSign, CreditCard, Bitcoin, Euro } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
const Donations = () => {
  const [customAmount, setCustomAmount] = useState<string>('');

  // Función para manejar donaciones mensuales
  const handleMonthlyDonation = (amount: string) => {
    toast({
      title: "Donación mensual",
      description: `Gracias por tu donación mensual de $${amount}. Te redirigiremos al proceso de pago.`
    });
    // Aquí iría la integración con el procesador de pagos
  };

  // Función para manejar donaciones únicas
  const handleSingleDonation = (amount: string) => {
    const donationAmount = amount === 'Otro' ? customAmount : amount;
    if (amount === 'Otro' && (!donationAmount || parseFloat(donationAmount) <= 0)) {
      toast({
        title: "Error de donación",
        description: "Por favor ingresa un monto válido para tu donación",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Donación única",
      description: `Gracias por tu donación de $${donationAmount}. Te redirigiremos al proceso de pago.`
    });
    // Aquí iría la integración con el procesador de pagos
  };

  // Función para copiar datos
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado al portapapeles",
      description: `Los datos de ${type} han sido copiados correctamente.`
    });
  };

  // Datos de criptomonedas
  const cryptoAddresses = {
    bitcoin: "0x850ed63ae1f72902543bc665311fe95e19a02c8f",
    ethereum: "0x850ed63ae1f72902543bc665311fe95e19a02c8f",
    usdt: "0x850ed63ae1f72902543bc665311fe95e19a02c8f"
  };
  return <Layout>
      <div className="container py-12 px-4 md:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Apoya a Garbage Social</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tu contribución nos ayuda a mantener y mejorar nuestra plataforma para conectar 
            residuos con recicladores en toda la comunidad.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          <Card className="flex flex-col">
            <CardHeader>
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-center">Contribución Mensual</CardTitle>
              <CardDescription className="text-center">
                Apóyanos con una contribución recurrente mensual
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button variant="outline" className="w-full" onClick={() => handleMonthlyDonation('5')}>$5</Button>
                <Button variant="outline" className="w-full" onClick={() => handleMonthlyDonation('10')}>$10</Button>
                <Button variant="outline" className="w-full" onClick={() => handleMonthlyDonation('25')}>$25</Button>
                <Button variant="outline" className="w-full" onClick={() => handleMonthlyDonation('50')}>$50</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleMonthlyDonation('10')}>Donar Mensualmente</Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-center">Donación Única</CardTitle>
              <CardDescription className="text-center">
                Contribuye con un monto único para apoyar nuestro trabajo
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button variant="outline" className="w-full" onClick={() => handleSingleDonation('20')}>$20</Button>
                <Button variant="outline" className="w-full" onClick={() => handleSingleDonation('50')}>$50</Button>
                <Button variant="outline" className="w-full" onClick={() => handleSingleDonation('100')}>$100</Button>
                <Button variant="outline" className="w-full" onClick={() => handleSingleDonation('Otro')}>Otro</Button>
              </div>
              {/* Input para monto personalizado */}
              <div className="mt-4">
                <Label htmlFor="customAmount">Monto personalizado ($)</Label>
                <Input id="customAmount" placeholder="Ingresa monto" type="number" value={customAmount} onChange={e => setCustomAmount(e.target.value)} className="mt-2" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleSingleDonation(customAmount || '20')}>Donar Ahora</Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CreditCard className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-center">Datos Bancarios</CardTitle>
              <CardDescription className="text-center">
                Transferencia directa a nuestras cuentas
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Cuenta Bancaria Argentina</h3>
                  <p className="text-sm text-muted-foreground">Banco: Galicia</p>
                  <p className="text-sm text-muted-foreground">CBU: 0070107131004016191808</p>
                  <p className="text-sm text-muted-foreground">Alias: MATE.BAHIA.CATAPLERA</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium">PayPal</h3>
                  <p className="text-sm text-muted-foreground">socialgarbage3000@gmail.com</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => handleCopy('socialgarbage3000@gmail.com', 'PayPal')}>
                Copiar Email PayPal
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Nueva sección para criptomonedas */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Donaciones con Criptomonedas</h2>
          <Card>
            <CardHeader>
              <Bitcoin className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <CardTitle className="text-center">Criptomonedas</CardTitle>
              <CardDescription className="text-center">
                También puedes colaborar usando criptomonedas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Bitcoin size={20} className="text-amber-500" />
                    <h3 className="font-medium">USD Coin (USDC)</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono break-all">{cryptoAddresses.bitcoin}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => handleCopy(cryptoAddresses.bitcoin, 'Bitcoin')}>
                    Copiar dirección
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Euro size={20} className="text-blue-400" />
                    <h3 className="font-medium">First Digital USD (FDUSD)</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono break-all">{cryptoAddresses.ethereum}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => handleCopy(cryptoAddresses.ethereum, 'Ethereum')}>
                    Copiar dirección
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={20} className="text-green-500" />
                    <h3 className="font-medium">USDT (Tether)</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono break-all">{cryptoAddresses.usdt}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => handleCopy(cryptoAddresses.usdt, 'USDT')}>
                    Copiar dirección
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">Tu apoyo hace la diferencia</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <h3 className="font-medium mb-2">Mejoras Tecnológicas</h3>
              <p className="text-sm text-muted-foreground">Actualización constante de la plataforma y nuevas funciones</p>
            </div>
            <div>
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-medium mb-2">Expansión Geográfica</h3>
              <p className="text-sm text-muted-foreground">Llegar a más comunidades en Argentina y Latinoamérica</p>
            </div>
            <div>
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h3 className="font-medium mb-2">Educación Ambiental</h3>
              <p className="text-sm text-muted-foreground">Desarrollo de materiales educativos sobre reciclaje</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>;
};
export default Donations;