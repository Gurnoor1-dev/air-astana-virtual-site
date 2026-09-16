import { Link } from "@tanstack/react-router";

import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img
            src={logo}
            alt="Air Arabia Virtual"
            className="h-8 w-auto"
            loading="lazy"
            width={288}
            height={144}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            A virtual airline flying the Air Arabia network inside Infinite Flight. Not affiliated
            with Air Arabia PJSC.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Airline</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/staff" className="hover:text-primary">
                Our Staff
              </Link>
            </li>
            <li>
              <Link to="/ranks" className="hover:text-primary">
                Ranks
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Operations</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/fleet" className="hover:text-primary">
                Fleet
              </Link>
            </li>
            <li>
              <Link to="/routes" className="hover:text-primary">
                Route Network
              </Link>
            </li>
            <li>
              <Link to="/hubs" className="hover:text-primary">
                Hubs
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Join us</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            Applications are open to all Infinite Flight pilots with a Grade 2 or above.
          </p>
          <Link
            to="/apply"
            className="mt-4 inline-flex rounded-md brand-gradient px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Apply now
          </Link>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Air Arabia Virtual — a fan-made virtual airline for Infinite
        Flight.
      </div>
    </footer>
  );
}
