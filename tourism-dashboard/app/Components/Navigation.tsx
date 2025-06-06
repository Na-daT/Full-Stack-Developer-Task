import { Button } from "@/components/ui/button";

export default function Navigation() {
    return (
        <nav className="navbar bg-gray-200 text-gray-700 p-4 min-w-fit shadow-md">
            <ul className="space-y-4">
                <li>
                    <Button variant="ghost" disabled>Intro</Button>
                </li>
                <li>
                    <Button variant="ghost">Categories</Button>
                </li>
                <li>
                    <Button variant="ghost">Timeline</Button>
                </li>
                <li>
                    <Button variant="ghost">Explore Regions</Button>
                </li>
                <li>
                    <Button variant="ghost">Locations</Button>
                </li>
                <li>
                    <Button variant="ghost">Aspects</Button>
                </li>
            </ul>
        </nav>
    );
}
