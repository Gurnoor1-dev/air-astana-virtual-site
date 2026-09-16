import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Card, PageHeader, Section } from "@/components/site/Page";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply — Air Arabia Virtual" },
      {
        name: "description",
        content:
          "Apply to fly for Air Arabia Virtual in Infinite Flight. Requirements, the application form and what happens next.",
      },
      { property: "og:title", content: "Apply — Air Arabia Virtual" },
      {
        property: "og:description",
        content: "Join Air Arabia Virtual — applications reviewed within 48 hours.",
      },
    ],
  }),
  component: Apply;
});

function Apply() {
  return <div />;
}
