# Litra
*Progressive Web App to control logitech Litra Glow streaming lights.*


[![Static Badge](https://img.shields.io/badge/Go%20to%20app-black?logo=github)](https://axeljaeger.github.io/litra/)
[![Unittests](https://github.com/axeljaeger/litra/actions/workflows/unittests.yml/badge.svg)](https://github.com/axeljaeger/litra/actions/workflows/unittests.yml)
[![Chromatic](https://github.com/axeljaeger/litra/actions/workflows/chromatic.yml/badge.svg)](https://github.com/axeljaeger/litra/actions/workflows/chromatic.yml)
[![Storybook](https://img.shields.io/badge/storybook-26077C?logo=storybook&logoColor=%23ffffff&labelColor=%23E06A8C)](https://main--64ecff17a1f3bdc4e2c65141.chromatic.com)

## Try it out
Litra is hosted on [Github Pages](https://axeljaeger.github.io/litra/). There, you can try out the application and if you like it, you can install the app using your browsers PWA installation mechanism.

You can also try out the components individually in 
[Storybook](https://main--64ecff17a1f3bdc4e2c65141.chromatic.com).

## Platform support
The technical foundation is the [WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API). This API is only supported on Chrome and Edge and Opera. The application has been successfully tested on both Mac and Windows.

## Development
Litra is developed using Typescript, Angular and Angular Material.