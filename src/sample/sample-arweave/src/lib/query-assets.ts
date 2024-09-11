import contractData from "@/contracts/contractData.json";
import { QueriedAsset, Tag } from "@/types/query";
// imports
import { queryAllTransactionsGQL } from "arweavekit/graphql";

// function to fetch posts create from defined contract source
export async function getAssetData(): Promise<any> {
  const response = await queryAllTransactionsGQL(query, {
    gateway: "arweave.net",
    filters: {},
  });

  const findTagValue = (tagName: string, tags: Tag[]): string | undefined => {
    return tags.find((tag) => tag.name === tagName)?.value;
  };

  const findTopicValues = (tags: Tag[]): string[] => {
    return tags
      .filter((tag) => tag.name.includes(tag.value))
      .map((tag) => tag.value);
  };

  const determineLicense = (tags: Tag[]): string[] => {
    let licenses: string[] = [];

    if (findTagValue("Access", tags) === "Restricted") {
      licenses.push(findTagValue("Access", tags) ?? "");
      licenses.push(findTagValue("Access-Fee", tags) ?? "");
    } else if (
      findTagValue("Derivation", tags) === "Allowed-with-license-fee"
    ) {
      licenses.push(findTagValue("Derivation", tags) ?? "");
      licenses.push(findTagValue("Derivation-Fee", tags) ?? "");
    } else if (findTagValue("Commercial-Use", tags) === "Allowed") {
      licenses.push(findTagValue("Commercial-Use", tags) ?? "");
      licenses.push(findTagValue("Commercial-Fee", tags) ?? "");
    } else {
      licenses.push("Default-Public-Use");
      licenses.push("None");
    }

    return licenses;
  };

  return response.map((edges): QueriedAsset => {
    const tags = edges.node.tags;

    return {
      id: edges.node.id,
      title: findTagValue("Title", tags) || "",
      description: findTagValue("Description", tags) || "",
      license: determineLicense(tags),
      topics: findTopicValues(tags),
      creatorId: findTagValue("Creator", tags) || edges.node.owner.address,
      creatorName: findTagValue("Creator-Name", tags) || "",
    };
  });
}
// query requesting posts referencing the defined contract source
const queryId = contractData.contractId;
const query = `
query{
  transactions(tags: [
  { name: "Contract-Src", values: ["${queryId}"] }
  ] first: 100) {
edges {
  node {
    id
    owner {
      address
    }
    tags {
      name
      value
    }
    block {
      timestamp
    }
  }
}
}
}

`;
