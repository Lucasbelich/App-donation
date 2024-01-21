import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN as string,
});
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY!,
);

export default async function Home() {
  const donations = await supabase
    .from("donations")
    .select("*")
    .then(({ data }) => data);
  async function donate(formData: FormData) {
    "use server";

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: "donación",
            title: formData.get("message") as string,
            quantity: 1,
            unit_price: Number(formData.get("amount")),
          },
        ],
      },
    });
    redirect(preference.sandbox_init_point!);

    console.log(formData);
  }
  return (
    <section className="dark container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] bg-background px-4 font-sans antialiased">
      <header className="text-xl font-bold leading-[4rem]">App Donation</header>
      <main className="py-8">
        <section className="grid gap-12">
          <form
            action={donate}
            className="m-auto grid max-w-96 gap-8 border p-4 rounded-md shadow-lg"
          >
            <Label className="grid gap-2">
              <span>Valor</span>
              <Input type="number" name="amount" />
            </Label>
            <Label className="grid gap-2">
              <span>Tu mensaje en la donacion</span>
              <Textarea name="message" />
            </Label>
            <Button type="submit">Enviar</Button>
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cantidad</TableHead>
                <TableHead className="text-right ">Mensaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations?.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-bold">
                    {donation.amount.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {donation.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </main>
      <footer className="text-center leading-[4rem] opacity-70">
        © {new Date().getFullYear()}
      </footer>
    </section>
  );
}
