import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

/**
 * Server-only content reader. Reads the committed markdown/markdoc + YAML from
 * the working tree at build/request time. Do not import from Client Components.
 */
export const reader = createReader(process.cwd(), keystaticConfig);
