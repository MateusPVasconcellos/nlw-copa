import previewImage from "../assets/aplicacao-trilha-ignite.png";
import logoImage from "../assets/logo.svg";
import avatarsImage from "../assets/avatares.png";
import Image from "next/image";
import checkImageIcon from "../assets/icon.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState<string>("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const {
        data: { code },
      } = await api.post("pools", {
        title: poolTitle,
      });

      await navigator.clipboard.writeText(code);
      alert(
        "Bolão criado com sucesso, o código foi copiado para a área de transferência!"
      );
      setPoolTitle("");
    } catch (error) {
      console.log(error);
      alert("Falha ao criar o bolão, tente novamente.");
    }
  }

  return (
    <div className="mx-auto grid h-screen max-w-[1124px] grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImage} alt="NLW Copa" />
        <h1 className="mt-14 text-5xl font-bold leading-tight text-white">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="itens-center mt-10 flex gap-2">
          <Image src={avatarsImage} alt="" />
          <strong className="text-xl text-gray-100">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            type="text"
            className="flex-1 rounded border border-gray-600 bg-gray-800 py-4 px-6 text-sm text-gray-100"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className="rounded bg-yellow-500 px-6 py-4 text-sm font-bold uppercase text-gray-900 hover:bg-yellow-600"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm leading-relaxed text-gray-300">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="text-gray-1 itens-center mt-10 flex justify-between border-t border-gray-600 pt-10 text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={checkImageIcon} alt="" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{props.poolCount}</span>
              <span> Bolões criados</span>
            </div>
          </div>

          <div className="h-15 w-px bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={checkImageIcon} alt="" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{props.guessCount}</span>
              <span> Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={previewImage}
        alt="Dois celulares exibindo uma previa"
        quality={100}
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
