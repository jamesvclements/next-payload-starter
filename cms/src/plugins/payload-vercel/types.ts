
import { GeneratedTypes } from 'payload';

type Tags = string[];

type Paths = (string | {
  originalPath: string;
  type?: 'page' | 'layout';
})[]

export interface PluginOptions {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean,
  /**
   * Route handler on the front-end to use for revalidation
   */
  revalidationUrls?: string[];
  default?: {
    collections?: {
      /**
       * Tag(s) to revalidate when a document is updated
       */
      tags?: Tags;
      /**
       * Path(s) to revalidate when a document is updated
       */
      paths?: Paths;
    }
    globals?: {
      /**
       * Tag(s) to revalidate when a document is updated
       */
      tags?: Tags;
      /**
       * Path(s) to revalidate when a document is updated
       */
      paths?: Paths;
    }
  }
  config?: Partial<{
    [key in keyof GeneratedTypes['collections'] | keyof GeneratedTypes['globals']]: {
      /**
       * Tag(s) to revalidate when this collection or global is updated
       */
      tags?: Tags;
      /**
       * Path(s) to revalidate when this collection or global is updated
       */
      paths?: Paths;
    }
  }>
  /**
   * Show the deploy view in the admin
   * @default true
   */
  showDeployView?: boolean;
  /**
   * Deploy hooks to trigger builds. Added as buttons to the deploy view
   */
  deployHooks?: {
    /**
     * Label for the deploy hook button
     */
    label: string,
    /**
     * URL to trigger the deploy hook
     */
    url: string,
    /**
     * Use the build cache or not
     */
    useBuildCache?: boolean
  }[],
  /**
   * Vercel token to use for API requests
   */
  vercelToken?: string;
  /**
   * Vercel team ID to use for API requests
   */
  vercelTeamId?: string;
  /**
   * Vercel project ID to use for API requests
   */
  vercelProjectId?: string;
  /**
   * Debug mode shows logs in the console
   */
  debug?: boolean
}