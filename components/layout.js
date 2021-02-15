import Head from "next/head"
import Link from "next/link"

export const siteTitle = "Frontend Support Dashboard for VA.gov"

export default function Layout({ children, home }) {
  return (
    <div>
      <Head></Head>
      <main>{children}</main>
    </div>
  )
}
