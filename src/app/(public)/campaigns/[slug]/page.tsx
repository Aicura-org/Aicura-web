import CampaignPublicPage, { generateMetadata as baseGenerateMetadata } from '../../campaign/[slug]/page';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props) {
  return baseGenerateMetadata(props);
}

export default async function CampaignsSlugPage(props: Props) {
  return CampaignPublicPage(props);
}
