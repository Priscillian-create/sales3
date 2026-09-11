import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={title:"PA GERRYS | Charging desk",description:"Device check-ins, payments and collections for PA GERRYS.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
