import type { Config } from 'payload/config'
import { getDeployments, handleRevalidate } from './endpoints'
import { revalidate } from './utils'
import { PluginOptions } from './types'
import DeployView from './components/views/deploy-view'
import DeployLink from './components/nav-links/deploy-link'
import { extendWebpackConfig } from './webpack'

export const payloadVercel =
  (pluginOptions: PluginOptions = {
    enabled: true,
    showDeployView: true
  }) =>
    (incomingConfig: Config) => {
      let config = { ...incomingConfig }

      const webpack = extendWebpackConfig(incomingConfig)

      config.admin = {
        ...(config.admin || {}),
        webpack,
        components: {
          ...(config.admin?.components || {}),
        },
      }

      const { enabled } = pluginOptions;

      if (enabled === false) {
        return config;
      }


      const isConfigSet = typeof pluginOptions.config === 'object' && Object.keys(pluginOptions.config).length > 0;
      const isDefaultSet = typeof pluginOptions.default === 'object' && (typeof pluginOptions.default.collections === 'object' || typeof pluginOptions.default.globals === 'object');


      if (isConfigSet || isDefaultSet) {
        /* For each collection in the plugin options, add an afterOperation hook that revalidates on create, update, and delete */
        config.collections = (config.collections || []).map(collection => {
          const isCollectionInConfig = isConfigSet && collection.slug in pluginOptions.config;
          if (isCollectionInConfig || isDefaultSet && typeof pluginOptions.default.collections === 'object') {
            if (pluginOptions.debug) {
              console.log(`Because ${isCollectionInConfig ? `${collection.slug} is in plugin config` : 'default config is set'}, adding revalidation hook to ${collection.slug}...`);
            }
            const { tags, paths } = isCollectionInConfig ? pluginOptions.config[collection.slug as keyof typeof pluginOptions.config] : pluginOptions.default.collections;
            return ({
              ...collection,
              hooks: {
                ...collection.hooks,
                afterOperation: [
                  ...(collection.hooks?.afterOperation || []),
                  async ({ operation, result }) => {
                    if (operation === 'create' || operation === 'update' || operation === 'delete' || operation === 'updateByID' || operation === 'deleteByID') {
                      if (pluginOptions.debug) {
                        console.log(`Revalidating tags: [${(tags || []).join(', ')}] and paths: [${(paths || []).map(p => typeof p === 'object' ? p.originalPath : p).join(', ')}] after ${operation} on ${collection.slug}...`);
                      }
                      await revalidate({ urls: pluginOptions.revalidationUrls, tags, paths });
                    }
                    return result;
                  }
                ]
              }
            })
          } else {
            return collection
          }
        });


        /* Same thing for globals, but globals only have afterChange since they can't be created or deleted */
        config.globals = (config.globals || []).map(global => {
          const isGlobalInConfig = isConfigSet && global.slug in pluginOptions.config;
          if (isGlobalInConfig || isDefaultSet && typeof pluginOptions.default.globals === 'object') {
            if (pluginOptions.debug) {
              console.log(`Because ${isGlobalInConfig ? `${global.slug} is in plugin config` : 'default config is set'}, adding revalidation hook to ${global.slug}...`);
            }
            const { tags, paths } = isGlobalInConfig ? pluginOptions.config[global.slug as keyof typeof pluginOptions.config] : pluginOptions.default.globals;
            return ({
              ...global,
              hooks: {
                ...global.hooks,
                afterChange: [
                  ...(global.hooks?.afterChange || []),
                  async ({ doc }) => {
                    if (pluginOptions.debug) {
                      console.log(`Revalidating tags: [${(tags || []).join(', ')}] and paths: [${(paths || []).map(p => typeof p === 'object' ? p.originalPath : p).join(', ')}] after change on ${global.slug}...`);
                    }
                    await revalidate({ urls: pluginOptions.revalidationUrls, tags, paths });
                    return doc;
                  }
                ]
              }
            })
          } else {
            return global
          }
        }
        )
      }

      if (pluginOptions.showDeployView) {
        /* Add endpoints to fetch latest deployments */
        config.endpoints = [
          ...(config.endpoints || []),
          {
            path: '/api/vercel/deployments',
            method: 'get',
            handler: getDeployments(pluginOptions),
            root: true,
          },
          {
            path: '/api/vercel/revalidate',
            method: 'post',
            handler: handleRevalidate(pluginOptions),
            root: true
          }
        ]
        /* Add deploy view to the Admin UI */
        config.admin = {
          ...(config.admin || {}),
          components: {
            ...(config.admin?.components || {}),
            views: {
              ...(config.admin?.components?.views || {}),
              DeployView: {
                // @ts-expect-error
                Component: (props) => DeployView({
                  pluginOptions: {
                    ...pluginOptions, deployHooks: (pluginOptions.deployHooks || []).map(hook => ({
                      ...hook,
                      useBuildCache: hook.useBuildCache || true,
                    }))
                  }
                  , ...props
                }),
                path: '/deploy',
              }
            },
            afterNavLinks: [
              ...(config.admin?.components?.afterNavLinks || []),
              DeployLink
            ]
          },
        }
      }

      return config
    }

export default payloadVercel;