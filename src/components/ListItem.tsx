import { cn } from "@/lib/utils"
import Link from "next/link"

type ListItemProps = {
    title: string,
    href: string,
    className?: string,
    description: string
}

export default function ListItem({ title, href, className, description }: ListItemProps) {
    return (        
        <li>
            <Link href={href}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {description}
                    </p>
            </Link>
        </li>
    )
}