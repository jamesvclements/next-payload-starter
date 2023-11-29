import { PayloadHandler } from "payload/config";
import { revalidate } from "./utils";
import express from "express";
import { PluginOptions } from "./types";

const defaultOptions = {
  "headers": {
    "Authorization": `Bearer ${process.env.VERCEL_TOKEN}`
  },
  "method": "get"
}

/* Add route to fetch latest deployments */
export const getDeployments: (pluginOption: PluginOptions) => PayloadHandler = (pluginOptions) => async (_, res) => {
  const { vercelToken, vercelTeamId, vercelProjectId } = pluginOptions;
  if (!vercelToken || !vercelTeamId || !vercelProjectId) {
    return res.status(500).json({ error: 'Missing Vercel Token, Team ID or Project ID' });
  }
  /* Get latest deployments */
  const deployments = await (await fetch(`https://api.vercel.com/v6/deployments?teamId=${process.env.VERCEL_TEAM_ID}&projectId=${process.env.VERCEL_PROJECT_ID}&limit=5`, { ...defaultOptions })).json();

  /* Get domains */
  const domains = await (await fetch(`https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains?teamId=${process.env.VERCEL_TEAM_ID}`, { ...defaultOptions })).json();

  res.json({ domains: domains.domains, deployments: deployments.deployments });
}

export const handleRevalidate: (pluginOption: PluginOptions) => PayloadHandler[] = (pluginOptions) => [express.json(), async (req, res) => {
  console.log(`Manual revalidation endpoint hit with body: ${JSON.stringify(req.body)}`);
  const { tags, paths } = req.body;
  await revalidate({ urls: pluginOptions.revalidationUrls, tags, paths });
  res.json({ revalidated: true, now: Date.now() });
}]