// import { Profile, AR, AO, ArweaveWallet } from "aonote";
// import {
//   createARInstance,
//   createAOInstance,
//   createProfileInstance,
//   createNotebookInstance,
// } from "./common";
// import { readFileSync } from "fs";
// import { resolve } from "path";

// const initInstances = async (): Promise<{
//   ar: AR;
//   ao: AO;
//   profile: Profile;
// }> => {
//   const ar = await createARInstance();
//   if (!ar) {
//     throw new Error("Failed to create AR instance");
//   }

//   const profile = await createProfileInstance(ao);
//   if (!profile) {
//     throw new Error("Failed to create profile instance");
//   }
//   return { ar, ao, profile };
// };

// export const createCollection = async (
//   title: string,
//   description: string,
//   // thumbnail: string,
//   // banner: string,
//   arweaveWallet: ArweaveWallet
// ) => {
//   const { profile, ao, ar } = await initInstances();

//   const result = await createNotebookInstance(profile, ao, arweaveWallet);
//   if (!result) {
//     throw new Error("Failed to create notebook instance");
//   }

//   const { notebook, collection_registry_pid } = result;
//   if (!notebook) {
//     throw new Error("Notebook is undefined");
//   }
//   // const thumbnail_data = await fetch(thumbnail).then((res) =>
//   //   res.arrayBuffer()
//   // );
//   // const banner_data = await fetch(banner).then((res) => res.arrayBuffer());
//   const thumbnail_data = readFileSync(
//     resolve(__dirname, `../../public/img/nft/collection/pack.png`),
//   )
//   const banner_data = readFileSync(
//     resolve(__dirname, `../../public/img/nft/collection/banner.png`),
//   )
//   const collection_pid = await notebook.create({
//     info: {
//       title,
//       description,
//       thumbnail_data,
//       thumbnail_type: "image/png",
//       banner_data,
//       banner_type: "image/png",
//     },
//     bazar: true,
//     jwk: {},
//   });
//   console.log(`collection_pid: ${collection_pid}`);

//   return collection_pid;
// };
