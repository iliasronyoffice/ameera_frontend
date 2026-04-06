"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter((part) => part);

  // Construct breadcrumb items
  const breadcrumbs = pathParts.map((part, index) => {
    const href = "/" + pathParts.slice(0, index + 1).join("/");
    const label = decodeURIComponent(part)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize

    return { href, label };
  });

  return (
    <nav className="text-sm py-4">
      <ul className="flex items-center space-x-2 text-gray-600">
        <li>
          <Link href="/" className="hover:text-main font-medium">
            Home
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            <span className="mx-2">/</span>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-main font-semibold">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-main transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

