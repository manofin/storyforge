import CharacterChatClient from "@/components/CharacterChatClient";

export default async function CharacterChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CharacterChatClient characterId={id} />;
}
