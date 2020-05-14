import Head from "next/head"
import styles from "./layout.module.css"
import utilStyles from "../styles/utils.module.css"
import Link from "next/link"

export const siteTitle = "Next.js Sample Website"

export default function Layout({ children, home }) {
  return (
    <div>
      <Head></Head>
      <main>{children}</main>
    </div>
  )
}
