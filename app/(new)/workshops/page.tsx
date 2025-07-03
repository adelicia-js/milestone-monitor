import React from "react";
import CategoryPageWrapper from "@/components/new/categories/CategoryPageWrapper";

export const dynamic = "force-dynamic";

export default async function Workshops() {
  return <CategoryPageWrapper categoryTitle="Workshops" />;
}
