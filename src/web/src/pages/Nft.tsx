import { useState } from "react";
import { Header } from "../components/Header";
import { postAsset } from "../lib/post";
import { useActiveAddress } from "arweave-wallet-kit";
import { toast } from "react-toastify";
import mockGuns from "../../public/json/gun.json";
import { Assets } from "../components/Assets";

const Nft = () => {
  const address = useActiveAddress();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const randomGun = mockGuns[Math.floor(Math.random() * mockGuns.length)];
    try {
      const fileData = await fetch(randomGun.image);
      const blob = await fileData.blob();
      const file = new File([blob], randomGun.name, { type: fileData.headers.get('content-type') || 'image/png' });

      const transactionId = await postAsset({
        file: file,
        title: randomGun.name,
        description: randomGun.description || "",
        license: "default",
        payment: "",
        tags: [
          { name: "Rarity", value: randomGun.rarity },
          { name: "Level", value: randomGun.level.toString() },
          { name: "Attack", value: randomGun.attack.toString() },
          { name: "Type", value: "image" },
          { name: "Content-Type", value: "image/png" },
        ],
        creatorName:"cardene",
        creatorId: address || "",
      });
      toast(`Atomic asset uploaded! ${transactionId}`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="bg-gradient-to-b from-[#1a0b2e] to-[#eee5fb] text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
          Atomic Assets
        </h1>

        <div className="mb-8 flex items-center justify-center">
          <button
            onClick={onSubmit}
            className="bg-[#b19cd9] text-white rounded p-2"
          >
            Create Asset
          </button>
        </div>
      <div className="flex flex-wrap justify-center">
        <Assets isLoading={isLoading} />
      </div>
      </div>
    </>
  );
};

export default Nft;
