#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, Iterable, List

import requests


ROOT = Path(__file__).resolve().parents[1]
CREDS_PATH = ROOT / ".local" / "blue-api-token.json"
OUT_DIR = ROOT / "reference" / "blue-api-live-schema"
GRAPHQL_URL = "https://api.blue.cc/graphql"


INTROSPECTION_QUERY = """
query IntrospectionQuery {
  __schema {
    queryType { name }
    mutationType { name }
    subscriptionType { name }
    types {
      kind
      name
      description
      fields(includeDeprecated: true) {
        name
        description
        args {
          name
          description
          defaultValue
          type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
        type {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
        }
        isDeprecated
        deprecationReason
      }
      inputFields {
        name
        description
        defaultValue
        type {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
      interfaces {
        kind
        name
        ofType {
          kind
          name
        }
      }
      enumValues(includeDeprecated: true) {
        name
        description
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        kind
        name
      }
    }
    directives {
      name
      description
      locations
      args {
        name
        description
        defaultValue
        type {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
""".strip()


def load_credentials() -> Dict[str, str]:
    data = json.loads(CREDS_PATH.read_text(encoding="utf-8"))
    return {
        "token_id": data["tokenId"],
        "secret": data["secret"],
    }


def fetch_introspection() -> Dict[str, Any]:
    creds = load_credentials()
    headers = {
        "Content-Type": "application/json",
        "X-Bloo-Token-ID": creds["token_id"],
        "X-Bloo-Token-Secret": creds["secret"],
    }
    response = requests.post(
        GRAPHQL_URL,
        json={"query": INTROSPECTION_QUERY},
        headers=headers,
        timeout=120,
    )
    response.raise_for_status()
    payload = response.json()
    if "errors" in payload:
        raise RuntimeError(f"GraphQL introspection failed: {payload['errors'][:2]}")
    return payload


def render_type_ref(type_ref: Dict[str, Any] | None) -> str:
    if not type_ref:
        return "Unknown"
    kind = type_ref.get("kind")
    name = type_ref.get("name")
    of_type = type_ref.get("ofType")
    if kind == "NON_NULL":
        return f"{render_type_ref(of_type)}!"
    if kind == "LIST":
        return f"[{render_type_ref(of_type)}]"
    return name or kind or "Unknown"


def clean(text: str | None) -> str:
    return (text or "").strip()


def is_builtin(name: str | None) -> bool:
    return bool(name and name.startswith("__"))


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def md_escape(text: str) -> str:
    return text.replace("\n", " ").replace("|", "\\|")


def bullet_list(items: Iterable[str]) -> List[str]:
    values = [item for item in items if item]
    if not values:
        return ["- None"]
    return [f"- {item}" for item in values]


def render_args(args: List[Dict[str, Any]]) -> List[str]:
    if not args:
        return ["No arguments."]
    lines = [
        "| Argument | Type | Default | Description |",
        "|---|---|---|---|",
    ]
    for arg in args:
        lines.append(
            f"| `{arg['name']}` | `{render_type_ref(arg['type'])}` | `{md_escape(arg.get('defaultValue') or '')}` | {md_escape(clean(arg.get('description')))} |"
        )
    return lines


def render_fields(fields: List[Dict[str, Any]]) -> List[str]:
    if not fields:
        return ["No fields."]
    lines: List[str] = []
    for field in fields:
        lines.append(f"### `{field['name']}`")
        lines.append("")
        lines.append(f"- Type: `{render_type_ref(field['type'])}`")
        if clean(field.get("description")):
            lines.append(f"- Description: {clean(field['description'])}")
        if field.get("isDeprecated"):
            lines.append(f"- Deprecated: yes")
            if clean(field.get("deprecationReason")):
                lines.append(f"- Deprecation reason: {clean(field['deprecationReason'])}")
        lines.append("")
        lines.append("Arguments:")
        lines.extend(render_args(field.get("args") or []))
        lines.append("")
    return lines


def render_input_fields(fields: List[Dict[str, Any]]) -> List[str]:
    if not fields:
        return ["No input fields."]
    lines = [
        "| Field | Type | Default | Description |",
        "|---|---|---|---|",
    ]
    for field in fields:
        lines.append(
            f"| `{field['name']}` | `{render_type_ref(field['type'])}` | `{md_escape(field.get('defaultValue') or '')}` | {md_escape(clean(field.get('description')))} |"
        )
    return lines


def render_enum_values(values: List[Dict[str, Any]]) -> List[str]:
    if not values:
        return ["No enum values."]
    lines = [
        "| Value | Deprecated | Description |",
        "|---|---|---|",
    ]
    for value in values:
        desc = clean(value.get("description"))
        if value.get("isDeprecated") and clean(value.get("deprecationReason")):
            desc = f"{desc} Deprecated: {clean(value['deprecationReason'])}".strip()
        lines.append(
            f"| `{value['name']}` | {'yes' if value.get('isDeprecated') else 'no'} | {md_escape(desc)} |"
        )
    return lines


def render_directives(directives: List[Dict[str, Any]]) -> str:
    lines = ["# Directives", ""]
    for directive in sorted(directives, key=lambda d: d["name"]):
        lines.append(f"## `@{directive['name']}`")
        lines.append("")
        if clean(directive.get("description")):
            lines.append(clean(directive["description"]))
            lines.append("")
        lines.append(f"Locations: {', '.join(directive.get('locations') or []) or 'None'}")
        lines.append("")
        lines.append("Arguments:")
        lines.extend(render_args(directive.get("args") or []))
        lines.append("")
    return "\n".join(lines)


def render_root_operations(name: str, root_type: Dict[str, Any] | None) -> str:
    lines = [f"# {name}", ""]
    if not root_type:
        lines.append("Not available in this schema.")
        return "\n".join(lines)
    lines.extend(render_fields(root_type.get("fields") or []))
    return "\n".join(lines)


def render_type_doc(type_obj: Dict[str, Any]) -> str:
    name = type_obj["name"]
    kind = type_obj["kind"]
    lines = [f"# `{name}`", ""]
    lines.append(f"- Kind: `{kind}`")
    if clean(type_obj.get("description")):
        lines.append(f"- Description: {clean(type_obj['description'])}")
    interfaces = [i["name"] for i in (type_obj.get("interfaces") or []) if i.get("name")]
    possible = [t["name"] for t in (type_obj.get("possibleTypes") or []) if t.get("name")]
    if interfaces:
        lines.append(f"- Interfaces: {', '.join(f'`{i}`' for i in interfaces)}")
    if possible:
        lines.append(f"- Possible Types: {', '.join(f'`{i}`' for i in possible)}")
    lines.append("")

    if kind in {"OBJECT", "INTERFACE"}:
        lines.append("## Fields")
        lines.append("")
        lines.extend(render_fields(type_obj.get("fields") or []))
    elif kind == "INPUT_OBJECT":
        lines.append("## Input Fields")
        lines.append("")
        lines.extend(render_input_fields(type_obj.get("inputFields") or []))
    elif kind == "ENUM":
        lines.append("## Values")
        lines.append("")
        lines.extend(render_enum_values(type_obj.get("enumValues") or []))
    elif kind == "UNION":
        lines.append("## Possible Types")
        lines.append("")
        lines.extend(bullet_list(f"`{name}`" for name in possible))
    elif kind == "SCALAR":
        lines.append("Scalar type.")
    else:
        lines.append("No additional details exported for this kind.")

    return "\n".join(lines)


def build_index(schema: Dict[str, Any], types: List[Dict[str, Any]], out_dir: Path) -> None:
    by_kind: Dict[str, List[str]] = defaultdict(list)
    for type_obj in types:
        by_kind[type_obj["kind"]].append(type_obj["name"])

    lines = [
        "# Blue Live GraphQL Schema",
        "",
        "Generated from live introspection at `https://api.blue.cc/graphql` on 2026-03-24.",
        "",
        f"- Query root: `{schema['queryType']['name']}`",
        f"- Mutation root: `{schema['mutationType']['name']}`" if schema.get("mutationType") else "- Mutation root: none",
        f"- Subscription root: `{schema['subscriptionType']['name']}`" if schema.get("subscriptionType") else "- Subscription root: none",
        f"- Type count: `{len(types)}`",
        f"- Directive count: `{len(schema.get('directives') or [])}`",
        "",
        "## Files",
        "",
        "- [Raw introspection JSON](./introspection.json)",
        "- [Queries](./operations/queries.md)",
        "- [Mutations](./operations/mutations.md)",
        "- [Subscriptions](./operations/subscriptions.md)",
        "- [Directives](./operations/directives.md)",
        "",
        "## Type Kinds",
        "",
    ]

    folder_map = {
        "OBJECT": "types/objects",
        "INPUT_OBJECT": "types/input-objects",
        "ENUM": "types/enums",
        "SCALAR": "types/scalars",
        "INTERFACE": "types/interfaces",
        "UNION": "types/unions",
    }
    for kind in ["OBJECT", "INPUT_OBJECT", "ENUM", "SCALAR", "INTERFACE", "UNION"]:
        names = sorted(by_kind.get(kind, []))
        lines.append(f"### {kind}")
        lines.append("")
        lines.append(f"- Count: `{len(names)}`")
        folder = folder_map[kind]
        for name in names:
            lines.append(f"- [{name}](./{folder}/{name}.md)")
        lines.append("")

    write_text(out_dir / "README.md", "\n".join(lines))


def main() -> None:
    payload = fetch_introspection()
    schema = payload["data"]["__schema"]

    write_text(OUT_DIR / "introspection.json", json.dumps(payload, indent=2))

    types = [
        t
        for t in schema["types"]
        if t.get("name") and not is_builtin(t["name"])
    ]
    types_by_name = {t["name"]: t for t in types}

    query_root = types_by_name.get(schema["queryType"]["name"])
    mutation_root = types_by_name.get(schema["mutationType"]["name"]) if schema.get("mutationType") else None
    subscription_root = types_by_name.get(schema["subscriptionType"]["name"]) if schema.get("subscriptionType") else None

    build_index(schema, types, OUT_DIR)
    write_text(OUT_DIR / "operations" / "queries.md", render_root_operations("Queries", query_root))
    write_text(OUT_DIR / "operations" / "mutations.md", render_root_operations("Mutations", mutation_root))
    write_text(OUT_DIR / "operations" / "subscriptions.md", render_root_operations("Subscriptions", subscription_root))
    write_text(OUT_DIR / "operations" / "directives.md", render_directives(schema.get("directives") or []))

    kind_dirs = {
        "OBJECT": OUT_DIR / "types" / "objects",
        "INPUT_OBJECT": OUT_DIR / "types" / "input-objects",
        "ENUM": OUT_DIR / "types" / "enums",
        "SCALAR": OUT_DIR / "types" / "scalars",
        "INTERFACE": OUT_DIR / "types" / "interfaces",
        "UNION": OUT_DIR / "types" / "unions",
    }

    counts: Dict[str, int] = defaultdict(int)
    for type_obj in sorted(types, key=lambda item: (item["kind"], item["name"])):
        kind = type_obj["kind"]
        if kind not in kind_dirs:
            continue
        write_text(kind_dirs[kind] / f"{type_obj['name']}.md", render_type_doc(type_obj))
        counts[kind] += 1

    print("Exported live schema")
    for kind in sorted(counts):
        print(kind, counts[kind])


if __name__ == "__main__":
    main()
