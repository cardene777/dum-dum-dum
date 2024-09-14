// import { AR, AO, Profile, Notebook, ArweaveWallet } from "aonote";

// export const createARInstance = async (): Promise<AR | null> => {
//   try {
//     const ar = new AR({ port: 4000 });
//     await ar.init();
//     return ar;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

// export const createAOInstance = async (ar: AR): Promise<AO | null> => {
//   try {
//     const ao = new AO({ ar });
//     await ao.init();
//     return ao;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

// export const createProfileInstance = async (): Promise<Profile | null> => {
//   try {
//     const profile = new Profile({});
//     await profile.init();
//     return profile;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

// export const createNotebookInstance = async (
//   profile: Profile,
//   ao: AO,
//   arweaveWallet: ArweaveWallet
// ): Promise<{ notebook: Notebook; collection_registry_pid: string } | null> => {
//   try {
//     const notebook = await new Notebook({ profile, ao }).init(arweaveWallet);
//     const { err, pid: collection_registry_pid } =
//       await notebook.createRegistry();
//     if (err) {
//       throw new Error(err);
//     }
//     return { notebook, collection_registry_pid };
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };
