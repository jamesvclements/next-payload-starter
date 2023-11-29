import type { Config } from 'payload/config'

import { onInitExtension } from './onInitExtension'
import type { PluginOptions } from './types'
import { extendWebpackConfig } from './webpack'
import extendCollectionForMux from './collections/extendCollectionForMux'
import { webhook } from './endpoints/webhook'
import { createUpload, getUpload } from './endpoints/upload'

const payloadMux =
  (pluginOptions: PluginOptions) =>
    (incomingConfig: Config): Config => {
      let config = { ...incomingConfig }

      const webpack = extendWebpackConfig(incomingConfig)

      config.admin = {
        ...(config.admin || {}),
        webpack,
        components: {
          ...(config.admin?.components || {}),
        },
      }

      const { enabled, collection } = pluginOptions
      // If the plugin is disabled, return the config without modifying it
      // The order of this check is important, we still want any webpack extensions to be applied even if the plugin is disabled
      if (enabled === false) {
        return config
      }

      const videoCollection = config.collections?.find(c => c.slug === collection)
      if (!videoCollection) {
        throw new Error(`Could not find a collection with the slug ${collection}`);
      }
      const otherCollections = config.collections?.filter(c => c.slug !== collection)

      config.collections = [
        ...(otherCollections || []),
        extendCollectionForMux(videoCollection)
      ]

      config.endpoints = [
        ...(config.endpoints || []),
        /* Creates upload and returns the signed URL for MuxUploader to use on the front-end */
        {
          path: '/api/mux/upload',
          method: 'post',
          root: true,
          handler: createUpload(pluginOptions)
        },
        {
          path: '/api/mux/upload',
          method: 'get',
          root: true,
          handler: getUpload(pluginOptions)
        },
        /* When videos are deleted in Mux, this webhook catches the event and deletes the associated document in Payload */
        {
          path: '/api/mux/webhook',
          method: 'post',
          root: true,
          handler: webhook(pluginOptions)
        },
      ]

      config.globals = [
        ...(config.globals || []),
        // Add additional globals here
      ]

      config.hooks = {
        ...(config.hooks || {}),
        // Add additional hooks here
      }

      config.onInit = async payload => {
        if (incomingConfig.onInit) await incomingConfig.onInit(payload)
        // Add additional onInit code by using the onInitExtension function
        onInitExtension({ enabled, collection }, payload)
      }

      return config
    }

export default payloadMux;