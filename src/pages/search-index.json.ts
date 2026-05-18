import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const all = await getCollection('docs');

  const index = all.map(doc => {
    const parts = doc.id.replace(/\.mdx?$/, '').split('/');
    const mod = parts[0];
    const page = parts[1];
    const isIndex = !page || doc.id.endsWith('/index.mdx') || doc.id.endsWith('/index.md');

    const href = isIndex ? `/docs/${mod}` : `/docs/${mod}/${page}`;

    // Extract plain text excerpt from body (strip MDX/markdown syntax)
    const raw = doc.body ?? '';
    const excerpt = raw
      .replace(/^---[\s\S]*?---/, '')          // frontmatter
      .replace(/```[\s\S]*?```/g, '')           // fenced code blocks
      .replace(/`[^`]+`/g, '')                  // inline code
      .replace(/!\[.*?\]\(.*?\)/g, '')          // images
      .replace(/<[^>]+>/g, '')                  // HTML / MDX tags
      .replace(/import\s+.*?from\s+['"].*?['"]/g, '') // import statements
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
      .replace(/#{1,6}\s+/g, '')                // headings
      .replace(/\*\*|__|[*_~]/g, '')            // bold/italic markers
      .replace(/[|>\-]{2,}/g, ' ')              // table separators, blockquotes
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 180);

    // Extract heading texts for search
    const headings = [...raw.matchAll(/^#{1,4}\s+(.+)$/gm)]
      .map(m => m[1].replace(/\*\*|__|[*_~]/g, '').trim());

    return {
      title: doc.data.title,
      mod: doc.data.mod,
      modTitle: doc.data.modTitle ?? doc.data.title,
      href,
      excerpt,
      headings,
    };
  });

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
