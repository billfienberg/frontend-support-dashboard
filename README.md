This project was bootstrapped with [Create Next App](https://github.com/segmentio/create-next-app).

Find the most recent version of this guide at [here](https://github.com/segmentio/create-next-app/blob/master/lib/templates/default/README.md). And check out [Next.js repo](https://github.com/zeit/next.js) for the most up-to-date info.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Questions? Feedback?](#questions-feedback)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
  - [`npm run dev`](#npm-run-dev)
  - [`npm run build`](#npm-run-build)
  - [`npm run start`](#npm-run-start)
- [Adding Components](#adding-components)
  - [`./components/simple.js`](#componentssimplejs)
  - [`./components/complex.js`](#componentscomplexjs)
- [Fetching Data](#fetching-data)
  - [`./pages/stars.js`](#pagesstarsjs)
- [Custom Server](#custom-server)
- [Syntax Highlighting](#syntax-highlighting)
- [Deploy to Now](#deploy-to-now)
- [Something Missing?](#something-missing)
- [How do we determine if a commit is on a specific environment?](#how-do-we-determine-if-a-commit-is-on-a-specific-environment)
- [Why are we using Next.js?](#why-are-we-using-nextjs)

## Questions? Feedback?

Check out [Next.js FAQ & docs](https://github.com/zeit/next.js#faq) or [let us know](https://github.com/segmentio/create-next-app/issues) your feedback.

## Folder Structure

After creating an app, it should look something like:

```
.
├── README.md
├── components
│   ├── head.js
│   └── nav.js
├── next.config.js
├── node_modules
│   ├── [...]
├── package.json
├── pages
│   └── index.js
├── static
│   └── favicon.ico
└── yarn.lock
```

Routing in Next.js is based on the file system, so `./pages/index.js` maps to the `/` route.

The `./static` directory maps to `/static` in the `next` server, so you can put all your
other static resources like images or compiled CSS in there.

Out of the box, we get:

- Automatic transpilation and bundling (with webpack and babel)
- Hot code reloading
- Server rendering and indexing of `./pages`
- Static file serving. `./static/` is mapped to `/static/`

Read more about [Next's Routing](https://github.com/zeit/next.js#routing)

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any errors in the console.

### `npm run build`

Builds the app for production to the `.next` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run start`

Starts the application in production mode.
The application should be compiled with \`next build\` first.

See the section in Next docs about [deployment](https://github.com/zeit/next.js/wiki/Deployment) for more information.

## Adding Components

We recommend keeping React components in `./components` and they should look like:

### `./components/simple.js`

```jsx
const Simple = () => <div>Simple Component</div>

export default Simple // don't forget to export default!
```

### `./components/complex.js`

```jsx
import { Component } from "react"

class Complex extends Component {
  state = {
    text: "World",
  }

  render() {
    const { text } = this.state
    return <div>Hello {text}</div>
  }
}

export default Complex // don't forget to export default!
```

## Fetching Data

You can fetch data in `pages` components using `getInitialProps` like this:

### `./pages/stars.js`

```jsx
const Page = (props) => <div>Next stars: {props.stars}</div>

Page.getInitialProps = async ({ req }) => {
  const res = await fetch("https://api.github.com/repos/zeit/next.js")
  const json = await res.json()
  const stars = json.stargazers_count
  return { stars }
}

export default Page
```

For the initial page load, `getInitialProps` will execute on the server only. `getInitialProps` will only be executed on the client when navigating to a different route via the `Link` component or using the routing APIs.

_Note: `getInitialProps` can **not** be used in children components. Only in `pages`._

Read more about [fetching data and the component lifecycle](https://github.com/zeit/next.js#fetching-data-and-component-lifecycle)

## Custom Server

Want to start a new app with a custom server? Run `create-next-app --example customer-server custom-app`

Typically you start your next server with `next start`. It's possible, however, to start a server 100% programmatically in order to customize routes, use route patterns, etc

This example makes `/a` resolve to `./pages/b`, and `/b` resolve to `./pages/a`:

```jsx
const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === "/a") {
      app.render(req, res, "/b", query)
    } else if (pathname === "/b") {
      app.render(req, res, "/a", query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(3000, (err) => {
    if (err) throw err
    console.log("> Ready on http://localhost:3000")
  })
})
```

Then, change your `start` script to `NODE_ENV=production node server.js`.

Read more about [custom server and routing](https://github.com/zeit/next.js#custom-server-and-routing)

## Syntax Highlighting

To configure the syntax highlighting in your favorite text editor, head to the [relevant Babel documentation page](https://babeljs.io/docs/editors) and follow the instructions. Some of the most popular editors are covered.

## Deploy to Now

[now](https://zeit.co/now) offers a zero-configuration single-command deployment.

1.  Install the `now` command-line tool either via the recommended [desktop tool](https://zeit.co/download) or via node with `npm install -g now`.

2.  Run `now` from your project directory. You will see a **now.sh** URL in your output like this:

    ```
    > Ready! https://your-project-dirname-tpspyhtdtk.now.sh (copied to clipboard)
    ```

    Paste that URL into your browser when the build is complete, and you will see your deployed app.

You can find more details about [`now` here](https://zeit.co/now).

## Something Missing?

If you have ideas for how we could improve this readme or the project in general, [let us know](https://github.com/segmentio/create-next-app/issues) or [contribute some!](https://github.com/segmentio/create-next-app/edit/master/lib/templates/default/README.md)

## How do we determine if a commit is on a specific environment?

1. We fetch the build text info
1. We split the build text string on the `\n` character
1. We grab the ref from the build text (currently the sixth line)
1. We declare a variable to keep track of whether a `sha` is before/equal/after the current build.txt `ref`, and initialize it to `false`
1. For each of the most recent 30 commits, we destructure the `sha` off the `commit`
1. We compare each `sha` to each environment's `ref`
1. Once a `sha` matches an environment `ref`, we update our variable from `false` to `true`
1. And we can assume that every commit after that will also be deployed

## Why are we using Next.js?

- Client-side requests for the BUILD.txt are blocked by the VA's CORS
- Client-side requests to GitHub's public REST API aren't blocked by CORS
