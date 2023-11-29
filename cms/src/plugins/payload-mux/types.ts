
import { CreateAssetParams } from '@mux/mux-node';
import { GeneratedTypes } from 'payload';

export interface PluginOptions {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean,
  /**
   * Collection(s) to use with this plugin
   */
  collection: keyof GeneratedTypes['collections'],
  /**
   * Asset settings to use when creating a new asset
   */
  newAssetSettings?: Partial<CreateAssetParams>
  /**
  * Debug mode shows logs in the console
  */
  debug?: boolean
}


export interface File {
  buffer: Buffer
  filename: string
  filesize: number
  mimeType: string
  tempFilePath?: string
}