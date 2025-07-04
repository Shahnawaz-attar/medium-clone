import { createClient, ClientConfig } from 'next-sanity'
import createImageUrlBuilder from '@sanity/image-url'

const config: ClientConfig = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  apiVersion: '2023-02-03',
  useCdn: process.env.NODE_ENV === 'production',
}

export const sanityClient = createClient(config)
export const urlFor = (source: any) =>
  createImageUrlBuilder(config as any).image(source)

export default sanityClient
