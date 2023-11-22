import Contentstack from "contentstack";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

/* 
  For SSR the environment variables are not required to be public.
  Hence if it's only SSR, you can remove the NEXT_PUBLIC_ prefix.
*/
const CS_API_KEY = process.env.NEXT_PUBLIC_CS_API_KEY ?? "";
const CS_CONTENT_TYPE_UID = process.env.NEXT_PUBLIC_CS_CONTENT_TYPE_UID ?? "";
const CS_ENTRY_UID_SSR = process.env.NEXT_PUBLIC_CS_ENTRY_UID_SSR ?? "";
const CS_DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CS_DELIVERY_TOKEN ?? "";
const CS_ENVIRONMENT = process.env.NEXT_PUBLIC_CS_ENVIRONMENT ?? "";
const CS_MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CS_MANAGEMENT_TOKEN ?? "";

const Stack = Contentstack.Stack({
  api_key: CS_API_KEY,
  delivery_token: CS_DELIVERY_TOKEN,
  environment: CS_ENVIRONMENT,
  live_preview: {
    enable: true,
    host: "api.contentstack.io",
    management_token: CS_MANAGEMENT_TOKEN,
  },
});

ContentstackLivePreview.init({
  //@ts-ignore
  stack: Stack,
  ssr: true,
});

export default function Home({ data }: any) {
  return (
    <>
      <h1>{data?.headline}</h1>
      <p>{data?.description}</p>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  if (context?.query) {
    Stack.livePreviewQuery(context.query);
  }

  // This is a simple example. You can also use CS SDK to fetch data using SLUG / URL
  const data = await Stack.ContentType(CS_CONTENT_TYPE_UID)
    .Entry(CS_ENTRY_UID_SSR)
    .toJSON()
    .fetch();

  return {
    props: {
      data,
    },
  };
};
