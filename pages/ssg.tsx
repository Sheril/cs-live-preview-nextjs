import Contentstack from "contentstack";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { useEffect, useState } from "react";

const CS_API_KEY = process.env.NEXT_PUBLIC_CS_API_KEY ?? "";
const CS_CONTENT_TYPE_UID = process.env.NEXT_PUBLIC_CS_CONTENT_TYPE_UID ?? "";
const CS_ENTRY_UID_SSG = process.env.NEXT_PUBLIC_CS_ENTRY_UID_SSG ?? "";
const CS_DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CS_DELIVERY_TOKEN ?? "";
const CS_ENVIRONMENT = process.env.NEXT_PUBLIC_CS_ENVIRONMENT ?? "";
const CS_MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CS_MANAGEMENT_TOKEN ?? "";

const Stack = Contentstack.Stack({
  api_key: CS_API_KEY,
  delivery_token: CS_DELIVERY_TOKEN,
  environment: CS_ENVIRONMENT,
  live_preview: {
    management_token: CS_MANAGEMENT_TOKEN,
    enable: true,
    host: "api.contentstack.io",
  },
});

ContentstackLivePreview.init({
  //@ts-ignore
  stackSdk: Stack,
});

const getData = async () => {
  const response = await Stack.ContentType(CS_CONTENT_TYPE_UID)
    .Entry(CS_ENTRY_UID_SSG)
    .toJSON()
    .fetch();

  return response;
};

export default function Page({ entry }: any) {
  const [data, setData] = useState(entry);

  const fetchData = async () => {
    const response = await getData();
    setData(response);
  };

  useEffect(() => {
    ContentstackLivePreview.onEntryChange(fetchData);
  }, []);

  return (
    <>
      <h1>{data?.headline}</h1>
      <p>{data?.description}</p>
    </>
  );
}

export const getStaticProps = async () => {
  const entry = await getData();

  return {
    props: {
      entry,
    },
  };
};
