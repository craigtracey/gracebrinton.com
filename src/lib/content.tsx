import Markdoc, { type Node } from "@markdoc/markdoc";
import React from "react";

/**
 * Renders Keystatic markdoc content to React on the server.
 * `reader.<collection>.read(slug)` exposes `content` as an async function that
 * resolves to `{ node }` (a Markdoc AST). Pass that result straight in.
 */
export function MarkdocContent({ content }: { content: { node: Node } }) {
  const renderable = Markdoc.transform(content.node);
  return <>{Markdoc.renderers.react(renderable, React)}</>;
}
