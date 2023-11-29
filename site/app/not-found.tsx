import Section from "@/components/section/section";

export default function NotFound() {
  /* Instead of using this page, we redirect to 404, so we can force the light theme in the Provider */
  // redirect('/404');
  return <Section>404</Section>;
}
