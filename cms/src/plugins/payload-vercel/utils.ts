import { PluginOptions } from "./types";

export const revalidate = ({ urls, tags, paths }: {
  urls: PluginOptions['revalidationUrls'],
  tags: PluginOptions['default']['collections']['tags'],
  paths: PluginOptions['default']['collections']['paths']
}
) => Promise.all(urls.map(url => {
  console.log(`Revalidating ${url} with tags: [${(tags || []).join(', ')}] and paths: [${(paths || []).map(p => typeof p === 'object' ? p.originalPath : p).join(', ')}]...`)
  return fetch(url, {
    method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      revalidationKey: process.env.VERCEL_REVALIDATION_KEY,
      tags,
      paths
    })
  })
}));
