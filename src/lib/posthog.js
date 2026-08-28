import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init('phc_D8ze3GBerbNJsxJUpdsEsK2GPNbrG2noK7jtBkYtRWBj', {
      api_host: 'https://app.posthog.com',
      capture_pageview: true,
    })
  }
}

export default posthog
