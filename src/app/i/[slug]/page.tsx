import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import InvitationWrapper from "@/components/invitation/InvitationWrapper";
import type { InvitationData } from "@/types/invitation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ print?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await db.invitation.findUnique({
    where: { slug, isActive: true },
  });
  if (!invitation) return { title: "Taklif topilmadi" };

  const title =
    invitation.eventType === "WEDDING" && invitation.groomName
      ? `${invitation.groomName} & ${invitation.brideName} — To'yga taklif`
      : `${invitation.brideName} — Qiz bazmi taklifnomasi`;

  return {
    title,
    description: `${invitation.venueName} — ${invitation.venueAddress}`,
  };
}

export default async function InvitationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { print } = await searchParams;

  const invitation = await db.invitation.findUnique({
    where: { slug, isActive: true },
    include: {
      musicTrack: true,
      template: true,
    },
  });

  if (!invitation) notFound();

  // View count oshirish (fire and forget)
  db.invitation.update({
    where: { id: invitation.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  const data: InvitationData = {
    id: invitation.id,
    slug: invitation.slug,
    eventType: invitation.eventType as "WEDDING" | "BACHELORETTE",
    groomName: invitation.groomName,
    brideName: invitation.brideName,
    eventDate: invitation.eventDate.toISOString(),
    eventTime: invitation.eventTime,
    venueName: invitation.venueName,
    venueAddress: invitation.venueAddress,
    yandexMapUrl: invitation.yandexMapUrl,
    googleMapUrl: invitation.googleMapUrl,
    letterText: invitation.letterText,
    letterTextRu: invitation.letterTextRu,
    photoUrl: invitation.photoUrl,
    musicTrack: invitation.musicTrack
      ? {
          fileUrl: invitation.musicTrack.fileUrl,
          title: invitation.musicTrack.title,
          artist: invitation.musicTrack.artist ?? undefined,
        }
      : null,
    customMusicUrl: invitation.customMusicUrl,
    cardNumber: invitation.cardNumber,
    cardHolder: invitation.cardHolder,
    template: {
      slug: invitation.template.slug,
      name: invitation.template.name,
    },
  };

  return <InvitationWrapper data={data} initialOpened={print === "1"} />;
}
