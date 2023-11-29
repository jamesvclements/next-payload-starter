import { mapPayloadMetadataToNextMetadata } from "@/lib/utils/utils";
import { Metadata, ResolvingMetadata } from "next";
import { getHomepage } from "./data";
import Section from "@/components/section/section";

export async function generateMetadata(_: any, parent: ResolvingMetadata) {
  const { meta } = await getHomepage();
  return mapPayloadMetadataToNextMetadata(meta, (await parent) as Metadata);
}

export default async function Home() {
  const home = await getHomepage();
  return (
    <div>
      <Section className="h-[calc(100vh-var(--nav-height))] pt-[--hero-padding-top]">
        <h1 className="text-headingMd mb-1">{home.title}</h1>
        <p className="">{home.description}</p>
      </Section>
    </div>
  );
}
