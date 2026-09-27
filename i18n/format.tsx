import { Fragment, type ReactNode } from "react";

type Vars = Record<string, string | number>;

/** fills {placeholders} in a dictionary string */
export function t(template: string, vars: Vars = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

/** like t(), but placeholders can be react nodes, e.g. a highlighted number */
export function rich(template: string, vars: Record<string, ReactNode>): ReactNode {
  return template.split(/(\{\w+\})/g).map((part, i) => {
    const key = part.match(/^\{(\w+)\}$/)?.[1];
    return <Fragment key={i}>{key && key in vars ? vars[key] : part}</Fragment>;
  });
}
