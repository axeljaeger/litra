# Litra
*Progressive Web App to control logitech Litra Glow streaming lights.*

![animation](./litra.gif)

[![Static Badge](https://img.shields.io/badge/Go%20to%20app-404041?logo=cloudflarepages&logoColor=%23ffffff&labelColor=%23F38020)](https://litra.pages.dev/)
[![Unittests](https://github.com/axeljaeger/litra/actions/workflows/unittests.yml/badge.svg)](https://github.com/axeljaeger/litra/actions/workflows/unittests.yml)
[![Chromatic](https://github.com/axeljaeger/litra/actions/workflows/chromatic.yml/badge.svg)](https://github.com/axeljaeger/litra/actions/workflows/chromatic.yml)
[![Storybook](https://img.shields.io/badge/storybook-26077C?logo=storybook&logoColor=%23ffffff&labelColor=%23E06A8C)](https://main--64ecff17a1f3bdc4e2c65141.chromatic.com)
[![Angular](https://img.shields.io/badge/Angular-404041?logo=angular)](https://angular.dev)
[![WebHID](https://img.shields.io/badge/WebHID-404041?logo=mdnwebdocs)](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API)


## Try it out
Litra is hosted on [Cloudflare Pages](https://litra.pages.dev/). There, you can try out the application and if you like it, you can install the app using your browsers PWA installation mechanism.

You can also try out the components individually in 
[Storybook](https://main--64ecff17a1f3bdc4e2c65141.chromatic.com).

## Platform support
The technical foundation is the [WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API). This API is only supported on Chrome and Edge and Opera. The application has been successfully tested on both Mac and Windows.

## Development
Litra is developed using Typescript, Angular and Angular Material.