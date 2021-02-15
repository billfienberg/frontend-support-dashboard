import Head from "next/head"
import Layout, { siteTitle } from "../components/layout"

export default function Home(props) {
  const { devBuildText, stagingBuildText, prodBuildText, commits } = props
  const devRows = devBuildText.split("\n").filter((x) => x)
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
            Dev's BUILD.txt <a href="https://dev.va.gov/BUILD.txt">(Link)</a>
          </h3>
          {devRows.map((x) => {
            return <div key={x}>{x}</div>
          })}
        </div>
        <div>
          <h3>
            Staging's BUILD.txt <a href="https://staging.va.gov/BUILD.txt">(Link)</a>
          </h3>
          {stagingRows.map((x) => {
            return <div key={x}>{x}</div>
          })}
        </div>
        <div>
          <h3>
            Prod's BUILD.txt <a href="https://www.va.gov/BUILD.txt">(Link)</a>
          </h3>
          {prodRows.map((x) => {
            return <div key={x}>{x}</div>
          })}
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const devBuildResponse = await fetch("https://dev.va.gov/BUILD.txt")
  const devBuildText = await devBuildResponse.text()

  const stagingBuildResponse = await fetch("https://staging.va.gov/BUILD.txt")
  const stagingBuildText = await stagingBuildResponse.text()

  const prodBuildResponse = await fetch("https://www.va.gov/BUILD.txt")
  const prodBuildText = await prodBuildResponse.text()

  const owner = "department-of-veterans-affairs"
  const repo = "vets-website"
  const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`)
  const commits = await commitsResponse.json()
  return {
    props: { devBuildText, stagingBuildText, prodBuildText, commits },
  }
}
