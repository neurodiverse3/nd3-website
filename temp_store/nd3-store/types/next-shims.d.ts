// Minimal offline shims so this folder typechecks without a full Next.js install.
// Your real app already provides these from the `next` package — you can delete
// this file when dropping the components into your project.

declare module "next/link" {
	import type { ComponentType, AnchorHTMLAttributes, ReactNode } from "react"
	type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
		href: string
		children?: ReactNode
	}
	const Link: ComponentType<LinkProps>
	export default Link
}

declare module "next/navigation" {
	export function notFound(): never
}
