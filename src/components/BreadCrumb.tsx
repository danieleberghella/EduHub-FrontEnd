import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { useLocation, Link } from "react-router-dom";

export function BreadCrumb() {
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter((segment) => segment !== "");

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

               
                {pathSegments.map((segment, index) => {
                    const isLast = index === pathSegments.length - 1;
                    const href = "/" + pathSegments.slice(0, index + 1).join("/");

                    return (
                        <React.Fragment key={segment}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1))}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={href}>{decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1))}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
