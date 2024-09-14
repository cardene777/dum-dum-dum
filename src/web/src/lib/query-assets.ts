import { QueriedAsset, Tag } from "../types/query";
import contractData from "../contracts/contractData.json";
import { queryAllTransactionsGQL } from "arweavekit/graphql";

// Helper functions
const findTagValue = (tagName: string, tags: Tag[]): string | undefined => {
  return tags.find((tag) => tag.name === tagName)?.value;
};

const findTopicValues = (tags: Tag[]): string[] => {
  return tags
    .filter((tag) => tag.name.includes(tag.value))
    .map((tag) => tag.value);
};

const determineLicense = (tags: Tag[]): string[] => {
  const licenses: string[] = [];

  if (findTagValue("Access", tags) === "Restricted") {
    licenses.push(findTagValue("Access", tags) ?? "");
    licenses.push(findTagValue("Access-Fee", tags) ?? "");
  } else if (findTagValue("Derivation", tags) === "Allowed-with-license-fee") {
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

// Function to fetch posts created from a defined contract source
export async function getAssetData(): Promise<any> {
  const response = await queryAllTransactionsGQL(query, {
    gateway: "arweave.net",
    filters: {},
  });

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

// Function to fetch posts filtered by the "holder" tag
export const getHolderAssetData = async (holder: string): Promise<any> => {
  const holderQuery = `
    query {
      transactions(tags: [
        { name: "Contract-Src", values: ["${queryId}"] },
        { name: "holder", values: ["${holder}"] }
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

  try {
    console.log(`holder: ${holder}`);
    const response = await queryAllTransactionsGQL(holderQuery, {
      gateway: "arweave.net",
      filters: {},
    });
    console.log(`response: ${JSON.stringify(response)}`);

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
  } catch (error) {
    console.error("Error fetching holder assets:", error);
    throw error;
  }
};

// Query requesting posts referencing the defined contract source
const queryId = contractData.contractId;
const query = `
query {
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
