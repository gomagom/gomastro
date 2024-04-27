import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from './types/config'
import { LinkPreset } from './types/config'

export const siteConfig: SiteConfig = {
  title: 'Gomamiso',
  subtitle: 'gomatamagoのブログ',
  lang: 'ja',
  themeHue: 250,
  banner: {
    enable: true,
    src: 'assets/images/demo-banner.png',
  },
  favicon: [    // Leave this array empty to use the default favicon
    // {
    //   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
    //   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
    //   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
    // }
  ]
}

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    {
      name: 'iSarver',
      url: 'https://blog.isarver.com/',
      external: true,
    },
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: import.meta.env.STRAPI_AVATAR,
  name: 'ごま',
  bio: '休日ゲーマー，平日ゲーマー',
  start_year: 2021,
  links: [
    {
      name: 'Twitter',
      icon: 'fa6-brands:x-twitter',
      url: 'https://twitter.com',
    },
    {
      name: 'Steam',
      icon: 'fa6-brands:steam',
      url: 'https://steamcommunity.com/profiles/76561198304939923/',
    },
    {
      name: 'GitHub',
      icon: 'fa6-brands:github',
      url: 'https://github.com/gomagom',
    },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: false,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}
