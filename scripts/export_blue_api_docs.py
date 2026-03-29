#!/usr/bin/env python3
from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path
from typing import Dict

import requests


API_DOCS_VIEW_URL = "https://blue.cc/assets/ApiDocsView-C8jjIFlJ.js"
API_DOCS_CONTENT_URL = "https://blue.cc/assets/api-docs-content-CyUWDlmP.js"
ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "reference" / "blue-api-docs"


def fetch(url: str) -> str:
    response = requests.get(
        url,
        headers={"User-Agent": "Mozilla/5.0"},
        timeout=60,
    )
    response.raise_for_status()
    return response.content.decode("utf-8")


def parse_raw_alias_map(api_docs_view_js: str) -> Dict[str, str]:
    pattern = re.compile(
        r'"(/src/content/api/[^"]+\.md)":\(\)=>e\(\(\)=>import\("./api-docs-content-[^"]+\.js"\)\.then\(t=>t\.([A-Za-z0-9_$]+)\)',
    )
    raw_aliases: Dict[str, str] = {}
    for path, alias in pattern.findall(api_docs_view_js):
        # The second occurrence for each path is the raw-markdown module used by CopyPageButton.
        raw_aliases[path] = alias
    return raw_aliases


def parse_alias_to_symbol(api_docs_content_js: str) -> Dict[str, str]:
    match = re.search(r"export\{(.*)\};\s*$", api_docs_content_js, re.DOTALL)
    if not match:
        raise RuntimeError("Could not locate export block in api-docs-content bundle.")

    alias_to_symbol: Dict[str, str] = {}
    for item in match.group(1).split(","):
        item = item.strip()
        if not item:
            continue
        symbol, alias = [part.strip() for part in item.split(" as ")]
        alias_to_symbol[alias] = symbol
    return alias_to_symbol


def parse_raw_module_default_var_map(api_docs_content_js: str) -> Dict[str, str]:
    pattern = re.compile(
        r'([A-Za-z0-9_$]+)=Object\.freeze\(Object\.defineProperty\(\{__proto__:null,default:([A-Za-z0-9_$]+)\},Symbol\.toStringTag,\{value:"Module"\}\)\)'
    )
    return {symbol: default_var for symbol, default_var in pattern.findall(api_docs_content_js)}


def extract_template_literal(js_source: str, variable_name: str) -> str:
    marker = f"{variable_name}=`"
    start = js_source.find(marker)
    if start == -1:
        raise RuntimeError(f"Could not locate template literal for variable {variable_name}.")

    i = start + len(marker)
    chars = []
    while i < len(js_source):
        ch = js_source[i]
        if ch == "\\":
            if i + 1 >= len(js_source):
                raise RuntimeError(f"Unexpected EOF while parsing template literal for {variable_name}.")
            chars.append(ch)
            chars.append(js_source[i + 1])
            i += 2
            continue
        if ch == "`":
            break
        chars.append(ch)
        i += 1
    else:
        raise RuntimeError(f"Unterminated template literal for {variable_name}.")

    body = "".join(chars)
    return (
        body.replace(r"\`", "`")
        .replace(r"\${", "${")
        .replace(r"\\", "\\")
        .strip()
        + "\n"
    )


def strip_frontmatter(markdown: str) -> str:
    if markdown.startswith("---\n"):
        _, _, remainder = markdown.split("---\n", 2)
        return remainder.lstrip()
    return markdown


def write_page(root: Path, relative_source_path: str, markdown: str) -> Path:
    relative_path = relative_source_path.removeprefix("/src/content/api/")
    output_path = root / relative_path
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(markdown, encoding="utf-8")
    return output_path


def build_index(root: Path, pages: Dict[str, str]) -> None:
    sections: dict[str, list[str]] = defaultdict(list)
    for relative_path in sorted(pages):
        section = relative_path.split("/")[0]
        sections[section].append(relative_path)

    lines = [
        "# Blue API Docs Export",
        "",
        "Generated from `https://blue.cc/api` on 2026-03-24.",
        "",
        "This export was extracted from Blue's published API docs bundle and written back out as Markdown.",
        "",
        "## What The Docs Confirm",
        "",
        "- Blue exposes a GraphQL API.",
        "- The main GraphQL endpoint referenced in the docs is `https://api.blue.cc/graphql`.",
        "- The official Python client documented by Blue is `bluepm`.",
        "- This export contains 90 API documentation pages organized by section.",
        "",
        "## Sections",
        "",
    ]

    for section in sorted(sections):
        lines.append(f"### {section}")
        lines.append("")
        for relative_path in sections[section]:
            route = relative_path.removesuffix(".md")
            title = pages[relative_path].splitlines()[1].replace("title: ", "") if pages[relative_path].startswith("---\n") else route.split("/")[-1]
            lines.append(f"- [{title}](./{route}.md)")
        lines.append("")

    (root / "README.md").write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def build_combined_reference(root: Path, pages: Dict[str, str]) -> None:
    sections: dict[str, list[str]] = defaultdict(list)
    for relative_path in sorted(pages):
        sections[relative_path.split("/")[0]].append(relative_path)

    lines = [
        "# Blue API Documentation",
        "",
        "Combined local export of every page currently published under `https://blue.cc/api`.",
        "",
    ]

    for section in sorted(sections):
        lines.append(f"## {section}")
        lines.append("")
        for relative_path in sections[section]:
            route = relative_path.removesuffix(".md")
            source_url = f"https://blue.cc/api/{route}"
            lines.append(f"### /api/{route}")
            lines.append("")
            lines.append(f"Source: {source_url}")
            lines.append("")
            lines.append(strip_frontmatter(pages[relative_path]).rstrip())
            lines.append("")

    (root / "ALL_DOCS.md").write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    api_docs_view_js = fetch(API_DOCS_VIEW_URL)
    api_docs_content_js = fetch(API_DOCS_CONTENT_URL)

    raw_alias_map = parse_raw_alias_map(api_docs_view_js)
    alias_to_symbol = parse_alias_to_symbol(api_docs_content_js)
    raw_module_default_var_map = parse_raw_module_default_var_map(api_docs_content_js)

    pages: Dict[str, str] = {}
    for source_path, alias in sorted(raw_alias_map.items()):
        symbol = alias_to_symbol.get(alias)
        if not symbol:
            raise RuntimeError(f"Missing export symbol for alias {alias} ({source_path}).")

        default_var = raw_module_default_var_map.get(symbol)
        if not default_var:
            raise RuntimeError(f"Missing raw module default mapping for symbol {symbol} ({source_path}).")

        markdown = extract_template_literal(api_docs_content_js, default_var)
        relative_path = source_path.removeprefix("/src/content/api/")
        pages[relative_path] = markdown

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for relative_path, markdown in pages.items():
        write_page(OUT_DIR, f"/src/content/api/{relative_path}", markdown)

    build_index(OUT_DIR, pages)
    build_combined_reference(OUT_DIR, pages)

    print(f"Exported {len(pages)} pages to {OUT_DIR}")


if __name__ == "__main__":
    main()
