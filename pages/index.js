import Head from "next/head"
import Layout, { siteTitle } from "../components/layout"

// https://github.com/department-of-veterans-affairs/vets-website/blob/1cee564813462d6fe3896a10e477016f7cac2ebd/jenkins/common.groovy#L316
const vetsWebsiteBuildTexts = {
  dev: "https://dev-va-gov-assets.s3-us-gov-west-1.amazonaws.com/BUILD.txt",
  staging: "http://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com/BUILD.txt",
  prod: "https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/BUILD.txt",
}

// https://github.com/department-of-veterans-affairs/content-build/blob/844d3170a92005dbee70a7ecf643362137ba68c3/jenkins/common.groovy#L280
const contentBuildBuildTexts = {
  dev: "https://dev.va.gov/BUILD.txt",
  staging: "https://staging.va.gov/BUILD.txt",
  prod: "https://www.va.gov/BUILD.txt",
}

export default function Home(props) {
  const { devBuildText = "", stagingBuildText, prodBuildText, commits } = props
  const devRows = devBuildText.split("\n").filter((x) => x) || []
  const stagingRows = stagingBuildText.split("\n").filter((x) => x)
  const prodRows = prodBuildText.split("\n").filter((x) => x)
  const devRef = devRows[6].slice(4)
  const stagingRef = stagingRows[6].slice(4)
  const prodRef = prodRows[6].slice(4)
  let isOnDev = false
  let isOnStaging = false
  let isOnProd = false

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <h2>Commits</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>SHA</th>
            <th>Link</th>
            <th>On Dev?</th>
            <th>On Staging?</th>
            <th>On Prod?</th>
          </tr>
        </thead>
        <tbody>
          {commits.map((x) => {
            const { commit = {}, html_url, sha } = x
            const { committer = {} } = commit
            const { date } = committer
            if (sha === devRef) isOnDev = true
            if (sha === stagingRef) isOnStaging = true
            if (sha === prodRef) isOnProd = true
            const onDevStyle = isOnDev ? { background: "green" } : {}
            const onStagingStyle = isOnStaging ? { background: "green" } : {}
            const onProdStyle = isOnProd ? { background: "green" } : {}
            return (
              <tr key={sha}>
                <td>{date}</td>
                <td>{sha}</td>
                <td>
                  <a href={html_url}>GitHub</a>
                </td>
                <td style={onDevStyle}>{isOnDev ? "TRUE" : "FALSE"}</td>
                <td style={onStagingStyle}>{isOnStaging ? "TRUE" : "FALSE"}</td>
                <td style={onProdStyle}>{isOnProd ? "TRUE" : "FALSE"}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <h3>
            Dev's BUILD.txt <a href={vetsWebsiteBuildTexts.dev}>(Link)</a>
          </h3>
          {devRows.map((x) => {
            return <div key={x}>{x}</div>
          })}
        </div>
        <div>
          <h3>
            Staging's BUILD.txt <a href={vetsWebsiteBuildTexts.staging}>(Link)</a>
          </h3>
          {stagingRows.map((x) => {
            return <div key={x}>{x}</div>
          })}
        </div>
        <div>
          <h3>
            Prod's BUILD.txt <a href={vetsWebsiteBuildTexts.prod}>(Link)</a>
          </h3>
          {prodRows.map((x) => {
            return <div key={x}>{x}</div>
          })}
        </div>
      </div>
    </Layout>
  )
}

// https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps() {
  // BUILD.txt info for each environment

  // TODO: Handle errors
  const devBuildResponse = await fetch(vetsWebsiteBuildTexts.dev)
  const devBuildText = await devBuildResponse.text()

  // TODO: Handle errors
  const stagingBuildResponse = await fetch(vetsWebsiteBuildTexts.staging)
  const stagingBuildText = await stagingBuildResponse.text()

  // TODO: Handle errors
  const prodBuildResponse = await fetch(vetsWebsiteBuildTexts.prod)
  const prodBuildText = await prodBuildResponse.text()

  // last 30 commits from vets-website
  const owner = "department-of-veterans-affairs"
  const repo = "vets-website"

  // TODO: Handle errors
  const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`)
  const commits = await commitsResponse.json()
  return {
    props: {
      devBuildText,
      stagingBuildText,
      prodBuildText,
      commits,
    },
  }
}
